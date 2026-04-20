import SelectedIdeaPage from "@/components/modules/idea/SelectedIdeaPage";
import { getUserInfo } from "@/services/auth.service";
import React from "react";

const SelectedIdeaPageComponent = async () => {
  const user = await getUserInfo();
  return <SelectedIdeaPage user={user} />;
};

export default SelectedIdeaPageComponent;
