import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React from "react";
type AppSubmitButtProps = {
  isPending?: boolean;
  children: React.ReactNode;
  pendingLabel?: string;
  classname?: string;
  disabled?: boolean;
};

const AppSubmitButton = ({
  isPending,
  children,
  pendingLabel = "Submitting...",
  classname,
  disabled,
}: AppSubmitButtProps) => {
  const isDisabled = disabled || isPending;
  return (
    <Button type="submit" disabled={isDisabled}>
      {isPending ? (
        <>
          <Loader2 className="animate-spin" aria-hidden="true" />
          {pendingLabel ? pendingLabel : children}
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default AppSubmitButton;
