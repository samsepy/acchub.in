import { Profile } from "@prisma/client";

import * as request from "@/services/request";

type Data = {
  displayName: string;
  screenName: string;
};

export function postMeProfile(data: Data) {
  return request.post<Profile>("/api/me/profile", data);
}
