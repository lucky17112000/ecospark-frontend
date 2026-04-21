"use client";
import ChangePassword from "@/components/modules/auth/ChangePassword";
// import { getIdea2 } from "@/services/idea.services";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const changePassword = () => {
  // const { data } = useQuery({
  //   queryKey: ["idea"],
  //   queryFn: getIdea2,
  // });
  // console.log(data);
  return <ChangePassword />;
};

export default changePassword;
