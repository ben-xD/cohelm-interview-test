import { db, migrationsFolder } from "./db/db";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Fastify from "fastify";
import fastifyMultipart from "@fastify/multipart";
import fs from "node:fs";
import util from "node:util";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import cors from "@fastify/cors";
import { pipeline } from "node:stream";
import { v4 as uuidv4 } from "uuid";
import {
  InsertMedicalRecordsSchema,
  medicalRecordsTable,
  selectMedicalRecordsSchema,
  utilizationReviewTable,
} from "./db/schema/utilizationReview";
import predict from "./predict";
import { z } from "zod";
import { eq } from "drizzle-orm";

const pump = util.promisify(pipeline);
import "dotenv/config";

const getUploadFolderPath = () => {
  // In a real project, I would store them in Cloudflare R2 (AWS S3 alternative).
  // I do this in e.g. https://banananator.pages.dev
  const uploadFolder = "/tmp-uploads/";
  if (process.env.mode === "production") {
    return __dirname + uploadFolder;
  } else {
    const appRoot = __dirname + "/..";
    return appRoot + uploadFolder;
  }
};
const uploadFolderPath = getUploadFolderPath();

migrate(db, { migrationsFolder });

const fastify = Fastify({
  logger: true,
});
fastify.register(fastifyMultipart, {
  limits: {
    fileSize: 10_000_000,
  },
});
fastify.register(fastifySwagger, {
  mode: "static",
  specification: {
    path: "./openapi.yaml",
    baseDir: "./",
  },
});
fastify.register(cors, {
  methods: ["GET", "PUT", "POST", "OPTIONS", "PATCH", "DELETE"],
  // Simpler for this demo to allow all requests.
  origin: true,
});

// I'd put swagger UI behind auth or only in development mode in a real project
// but it's nice to see it when deployed.
fastify.register(fastifySwaggerUi, {
  routePrefix: "/documentation",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
  uiHooks: {
    onRequest: function (request, reply, next) {
      next();
    },
    preHandler: function (request, reply, next) {
      next();
    },
  },
  staticCSP: false,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => {
    return swaggerObject;
  },
  transformSpecificationClone: true,
});

fastify.get<{ Params: { patientId: string } }>(
  "/:patientId/medical-records",
  async (request, reply) => {
    const { patientId } = request.params;

    const records = db
      .select()
      .from(medicalRecordsTable)
      .where(eq(medicalRecordsTable.patientId, patientId))
      .all();
    return selectMedicalRecordsSchema.array().parse(records);
  }
);

// TODO Route to static files (web page)
fastify.post<{ Params: { patientId: string } }>(
  "/:patientId/medical-records",
  async (request, reply) => {
    const { patientId } = request.params;

    if (!fs.existsSync(uploadFolderPath)) {
      fs.mkdirSync(uploadFolderPath);
    }

    const dbInserts: InsertMedicalRecordsSchema[] = [];
    const failedFileUploads: string[] = [];
    const successfulFileUploads: { filename: string; id: string }[] = [];
    for await (const part of request.files()) {
      if (
        part.type === "file" &&
        part.filename.toLowerCase().endsWith(".pdf")
      ) {
        const fileId = uuidv4();

        const uploadFilePath = uploadFolderPath + fileId + ".pdf";
        console.info(`Saving to ${uploadFilePath}`);
        await pump(part.file, fs.createWriteStream(uploadFilePath));
        if (part.file.truncated) {
          failedFileUploads.push(part.filename);
        } else {
          successfulFileUploads.push({ filename: part.filename, id: fileId });
          dbInserts.push({
            id: fileId,
            patientId,
            uploadedAt: new Date(),
            originalFilename: part.filename,
          });
        }
      } else {
        failedFileUploads.push(part.filename);
      }
    }
    if (dbInserts.length > 0)
      db.insert(medicalRecordsTable).values(dbInserts).run();
    return reply.status(200).send({ failedFileUploads, successfulFileUploads });
  }
);

fastify.post<{ Params: { patientId: string } }>(
  "/:patientId/utilization-reviews",
  async function handler(request, reply) {
    const { patientId } = request.params;

    const { guidelinesText, medicalRecordIds } = z
      .object({
        medicalRecordIds: z.string().array().optional(),
        guidelinesText: z.string(),
      })
      .parse(request.body);

    // A real predict function would want the medical records too
    // Load medical records that belong to the same user from disk, to give it to the predict function.
    const medicalRecords = medicalRecordIds?.map((id) => "file contents");
    const review = await predict({
      guidelinesText,
      medicalRecords: medicalRecords ?? [],
    });

    const reviewId = uuidv4();
    db.insert(utilizationReviewTable)
      .values({
        id: reviewId,
        createdAt: new Date(),
        patientId,
        guidelines: guidelinesText,
        review: JSON.stringify(review),
      })
      .run();

    return reply.status(200).send(review);
  }
);

// We could also scope this for each patient easily.
fastify.get("/utilization-reviews", async (request, reply) => {
  const reviews = db
    .select()
    .from(utilizationReviewTable)
    .orderBy(utilizationReviewTable.createdAt)
    .all();

  // If we stored individual evidence in a separate table, we can left join them here:
  // const reviews = db
  //   .select()
  //   .from(utilizationReviewTable)
  //   .orderBy(utilizationReviewTable.createdAt)
  //   .leftJoin(
  //     utilizationReviewEvidenceTable,
  //     eq(
  //       utilizationReviewTable.id,
  //       utilizationReviewEvidenceTable.utilizationReviewId
  //     )
  //   )
  //   .all();

  return reviews;
});

// So fly can control the port.
const port = Number(process.env.PORT) || 8080;

fastify
  .listen({ port, host: "0.0.0.0" })
  .then((address) => console.info(`Listening on ${address}`))
  .catch((err) => {
    fastify.log.error(err);
    process.exit(1);
  });
