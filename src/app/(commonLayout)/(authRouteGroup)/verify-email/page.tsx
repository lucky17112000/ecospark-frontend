import VerifyEmail from "@/components/modules/auth/VerifyEmail";
import React, { Suspense } from "react";

const verifyPassword = () => {
  return (
    <Suspense fallback={null}>
      <VerifyEmail />
    </Suspense>
  );
};

export default verifyPassword;
