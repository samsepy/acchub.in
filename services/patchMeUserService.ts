import type { UserService } from "@prisma/client";

import * as request from "@/services/request";

type Service = {
  userId: string;
  serviceId: string;
  screenName: string;
};

type Data = Service[];

export function patchMeUserService(data: Data) {
  return request.post<UserService>("/api/me/userService", data);
}
