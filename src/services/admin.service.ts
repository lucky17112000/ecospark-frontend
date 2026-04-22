"use server";
import { httpClient } from "@/lib/axios/httpClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export type getUserParams = {
  page?: number;
  limit?: number;
  status?: string;
};

export const getAllUserByAdmiAction = async (
  params?: getUserParams,
): Promise<unknown> => {
  try {
    const response = await httpClient.get<unknown>(
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
