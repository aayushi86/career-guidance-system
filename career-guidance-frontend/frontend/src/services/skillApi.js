import { request } from "./api";

export const skillApi = {
  getRoles: () => request("/skills/roles"),
  analyzeGap: (payload) =>
    request("/skills/gap-analysis", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};