import { httpClient } from "@/lib/axios/httpClient";

export const getIdea = async () => {
  const idea = await httpClient.get("/idea");
  return idea;
};
