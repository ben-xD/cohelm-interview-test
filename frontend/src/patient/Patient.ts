import { z } from "zod";

export const patientSchema = z.object({
  id: z.string(),
  name: z.string(),
});
export type Patient = z.infer<typeof patientSchema>;
