import axiosClient from "./axiosClient";

export const messageApi = {
  getMessages: (chatId) => axiosClient.get(`/messages/${chatId}`),
  sendMessage: (data) => axiosClient.post("/messages", data),
};
