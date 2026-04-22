"use client";

import * as React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type AppTooltipProps = {
  trigger: React.ReactElement;
  content: React.ReactNode;
  delay?: number;
} & React.ComponentPropsWithoutRef<typeof TooltipContent>;

export default function AppTooltip({
  trigger,
  content,
  delay = 0,
  ...contentProps
}: AppTooltipProps) {
  return (
    <TooltipProvider delay={delay}>
      <Tooltip>
        <TooltipTrigger render={trigger} />
        <TooltipContent {...contentProps}>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
