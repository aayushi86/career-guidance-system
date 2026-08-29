import { request } from "./api";

export const recruiterApi = {
  getDashboard: () => request("/recruiters/dashboard"),
  postJob: (jobData) =>
    request("/recruiters/jobs", {
      method: "POST",
      body: JSON.stringify(jobData),
    }),
  updateStatus: (appId, payload) =>
    request(`/recruiters/applications/${appId}/status`, {
      method: "PUT",
      body: JSON.stringify(typeof payload === "string" ? { status: payload } : payload),
    }),
};