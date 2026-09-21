import axiosClient from "./axiosClient";

export const feedbackApi = {
  create: (data) => axiosClient.post("/feedbacks", data),
  getByPT: (ptId) => axiosClient.get(`/feedbacks/pt/${ptId}`),
};
