"use client";

import {
  deleteUserByAdminAction,
  getAllUserByAdmiAction,
  updateUserRoleByAdminAction,
} from "@/services/admin.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { cn } from "@/lib/utils";
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  LightbulbIcon,
  ShieldCheckIcon,
  ThumbsUpIcon,
  Trash2Icon,
  UserCogIcon,
  UsersIcon,
  XCircleIcon,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type UserCount = { ideas?: number; votes?: number };

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

// ─── Pagination helpers ───────────────────────────────────────────────────────

type PageItem = number | "ellipsis";

const getPaginationItems = (
  currentPage: number,
  totalPages: number,
): PageItem[] => {
  const safeTotal = Math.max(1, totalPages);
  const safeCurrent = Math.min(Math.max(1, currentPage), safeTotal);
  if (safeTotal <= 7)
    return Array.from({ length: safeTotal }, (_, i) => i + 1);
  const items: PageItem[] = [1];
  const left = Math.max(2, safeCurrent - 1);
  const right = Math.min(safeTotal - 1, safeCurrent + 1);
  if (left > 2) items.push("ellipsis");
  for (let p = left; p <= right; p++) items.push(p);
  if (right < safeTotal - 1) items.push("ellipsis");
  items.push(safeTotal);
  return items;
};

// ─── Utility helpers ──────────────────────────────────────────────────────────

const toUserRole = (value: unknown): UserRole | null => {
  const r = typeof value === "string" ? value.trim().toUpperCase() : "";
  return r === "ADMIN" || r === "USER" ? r : null;
};

const getNextRole = (currentRole: unknown): UserRole =>
  toUserRole(currentRole) === "ADMIN" ? "USER" : "ADMIN";

const safeDate = (value: unknown): string => {
  if (!value) return "—";
  const d = new Date(
    typeof value === "string" || typeof value === "number"
      ? value
      : String(value),
  );
  return Number.isNaN(d.getTime())
    ? "—"
    : new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }).format(d);
};

const getInitials = (name?: string) =>
  (name ?? "?")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: (props: { className?: string }) => React.ReactNode;
  label: string;
  value: number;
  color: "emerald" | "amber" | "red";
}) => {
  const palette = {
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    amber:   "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    red:     "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
  };
  return (
    <div className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", palette[color])}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-bold tabular-nums leading-none">{value}</p>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status?: string }) => {
  const s = (status || "").toUpperCase();
  if (s === "ACTIVE")
    return (
      <Badge className="gap-1 border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
        <CheckCircle2Icon className="h-3 w-3" />
        Active
      </Badge>
    );
  if (s === "BLOCKED")
    return (
      <Badge variant="destructive" className="gap-1">
        <XCircleIcon className="h-3 w-3" />
        Blocked
      </Badge>
    );
  return <Badge variant="secondary" className="capitalize">{status || "unknown"}</Badge>;
};

const RoleBadge = ({ role }: { role?: string }) => {
  const r = (role || "").toUpperCase();
  if (r === "ADMIN")
    return (
      <Badge className="border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-400">
        Admin
      </Badge>
    );
  return (
    <Badge variant="outline" className="text-muted-foreground">
      User
    </Badge>
  );
};

const UserAvatar = ({ name, size = "md" }: { name?: string; size?: "sm" | "md" }) => {
  const sizeClass = size === "sm" ? "h-7 w-7 text-[10px]" : "h-9 w-9 text-xs";
  return (
    <div className={cn("flex shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400", sizeClass)}>
      {getInitials(name)}
    </div>
  );
};

const SkeletonRows = () => (
  <div className="divide-y">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 px-5 py-4">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3.5 w-36" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-xl" />
        <Skeleton className="h-8 w-16 rounded-xl" />
      </div>
    ))}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const UserManagment = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(4);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", page, limit],
    queryFn: () => getAllUserByAdmiAction({ page, limit }),
  });

  const users = useMemo(
    () => (Array.isArray(data?.data) ? (data.data as UserRow[]) : []),
    [data],
  );

  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: deleteUserByAdminAction,
    onSuccess: async () => {
      setConfirmDeleteId(null);
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const { mutate: changeRole, isPending: isChangingRole } = useMutation({
    mutationFn: updateUserRoleByAdminAction,
    onMutate: (vars) => setUpdatingUserId(vars.userId),
    onSettled: () => setUpdatingUserId(null),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  // ── Pagination ──────────────────────────────────────────────────────────────
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
  const paginationItems = useMemo(
    () => getPaginationItems(currentPage, totalPages),
    [currentPage, totalPages],
  );
  const showingRange = useMemo(() => {
    if (typeof totalItems !== "number" || totalItems <= 0) return null;
    const start = (currentPage - 1) * limit + 1;
    const end = Math.min(currentPage * limit, totalItems);
    return { start, end, total: totalItems };
  }, [currentPage, limit, totalItems]);

  // ── Derived stats ───────────────────────────────────────────────────────────
  const activeCount = users.filter(
    (u) => u.status?.toUpperCase() === "ACTIVE",
  ).length;
  const blockedCount = users.filter(
    (u) => u.status?.toUpperCase() === "BLOCKED",
  ).length;

  return (
    <div className="animate-eco-fade-up space-y-5">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
            <UsersIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold tracking-tight">
              User Management
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Manage members, roles, and access.
            </p>
          </div>
        </div>

        {typeof totalItems === "number" && (
          <Badge variant="secondary" className="h-7 rounded-full px-3 text-sm">
            {totalItems} total
          </Badge>
        )}
      </div>

      {/* ── Stats row ────────────────────────────────────────────────────── */}
      {!isLoading && !isError && users.length > 0 && (
        <div className="grid grid-cols-3 gap-3 animate-eco-fade-up animate-delay-100">
          <StatCard
            icon={UsersIcon}
            label="On this page"
            value={users.length}
            color="emerald"
          />
          <StatCard
            icon={ShieldCheckIcon}
            label="Active"
            value={activeCount}
            color="emerald"
          />
          <StatCard
            icon={AlertTriangleIcon}
            label="Blocked"
            value={blockedCount}
            color="red"
          />
        </div>
      )}

      {/* ── Main card ────────────────────────────────────────────────────── */}
      <div className="animate-eco-fade-up animate-delay-200 overflow-hidden rounded-2xl border bg-card shadow-sm">
        {/* Loading skeleton */}
        {isLoading && <SkeletonRows />}

        {/* Error state */}
        {isError && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
              <XCircleIcon className="h-7 w-7 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-semibold">Failed to load users</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Please refresh or try again later.
              </p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && users.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60">
              <UsersIcon className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No users found.</p>
          </div>
        )}

        {/* ── Desktop table ─── */}
        {!isLoading && !isError && users.length > 0 && (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="w-10 pl-5">#</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-center">
                      <span className="flex items-center justify-center gap-1">
                        <LightbulbIcon className="h-3.5 w-3.5" />
                        Ideas
                      </span>
                    </TableHead>
                    <TableHead className="text-center">
                      <span className="flex items-center justify-center gap-1">
                        <ThumbsUpIcon className="h-3.5 w-3.5" />
                        Votes
                      </span>
                    </TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="pr-5 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {users.map((user, index) => {
                    const key = user.id || `${user.email}-${index}`;
                    const userId = user.id?.trim() || "";
                    const nextRole = getNextRole(user.role);
                    const rowLoading =
                      isChangingRole && updatingUserId === userId;
                    const isConfirming = confirmDeleteId === userId;

                    return (
                      <TableRow
                        key={key}
                        className="group transition-colors duration-150 hover:bg-muted/30"
                      >
                        {/* # */}
                        <TableCell className="pl-5 text-xs text-muted-foreground">
                          {(currentPage - 1) * limit + index + 1}
                        </TableCell>

                        {/* Member: avatar + name + email */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <UserAvatar name={user.name} />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold leading-none">
                                {user.name || "—"}
                              </p>
                              <p className="mt-1 truncate text-xs text-muted-foreground">
                                {user.email || "—"}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <StatusBadge status={user.status} />
                        </TableCell>

                        {/* Role + change button */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <RoleBadge role={user.role} />
                            <AppTooltip
                              side="top"
                              content={`Switch to ${nextRole}`}
                              trigger={
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="xs"
                                  disabled={!userId || rowLoading}
                                  onClick={() => {
                                    if (!userId) return;
                                    changeRole({ userId, role: nextRole });
                                  }}
                                  className="gap-1 rounded-lg text-xs text-muted-foreground hover:text-foreground"
                                >
                                  <UserCogIcon className="h-3.5 w-3.5" />
                                  {rowLoading ? "…" : "Switch"}
                                </Button>
                              }
                            />
                          </div>
                        </TableCell>

                        {/* Ideas */}
                        <TableCell className="text-center text-sm tabular-nums text-muted-foreground">
                          {user._count?.ideas ?? 0}
                        </TableCell>

                        {/* Votes */}
                        <TableCell className="text-center text-sm tabular-nums text-muted-foreground">
                          {user._count?.votes ?? 0}
                        </TableCell>

                        {/* Email verified */}
                        <TableCell>
                          {user.emailVerified ? (
                            <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2Icon className="h-3.5 w-3.5" />
                              Yes
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <XCircleIcon className="h-3.5 w-3.5" />
                              No
                            </span>
                          )}
                        </TableCell>

                        {/* Joined */}
                        <TableCell className="text-xs text-muted-foreground">
                          {safeDate(user.createdAt)}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="pr-5 text-right">
                          {isConfirming ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <span className="text-xs text-muted-foreground">
                                Sure?
                              </span>
                              <Button
                                type="button"
                                size="xs"
                                variant="destructive"
                                disabled={isDeleting}
                                onClick={() => {
                                  if (!user.id) return;
                                  deleteUser({ userId: user.id });
                                }}
                                className="rounded-lg"
                              >
                                {isDeleting ? "…" : "Yes"}
                              </Button>
                              <Button
                                type="button"
                                size="xs"
                                variant="ghost"
                                onClick={() => setConfirmDeleteId(null)}
                                className="rounded-lg"
                              >
                                No
                              </Button>
                            </div>
                          ) : (
                            <AppTooltip
                              side="top"
                              content="Delete this user"
                              trigger={
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="xs"
                                  disabled={!userId || isDeleting}
                                  onClick={() => setConfirmDeleteId(userId)}
                                  className="rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <Trash2Icon className="h-3.5 w-3.5" />
                                </Button>
                              }
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* ── Mobile card list ─── */}
            <div className="divide-y lg:hidden">
              {users.map((user, index) => {
                const userId = user.id?.trim() || "";
                const nextRole = getNextRole(user.role);
                const rowLoading = isChangingRole && updatingUserId === userId;
                const isConfirming = confirmDeleteId === userId;
                const key = user.id || `mob-${index}`;

                return (
                  <div
                    key={key}
                    className="space-y-3 px-4 py-4 transition-colors duration-150 hover:bg-muted/20"
                  >
                    {/* Top row: avatar + name + email + status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={user.name} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {user.name || "—"}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {user.email || "—"}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={user.status} />
                    </div>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <RoleBadge role={user.role} />
                      <span className="flex items-center gap-1">
                        <LightbulbIcon className="h-3 w-3" />
                        {user._count?.ideas ?? 0} ideas
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUpIcon className="h-3 w-3" />
                        {user._count?.votes ?? 0} votes
                      </span>
                      <span className="flex items-center gap-1">
                        {user.emailVerified ? (
                          <CheckCircle2Icon className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <XCircleIcon className="h-3 w-3" />
                        )}
                        {user.emailVerified ? "Verified" : "Unverified"}
                      </span>
                      <span>Joined {safeDate(user.createdAt)}</span>
                    </div>

                    {/* Action row */}
                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        disabled={!userId || rowLoading}
                        onClick={() => {
                          if (!userId) return;
                          changeRole({ userId, role: nextRole });
                        }}
                        className="flex-1 gap-1 rounded-xl text-xs"
                      >
                        <UserCogIcon className="h-3.5 w-3.5" />
                        {rowLoading ? "Changing…" : `Switch to ${nextRole}`}
                      </Button>

                      {isConfirming ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-muted-foreground">
                            Sure?
                          </span>
                          <Button
                            type="button"
                            size="xs"
                            variant="destructive"
                            disabled={isDeleting}
                            onClick={() => {
                              if (!user.id) return;
                              deleteUser({ userId: user.id });
                            }}
                            className="rounded-xl"
                          >
                            {isDeleting ? "…" : "Yes"}
                          </Button>
                          <Button
                            type="button"
                            size="xs"
                            variant="ghost"
                            onClick={() => setConfirmDeleteId(null)}
                            className="rounded-xl"
                          >
                            No
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          disabled={!userId || isDeleting}
                          onClick={() => setConfirmDeleteId(userId)}
                          className="rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2Icon className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ── Pagination ───────────────────────────────────────────────────── */}
      {totalPages > 1 && !isLoading && !isError && users.length > 0 && (
        <div className="animate-eco-fade-up animate-delay-300 space-y-2">
          {showingRange && (
            <p className="text-center text-xs text-muted-foreground">
              Showing {showingRange.start}–{showingRange.end} of{" "}
              {showingRange.total} users
            </p>
          )}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  aria-disabled={!canGoPrev}
                  className={!canGoPrev ? "pointer-events-none opacity-40" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!canGoPrev) return;
                    setPage((p) => Math.max(1, p - 1));
                  }}
                />
              </PaginationItem>

              {paginationItems.map((item, idx) =>
                item === "ellipsis" ? (
                  <PaginationItem key={`e-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item}>
                    <PaginationLink
                      href="#"
                      isActive={item === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        if (item !== currentPage) setPage(item);
                      }}
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  aria-disabled={!canGoNext}
                  className={!canGoNext ? "pointer-events-none opacity-40" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!canGoNext) return;
                    setPage((p) => Math.min(totalPages, p + 1));
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default UserManagment;
