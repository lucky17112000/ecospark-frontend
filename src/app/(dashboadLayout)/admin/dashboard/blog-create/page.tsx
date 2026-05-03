"use server";
import CreateBlog from "@/components/modules/Admin-mangment/blog/CreateBlog";
import { getUserInfo } from "@/services/auth.service";

import React from "react";

const BlogCreatePage = async () => {
  const userInfo = await getUserInfo();
  return <CreateBlog userInfo={userInfo} />;
};

export default BlogCreatePage;
