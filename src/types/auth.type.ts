export interface ILoginResponse {
  //those are colleted from backend response after successful login
  token: string;
  accessToken: string;
  refreshToken: string;

  user: {
    // id: string;
    // createdAt: Date;
    // updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
    role: string;
    status: string;
    needPasswordChange: boolean;
    isDeleted: boolean;
    deletedAt?: Date | null | undefined;
  };
}
