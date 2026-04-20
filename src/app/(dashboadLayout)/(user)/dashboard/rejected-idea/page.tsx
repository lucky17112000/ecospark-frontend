import RejectedIdeaPage from "@/components/modules/idea/RejectedIdea";
import { getUserInfo } from "@/services/auth.service";
import React from "react";

const RejectedIdea = async () => {
  const user = await getUserInfo();
  return <RejectedIdeaPage user={user} />;
};

export default RejectedIdea;
