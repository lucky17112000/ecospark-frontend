/*


{
    // "success": true,
    // "message": "Idea retrived successfully",
    "data": [
        model Purchase {
    id     String @id @default(uuid())
    // amount Float
    ideaId String
    idea   Idea   @relation(fields: [ideaId], references: [id], onDelete: Cascade)
    userId String
    user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

    paymentStatus PaymentStatus @default(UNPAID)
    payment       Payment?
    createdAt     DateTime      @default(now())
    updatedAt     DateTime      @updatedAt

    @@index([ideaId])
    @@index([userId])
    @@map("purchases")
}

*/

import { VOTE_TYPE } from "./auth.type";

export interface IIdeaResponse {
  id: string;
  title: string;
  problemStatement: string;
  solution: string;
  description: string;
  images: string[];
  authorId: string;
  author?: {
    id?: string;
    name: string;
  };
  authorName?: string;
  categoryId: string;
  status: "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  isPaid: boolean;
  price: number;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
  };
  votes: VOTE_TYPE[];
  feedback: string | null;
  purchases: {
    id: string;
    paymentStatus: "PAID" | "UNPAID";
    createdAt: Date;
    updatedAt: Date;
  }[];
}
