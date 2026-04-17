import React from "react";

import MyProfile from "@/components/shared/MyProfile";
import { getUserInfo } from "@/services/auth.service";

const MyProfilePage = async () => {
  const data = await getUserInfo();
  return <MyProfile data={data} />;
};

export default MyProfilePage;
