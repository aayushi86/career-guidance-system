import { request } from "./api";

export const notificationApi = {
  getStudentNotifications: () => request("/notifications/student"),
};