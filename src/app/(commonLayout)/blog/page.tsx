"use server";
import BlogsShow from "@/components/blogs/Blog";
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
  return <BlogsShow />;
};

export default BlogShowPage;
