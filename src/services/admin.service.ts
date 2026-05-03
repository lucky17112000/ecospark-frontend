"use server";
import { httpClient } from "@/lib/axios/httpClient";
import type { ApiResponse } from "@/types/api.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export type getUserParams = {
  page?: number;
  limit?: number;
  status?: string;
};

export type AdminUserCount = {
  ideas?: number;
  votes?: number;
};

export type AdminUser = {
  id?: string;
  name?: string;
  email?: string;
  status?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  emailVerified?: boolean;
  _count?: AdminUserCount;
};

export const getAllUserByAdmiAction = async (
  params?: getUserParams,
): Promise<ApiResponse<AdminUser[]>> => {
  try {
    const response = await httpClient.get<AdminUser[]>(
      `${API_BASE_URL}/admin/users`,
      { params },
    );
    return response;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
export type UpdateUserRolePayload = {
  userId: string;
  role: "ADMIN" | "USER" | string;
};
export const updateUserRoleByAdminAction = async (
  payload: UpdateUserRolePayload,
): Promise<unknown> => {
  if (!API_BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  if (!payload?.userId) throw new Error("Missing userId");
  if (!payload?.role) throw new Error("Missing role");
  try {
    const url = `${API_BASE_URL}/admin/users/role/${payload.userId}`;
    const response = await httpClient.patch<unknown>(url, {
      role: payload.role,
    });
    return response;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

export type DeleteUserByAdminPayload = {
  userId: string;
};
export const deleteUserByAdminAction = async (
  payload: DeleteUserByAdminPayload,
): Promise<unknown> => {
  if (!API_BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  if (!payload?.userId) throw new Error("Missing userId");
  try {
    const url = `${API_BASE_URL}/admin/users/delete/${payload.userId}`;
    const response = await httpClient.delete<unknown>(url);
    return response;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
/*

{
    "success": true,
    "message": "Admin dashboard stats retrieved successfully",
    "data": {
        "totalUsers": 3,
        "totalAdmins": 2,
        "totalEnergyIdeas": 12,
        "totalPlasticIdeas": 1,
        "totalTreeIdeas": 4,
        "totalOthersIdeas": 2
    }
}
*/

export type AdminDashboardStats = {
  totalUsers?: number;
  totalAdmins?: number;
  totalEnergyIdeas?: number;
  totalPlasticIdeas?: number;
  totalTreeIdeas?: number;
  totalOthersIdeas?: number;
};
export const getAdminDashboardStatsAction = async (): Promise<
  ApiResponse<AdminDashboardStats>
> => {
  if (!API_BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  try {
    const response = await httpClient.get<AdminDashboardStats>(
      `${API_BASE_URL}/admin/dashboard/stats`,
    );
    return response;
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);
    throw error;
  }
};
