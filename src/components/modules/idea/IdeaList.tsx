"use client";

import { getIdea } from "@/services/auth.service";
import { useQuery } from "@tanstack/react-query";

const IdeaList = () => {
  const { data } = useQuery({
    queryKey: ["idea"],
    queryFn: () => getIdea(),
  });
  console.log(data.data);
  return (
    <div>
      {data.data?.map((idea: any) => (
        <div key={idea.id}>{idea.title}</div>
      ))}
    </div>
  );
};

export default IdeaList;
