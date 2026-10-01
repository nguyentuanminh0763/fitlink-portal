// services/studentPackageService.js (Cập nhật sử dụng axiosClient)

import axiosClient from '../api/axiosClient' // Import client đã được cấu hình

// KHÔNG CẦN định nghĩa API_BASE_URL nữa

/**
 * Lấy tất cả các gói tập đã mua của một học viên.
 * Endpoint: GET /api/student-packages/student/:studentId
 * @param {string} studentId - ID của học viên.
 * @returns {Promise<Array>} Danh sách các StudentPackage.
 */
export async function getStudentPackages(studentId) {
  // Lỗi để nguyên cho nơi gọi; interceptor đã hiển thị toast
  const response = await axiosClient.get(`/student-packages/student/${studentId}`)
  return response.data
}

/**
 * Lấy chi tiết một gói tập cụ thể.
 * Endpoint: GET /api/student-packages/:id
 * @param {string} packageId - ID của StudentPackage.
 * @returns {Promise<object>} Chi tiết StudentPackage.
 */
export async function getPackageDetails(packageId) {
  // Lỗi để nguyên cho nơi gọi; interceptor đã hiển thị toast
  const response = await axiosClient.get(`/student-packages/${packageId}`)
  return response.data
}
