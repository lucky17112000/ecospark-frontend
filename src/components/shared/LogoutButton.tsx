"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/services/auth.service";

type LogoutButtonProps = {
  redirectTo?: string;
  className?: string;
};

export default function LogoutButton({
  redirectTo = "/login",
  className,
}: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  return (
    <Button
      type="button"
      variant="ghost"
      disabled={loading}
      className={cn("w-full justify-start", className)}
      onClick={async () => {
        try {
          setLoading(true);
          await logoutAction();
          router.replace(redirectTo);
          router.refresh();
        } finally {
          setLoading(false);
        }
      }}
    >
      <LogOut className="mr-2 h-4 w-4" />
      {loading ? "Logging out..." : "Logout"}
    </Button>
  );
}
