//!SECTION reusable inut field
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { AnyFieldApi } from "@tanstack/react-form";
import { Divide } from "lucide-react";
import React from "react";
type AppFieldProps = {
  field: AnyFieldApi;
  label: string;
  type?: "text" | "email" | "password" | "number";
  placeholder?: string;
  append?: React.ReactNode;
  prepand?: React.ReactNode;
  classname?: string;
  disabled?:false;
};
const getErrorMessage = (error: unknown) => {
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }

  return String(error);
};

const AppField = ({
  field,
  label,
  type = "text",
  placeholder,
  append,
  prepand,
  classname,
  disabled,
}: AppFieldProps) => {
  const FirstError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0
      ? getErrorMessage(field.state.meta.errors[0])
      : null; // from zod validation
  const hasError = FirstError !== null;
  return (
    <div className={cn("space-y-1.5", classname)}>
      <Label
        htmlFor={field.name}
        className={cn(
          hasError ? "text-destructive" : "",
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        )}
      >
        {label}
      </Label>
      <div className="relative">
        {prepand && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
            {prepand}
          </div>
        )}
        <Input
          id={field.name}
          name={field.name}
          type={type}
          placeholder={placeholder}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${field.name}-error` : undefined}
          className={cn(
            prepand && "pl-10",
            append && "pr-10",
            hasError && "border-destructive focus-visible:ring-destructive/20",
          )}
        />
        {append && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none z-10">
            {append}
          </div>
        )}
        {hasError && (
          <p
            id={`${field.name}-error`}
            role="alert"
            className="mt-1 text-sm text-destructive"
          >
            {FirstError}
          </p>
        )}
      </div>
    </div>
  );
};

export default AppField;
