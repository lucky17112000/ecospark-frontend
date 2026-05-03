"use server";
import BlogsShow from "@/components/blogs/Blog";
import { getUserInfo } from "@/services/auth.service";
import { getBlogs } from "@/services/blog.service";
import { QueryClient } from "@tanstack/react-query";
import React from "react";

const BlogShowPage = async () => {
  const queryClient = new QueryClient();
  try {
    await queryClient.prefetchQuery({
      queryKey: ["blogShow"],
      queryFn: () => getBlogs(),
    });
  } catch (error) {
    console.error("Blog show prefetch skipped:", error);
  }
  const userInfo = await getUserInfo();
  console.log("User info in blog page:", userInfo);
  const BlogsShowAny = BlogsShow as any;
  return <BlogsShowAny userInfo={userInfo} />;
};

export default BlogShowPage;
