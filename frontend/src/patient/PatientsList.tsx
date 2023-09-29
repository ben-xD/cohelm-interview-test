import { Box, Card, Flex, Text } from "@radix-ui/themes";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Patient } from "./Patient";
import Avatar from "boring-avatars";
import Fuse from "fuse.js";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";

{
  /* <Button variant="outline">Add medical record</Button> */
}

const profilesApiUrl = "https://jsonplaceholder.typicode.com/users";

export const PatientsCard = ({ patient }: { patient: Patient }) => {
  return (
    <Link
      to="/$patientId/create-utilization-review"
      params={{ patientId: patient.id }}
    >
      <Card className="hover:border-transparent hover:bg-gray-200 transition-all duration-300">
        <Flex gap="3" align="center">
          <Avatar size={40} name={patient.name} variant="beam" />
          <Box>
            <Text as="div" size="2" weight="bold">
              {patient.name}
            </Text>
          </Box>
        </Flex>
      </Card>
    </Link>
  );
};

export const PatientsList = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["patients"],
    queryFn: () => {
      return fetch(profilesApiUrl).then<Patient[]>(async (res) => res.json());
    },
  });

  const patientsSearch = useMemo(() => {
    if (!data) return undefined;
    // I'd debounce and make a network request to search for all
    // relevant patients instead of just using Fuse (local fuzzy search).
    return new Fuse(data, { keys: ["name"] });
  }, [data]);

  useEffect(() => {
    const results = patientsSearch?.search(searchQuery);
    setSearchResults(results?.map((patient) => patient.item) || []);
  }, [searchQuery, patientsSearch]);

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    if (error instanceof Error) {
      return <span>Error: {error.message}</span>;
    } else {
      return <span>Error: unknown error</span>;
    }
  }

  return (
    <div className="m-4 flex flex-col gap-2">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Your patients
      </h2>
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        type="text"
        placeholder="Name"
      />
      {(searchResults.length === 0 ? data : searchResults).map((patient) => (
        <PatientsCard key={patient.id} patient={patient} />
      ))}
    </div>
  );
};
