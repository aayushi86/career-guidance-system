import { request } from "./api";

export const studentApi = {
  getProfile: () => request("/students/profile"),
  getDashboard: () => request("/students/profile"),
  updateProfile: (data) =>
    request("/students/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};