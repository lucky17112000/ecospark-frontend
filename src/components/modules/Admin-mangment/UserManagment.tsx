"use client";
import {
  deleteUserByAdminAction,
  getAllUserByAdmiAction,
  updateUserRoleByAdminAction,
} from "@/services/admin.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { map } from "zod";

type UserCount = {
  ideas?: number;
  votes?: number;
};

type UserRow = {
  id?: string;
  name?: string;
  email?: string;
  status?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  emailVerified?: boolean;
  _count?: UserCount;
};

type UserRole = "ADMIN" | "USER";

const toUserRole = (value: unknown): UserRole | null => {
  const role = typeof value === "string" ? value.trim().toUpperCase() : "";
  if (role === "ADMIN" || role === "USER") return role;
  return null;
};

const getNextRole = (currentRole: unknown): UserRole => {
  const normalized = toUserRole(currentRole);
  return normalized === "ADMIN" ? "USER" : "ADMIN";
};

const safeDate = (value: unknown): string => {
  if (!value) return "—";
  const date = new Date(
    typeof value === "string" || typeof value === "number"
      ? value
      : String(value),
  );
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
};

const UserManagment = () => {
  const queryClient = useQueryClient();
  const page = 1;
  const limit = 3;
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", page, limit],
    queryFn: () => getAllUserByAdmiAction({ page, limit }),
  });

  const users = useMemo(() => {
    const rows = (data as unknown as { data?: unknown })?.data;
    return Array.isArray(rows) ? (rows as UserRow[]) : ([] as UserRow[]);
  }, [data]);
  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: deleteUserByAdminAction,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const { mutate: changeRole, isPending: isChangingRole } = useMutation({
    mutationFn: updateUserRoleByAdminAction,
    onMutate: (vars) => {
      setUpdatingUserId(vars.userId);
    },
    onSettled: () => {
      setUpdatingUserId(null);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return (
    <Card className="shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="border-b">
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          View users and take actions (static buttons for now).
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Loading users…
          </div>
        ) : isError ? (
          <div className="py-8 text-center text-sm text-destructive">
            Failed to load users.
          </div>
        ) : users.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No users found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Ideas</TableHead>
                <TableHead>Votes</TableHead>
                <TableHead>Email Verified</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user, index) => {
                const key = user.id || `${user.email || "user"}-${index}`;
                const status = (user.status || "").toUpperCase();
                const roleLabel = user.role || "—";
                const ideasCount = user._count?.ideas ?? 0;
                const votesCount = user._count?.votes ?? 0;
                const verified = Boolean(user.emailVerified);
                const userId = user.id?.trim() || "";
                const nextRole = getNextRole(user.role);
                const rowLoading = Boolean(
                  userId && isChangingRole && updatingUserId === userId,
                );

                return (
                  <TableRow key={key} className="odd:bg-muted/20">
                    <TableCell className="text-muted-foreground">
                      {index + 1}
                    </TableCell>

                    <TableCell className="font-medium">
                      {user.name || "—"}
                    </TableCell>

                    <TableCell className="max-w-[220px] truncate">
                      {user.email || "—"}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          status === "ACTIVE"
                            ? "default"
                            : status === "BLOCKED"
                              ? "destructive"
                              : "secondary"
                        }
                        className="capitalize"
                      >
                        {user.status || "unknown"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {roleLabel}
                        </Badge>
                        <Button
                          type="button"
                          variant="outline"
                          size="xs"
                          disabled={!userId || rowLoading}
                          onClick={() => {
                            if (!userId) return;
                            changeRole({ userId, role: nextRole });
                          }}
                        >
                          {rowLoading ? "Changing..." : "Change role"}
                        </Button>
                      </div>
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {ideasCount}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {votesCount}
                    </TableCell>

                    <TableCell>
                      <Badge variant={verified ? "default" : "secondary"}>
                        {verified ? "Yes" : "No"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {safeDate(user.createdAt)}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {safeDate(user.updatedAt)}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="destructive"
                        size="xs"
                        disabled={!userId || isDeleting}
                        onClick={() => {
                          if (!user.id) return;
                          deleteUser({ userId: user.id });
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default UserManagment;
