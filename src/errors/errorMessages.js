// Nơi DUY NHẤT quy định câu người dùng thấy khi một request API lỗi (toast của axios interceptor).
// Muốn đổi câu thông báo lỗi → sửa ở đây, không sửa rải rác trong từng trang.

export const ERROR_MESSAGES = {
  // Không có response: mất mạng, server không chạy, bị CORS chặn
  NETWORK: 'Không kết nối được máy chủ. Vui lòng kiểm tra mạng và thử lại.',
  // 502/503/504: nginx/Azure không gọi được backend (đang khởi động lại, bảo trì, quá tải)
  GATEWAY: 'Máy chủ đang bận hoặc bảo trì. Vui lòng thử lại sau ít phút.',
  // Còn lại mà backend không gửi message
  UNKNOWN: 'Lỗi hệ thống. Vui lòng thử lại.',
};

// Ưu tiên câu backend gửi (lỗi nghiệp vụ 4xx, hoặc câu chung kèm mã lỗi của 5xx);
// chỉ dùng câu mặc định khi không có — vd proxy trả trang HTML hoặc không có response.
export const getApiErrorMessage = (error) => {
  const serverMessage = error?.response?.data?.message;
  if (serverMessage) return serverMessage;
  if (!error?.response) return ERROR_MESSAGES.NETWORK;
  if ([502, 503, 504].includes(error.response.status)) return ERROR_MESSAGES.GATEWAY;
  return ERROR_MESSAGES.UNKNOWN;
};
