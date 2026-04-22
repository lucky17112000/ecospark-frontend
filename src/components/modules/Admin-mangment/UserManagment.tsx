"use client";
import {
  deleteUserByAdminAction,
  getAllUserByAdmiAction,
  updateUserRoleByAdminAction,
} from "@/services/admin.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import AppTooltip from "@/components/shared/Tooltip";
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

//pagination
type pageItem = number | "ellipsis";
const getPaginationItems = (currentPage: number, totalPages: number) => {
  const safeTotal = Math.max(1, totalPages);
  const safeCurrent = Math.min(Math.max(1, currentPage), safeTotal);
  if (safeTotal <= 7) {
    return Array.from({ length: safeTotal }, (_, idx) => idx + 1) as pageItem[];
  }

  const items: pageItem[] = [1];

  const left = Math.max(2, safeCurrent - 1);
  const right = Math.min(safeTotal - 1, safeCurrent + 1);

  if (left > 2) items.push("ellipsis");
  for (let p = left; p <= right; p += 1) items.push(p);
  if (right < safeTotal - 1) items.push("ellipsis");

  items.push(safeTotal);
  return items;
};
//pagination

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
  const [page, setPage] = useState(1);
  const [limit] = useState(2);
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", page, limit],
    queryFn: () => getAllUserByAdmiAction({ page, limit }),
  });

  const users = useMemo(() => {
    return Array.isArray(data?.data) ? (data?.data as UserRow[]) : [];
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

  //!SECTION pagination
  const meta = data?.meta;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);
  const currentPage = Math.min(Math.max(1, meta?.page ?? page), totalPages);
  const totalItems = meta?.total ?? undefined;
  useEffect(() => {
    if (page !== currentPage) setPage(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, totalPages]);
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;
  const paginationItems = useMemo(() => {
    return getPaginationItems(currentPage, totalPages);
  }, [currentPage, totalPages]);
  const showingRange = useMemo(() => {
    if (typeof totalItems !== "number") return null;
    if (totalItems <= 0) return null;

    const start = (currentPage - 1) * limit + 1;
    const end = Math.min(currentPage * limit, totalItems);
    return { start, end, total: totalItems };
  }, [currentPage, limit, totalItems]);
  //!SECTION pagination

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
                        <AppTooltip
                          side="top"
                          content={`Change role to ${nextRole}`}
                          trigger={
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
                          }
                        />
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
                      <AppTooltip
                        side="top"
                        content="Delete this user"
                        trigger={
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
                        }
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {totalPages > 1 && !isLoading && !isError && users.length > 0 ? (
          <div className="pt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    aria-disabled={!canGoPrev}
                    className={
                      !canGoPrev ? "pointer-events-none opacity-50" : ""
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      if (!canGoPrev) return;
                      setPage((p) => Math.max(1, p - 1));
                    }}
                  />
                </PaginationItem>

                {paginationItems.map((item, idx) => {
                  if (item === "ellipsis") {
                    return (
                      <PaginationItem key={`ellipsis-${idx}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  const pageNumber = item;

                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        isActive={pageNumber === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          if (pageNumber === currentPage) return;
                          setPage(pageNumber);
                        }}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    aria-disabled={!canGoNext}
                    className={
                      !canGoNext ? "pointer-events-none opacity-50" : ""
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      if (!canGoNext) return;
                      setPage((p) => Math.min(totalPages, p + 1));
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            {showingRange ? (
              <div className="mt-2 text-center text-xs text-muted-foreground">
                Showing {showingRange.start}–{showingRange.end} of{" "}
                {showingRange.total}
              </div>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default UserManagment;
