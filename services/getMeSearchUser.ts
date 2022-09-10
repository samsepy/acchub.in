import * as request from "@/services/request";

export function getMeUser(screenName: string) {
  return request.get(`/api/me/user?screenName=${screenName}`);
}
