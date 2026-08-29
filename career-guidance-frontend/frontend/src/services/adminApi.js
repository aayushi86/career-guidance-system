import { request } from "./api";

export const adminApi = {
  getStats: () => request("/admin/stats"),
};