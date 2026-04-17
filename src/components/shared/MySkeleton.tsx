import React from "react";
import { Skeleton } from "../ui/skeleton";

const MySkeleton = () => {
  return (
    <div className="flex h-screen w-full flex-col gap-7 p-6">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-full" />
      </div>
      <Skeleton className="h-8 w-24" />
    </div>
  );
};

export default MySkeleton;
