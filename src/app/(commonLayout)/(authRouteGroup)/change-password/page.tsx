"use client";
import { getIdea2 } from "@/services/idea.services";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const ChangePassword = () => {
  const { data } = useQuery({
    queryKey: ["idea"],
    queryFn: getIdea2,
  });
  console.log(data);
  return (
    <div>
      <h1>Change Password</h1>
    </div>
  );
};

export default ChangePassword;
