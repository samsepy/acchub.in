import type { SessionUser } from "@/types/next";

declare module "next-auth" {
  interface Session {
    user: SessionUser;
    accessToken: string;
    expires: string;
  }
}
