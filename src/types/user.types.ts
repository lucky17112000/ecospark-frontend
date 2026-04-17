import { UserRole } from "@/lib/authUtiles";

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
