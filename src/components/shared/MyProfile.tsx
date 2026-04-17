"use client";

import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type ProfileData = {
  name?: string | null;
  email?: string | null;
  emailVerified?: boolean | null;
  image?: string | null;
  role?: string | null;
  status?: string | null;
  updatedAt?: string | Date | null;
  createdAt?: string | Date | null;
};

const formatDateTime = (value: ProfileData["createdAt"]) => {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const renderText = (value?: string | null) => {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed.length > 0 ? trimmed : "—";
};

const getAvatarFallbackChar = (name?: string | null, email?: string | null) => {
  const candidate = (name ?? "").trim() || (email ?? "").trim();
  if (!candidate) return "?";
  return candidate.slice(0, 1).toUpperCase();
};

function InfoItem({
  label,
  children,
  valueClassName,
}: {
  label: string;
  children: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div
        className={[
          "min-h-5 text-sm font-medium text-foreground",
          valueClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>
    </div>
  );
}

const MyProfile = ({ data }: { data: ProfileData }) => {
  const emailVerified = data?.emailVerified;
  const status = renderText(data?.status);
  const role = renderText(data?.role);
  const avatarFallback = getAvatarFallbackChar(data?.name, data?.email);
  const imageUrl = typeof data?.image === "string" ? data.image.trim() : "";

  return (
    <div className="w-full max-w-3xl px-4 py-6 sm:px-6">
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <Avatar size="lg">
              {imageUrl ? (
                <AvatarImage src={imageUrl} alt={data?.name ?? "Profile"} />
              ) : null}
              <AvatarFallback className="text-base font-semibold">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <CardTitle className="truncate">
                {renderText(data?.name)}
              </CardTitle>
              <CardDescription className="break-all">
                {renderText(data?.email)}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem label="Name">{renderText(data?.name)}</InfoItem>
              <InfoItem label="Email" valueClassName="break-all">
                {renderText(data?.email)}
              </InfoItem>
              <InfoItem label="Email Verified">
                {emailVerified === true ? (
                  <Badge>Verified</Badge>
                ) : emailVerified === false ? (
                  <Badge variant="destructive">Not verified</Badge>
                ) : (
                  "—"
                )}
              </InfoItem>
              <InfoItem label="Role">
                <Badge variant={role === "—" ? "outline" : "outline"}>
                  {role}
                </Badge>
              </InfoItem>
              <InfoItem label="Status">
                <Badge variant={status === "—" ? "outline" : "secondary"}>
                  {status}
                </Badge>
              </InfoItem>
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem label="Updated At">
                {formatDateTime(data?.updatedAt)}
              </InfoItem>
              <InfoItem label="Created At">
                {formatDateTime(data?.createdAt)}
              </InfoItem>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyProfile;
