"use server";
import CreateIdeaPage from "@/components/modules/idea/CreateIdea";
import { getUserInfo } from "@/services/auth.service";

import React from "react";

const createIdeaPage = async () => {
  const userInfo = await getUserInfo();
  // console.log("User Info:", userInfo.id);
  return <CreateIdeaPage id={userInfo.id} />;
};

export default createIdeaPage;
