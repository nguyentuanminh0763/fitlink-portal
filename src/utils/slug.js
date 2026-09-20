/**
 * Chuyển đổi tên người hoặc chuỗi tiếng Việt thành slug thân thiện với SEO
 * Ví dụ: "Trần Mai Anh" -> "tran-mai-anh"
 *        "Bùi Đức Trọng" -> "bui-duc-trong"
 *        "Đặng Hoàng Nam" -> "dang-hoang-nam"
 */
export const toSlug = (val) => {
  if (!val) return '';
  return String(val)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // Bỏ dấu thanh, dấu mũ
    .replace(/[đĐ]/g, 'd') // Chuyển đ/Đ thành d
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Loại bỏ ký tự đặc biệt
    .replace(/\s+/g, '-') // Đổi khoảng trắng thành gạch nối
    .replace(/-+/g, '-'); // Gộp nhiều gạch nối liên tiếp
};
