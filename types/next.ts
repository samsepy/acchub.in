import { Profile as PrismaProfile } from "@prisma/client";
import { Session } from "next-auth";

export type DefaultPageProps = {
  session: null | Session;
};

export type SessionUser = {
  name: string;
  email: string;
  image: string;
  id: string;
  profile: null | PrismaProfile;
};
