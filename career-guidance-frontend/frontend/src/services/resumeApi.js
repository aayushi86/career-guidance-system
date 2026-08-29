import { request } from "./api";

export const resumeApi = {
  analyze: (payload) =>
    request("/resume/analyze", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};