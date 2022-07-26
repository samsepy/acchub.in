import type { Profile as PrismaProfile, UserService } from "@prisma/client";
import type { Session } from "next-auth";

export type DefaultPageProps = {
  session: null | Session;
};

export type SessionUser = {
  name: string;
  email: string;
  image: string;
  id: string;
  services: UserService[];
  profile: null | PrismaProfile;
};
