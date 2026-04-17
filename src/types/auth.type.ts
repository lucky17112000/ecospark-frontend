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
/*

{
    
    "data": {
        "token": null,
        "user": {
            "name": "Asaduzzaman Alamin",
            "email": "tempreal17112000@gmail.com",
            "emailVerified": false,
            "image": null,
            "createdAt": "2026-04-16T22:08:07.296Z",
            "updatedAt": "2026-04-16T22:08:07.296Z",
            "role": "USER",
            "status": "ACTIVE",
            "needPasswordChange": false,
            "isDeleted": false,
            "deletedAt": null,
            "id": "RzmCKSQ4uorb85MtPx10pIQvWFRrpZ1b"
        },
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJSem1DS1NRNHVvcmI4NU10UHgxMHBJUXZXRlJycFoxYiIsInJvbGUiOiJVU0VSIiwibmFtZSI6IkFzYWR1enphbWFuIEFsYW1pbiIsImVtYWlsIjoidGVtcHJlYWwxNzExMjAwMEBnbWFpbC5jb20iLCJlbWFpbFZlcmlmaWVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIiwiaXNEZWxldGVkIjpmYWxzZSwiaWF0IjoxNzc2Mzc3Mjg4LCJleHAiOjE3NzY0NjM2ODh9.D9FFLKa9FdzbyVLM4-ekJZmW0b9BojcNPstJ07WCDMY",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJSem1DS1NRNHVvcmI4NU10UHgxMHBJUXZXRlJycFoxYiIsInJvbGUiOiJVU0VSIiwibmFtZSI6IkFzYWR1enphbWFuIEFsYW1pbiIsImVtYWlsIjoidGVtcHJlYWwxNzExMjAwMEBnbWFpbC5jb20iLCJlbWFpbFZlcmlmaWVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIiwiaXNEZWxldGVkIjpmYWxzZSwiaWF0IjoxNzc2Mzc3Mjg4LCJleHAiOjE3NzY5ODIwODh9.4kpR_Ze3z_KIArGOIvSSraBojtdpBkijqGH5dEGnL9w"
    }
}
*/
export interface IRegisterResponse {
  token: string;
  accessToken: string;
  refreshToken: string;
  user: {
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
export type VOTE_TYPE = "UP" | "DOWN";
