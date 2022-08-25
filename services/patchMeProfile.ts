import { Profile } from "@prisma/client";

import * as request from "@/services/request";

type Data = {
  displayName: string;
  screenName: string;
  bio: string;
  siteUrl: string;
};

export function patchMeProfile(data: Data) {
  return request.patch<Profile>("/api/me/profile", data);
}
