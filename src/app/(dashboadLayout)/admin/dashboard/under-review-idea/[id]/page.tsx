"use client";

import AppSubmitButton from "@/components/shared/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ideaUpdatebyAdminAction,
  toggleIdeaIspaidAction,
  toggleIdeaIspaidPayload,
} from "@/services/idea.services";
import type { ApiResponse } from "@/types/api.types";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";

type IdeaUpdateByAdminPayload = {
  ideaId: string;
  ideaStatus: "APPROVED" | "REJECTED" | "";
  message: string;
  reason:
    | "FEASIBILITY_ISSUE"
    | "INCOMPLETE"
    | "DUPLICATE_IDEA"
    | "IRRELEVANT"
    | "OTHER"
    | "";
};

// ("use client");
/*
"ideaId":"e358b52b-674f-4f05-8ba3-00b9ad3021be",
    "ideaStatus":"APPROVED",
    "message":"Your Idea is Awesome i approved it lets enjoy",
    "reason":"OTHER"*/

const IdeaReciePage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const ideaIdFromParams =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
        ? params.id[0]
        : "";

  const isPaidFromQuery = (() => {
    const raw = searchParams?.get("isPaid");
    if (raw === null) return null;
    const normalized = raw.trim().toLowerCase();
    if (["1", "true", "yes"].includes(normalized)) return true;
    if (["0", "false", "no"].includes(normalized)) return false;
    return null;
  })();

  const [isPaid, setIsPaid] = useState<boolean>(isPaidFromQuery ?? false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { mutateAsync } = useMutation({
    mutationFn: (payload: IdeaUpdateByAdminPayload) =>
      ideaUpdatebyAdminAction(payload),
  });

  const { mutateAsync: toggleIdeaIspaid, isPending: isTogglingPaid } =
    useMutation({
      mutationFn: (payload: toggleIdeaIspaidPayload) =>
        toggleIdeaIspaidAction(payload),
    });
  const form = useForm({
    defaultValues: {
      ideaId: ideaIdFromParams,
      ideaStatus: "",
      message: "",
      reason: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = (await mutateAsync(
          value as IdeaUpdateByAdminPayload,
        )) as ApiResponse<unknown> | undefined;
        if (result && result.success === false) {
          setServerError(
            result.message || "Failed to update idea. Please try again.",
          );
        }
      } catch (error: unknown) {
        console.error("Error updating idea:", error);
        setServerError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
        );
      }
    },
  });

  return (
    <div className="w-full">
      <form
        method="POST"
        action="#"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6"
      >
        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle className="text-base sm:text-lg">
              Edit Idea (Admin Review)
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5 pt-6">
            <form.Field name="ideaId">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name}>Idea ID</Label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={String(field.state.value ?? "")}
                    readOnly
                    className="h-10 w-full rounded-lg border border-input bg-muted/30 px-3 text-sm text-foreground"
                  />
                </div>
              )}
            </form.Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label>isPaid</Label>
                <Button
                  type="button"
                  variant={isPaid ? "destructive" : "outline"}
                  className="h-10 w-full rounded-lg"
                  disabled={!ideaIdFromParams || isTogglingPaid}
                  onClick={async () => {
                    if (!ideaIdFromParams) return;
                    setServerError(null);
                    const nextPaid = !isPaid;
                    try {
                      const result = await toggleIdeaIspaid({
                        ideaId: ideaIdFromParams,
                        isPaid: nextPaid,
                      });

                      if (
                        result &&
                        typeof result === "object" &&
                        "success" in result
                      ) {
                        const typed = result as {
                          success?: unknown;
                          message?: unknown;
                        };
                        if (typed.success === false) {
                          setServerError(
                            typeof typed.message === "string" && typed.message
                              ? typed.message
                              : "Failed to toggle isPaid. Please try again.",
                          );
                          return;
                        }
                      }

                      setIsPaid(nextPaid);
                    } catch (error: unknown) {
                      console.error("Error toggling isPaid:", error);
                      setServerError(
                        error instanceof Error
                          ? error.message
                          : "An unexpected error occurred. Please try again.",
                      );
                    }
                  }}
                >
                  {isTogglingPaid
                    ? "Updating..."
                    : isPaid
                      ? "Paid (click to set Unpaid)"
                      : "Unpaid (click to set Paid)"}
                </Button>
              </div>

              <form.Field name="ideaStatus">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor={field.name}>Status</Label>
                    <select
                      id={field.name}
                      name={field.name}
                      value={String(field.state.value ?? "")}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm"
                    >
                      <option value="">Select Status</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </div>
                )}
              </form.Field>

              <form.Field name="reason">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor={field.name}>Reason</Label>
                    <select
                      id={field.name}
                      name={field.name}
                      value={String(field.state.value ?? "")}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm"
                    >
                      <option value="">Select Reason</option>
                      <option value="FEASIBILITY_ISSUE">
                        FEASIBILITY_ISSUE
                      </option>
                      <option value="INCOMPLETE">INCOMPLETE</option>
                      <option value="DUPLICATE_IDEA">DUPLICATE_IDEA</option>
                      <option value="IRRELEVANT">IRRELEVANT</option>
                      <option value="OTHER">OTHER</option>
                    </select>
                  </div>
                )}
              </form.Field>
            </div>

            <form.Field name="message">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name}>Message</Label>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={String(field.state.value ?? "")}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Write your feedback for the user"
                  />
                </div>
              )}
            </form.Field>

            {serverError && (
              <Alert className="border border-neutral-200 bg-neutral-50 rounded-xl py-3 px-4">
                <AlertDescription className="text-sm text-red-600">
                  {serverError}
                </AlertDescription>
              </Alert>
            )}

            <form.Subscribe
              selector={(s) => [s.canSubmit, s.isSubmitting] as const}
            >
              {([canSubmit, isSubmitting]) => (
                <AppSubmitButton
                  isPending={isSubmitting}
                  disabled={!canSubmit}
                  pendingLabel="Updating..."
                  classname="w-full h-10 rounded-lg"
                >
                  Update Idea
                </AppSubmitButton>
              )}
            </form.Subscribe>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default IdeaReciePage;
