import { request } from "./api";

export const recruiterApi = {
  getDashboard: () =>
    request("/recruiter/dashboard"),

  postJob: (jobData) =>
    request("/recruiter/jobs", {
      method: "POST",
      body: JSON.stringify(jobData),
    }),

  updateStatus: (appId, payload) =>
    request(
      `/recruiter/applications/${appId}/status`,
      {
        method: "PUT",
        body: JSON.stringify(
          typeof payload === "string"
            ? { status: payload }
            : payload
        ),
      }
    ),
};