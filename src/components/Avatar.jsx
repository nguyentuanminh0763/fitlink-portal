export const DEFAULT_AVATAR = '/default-avatar.svg';

// <img> dùng cho ảnh đại diện người dùng.
// - src rỗng hoặc tải lỗi (link hết hạn, bị chặn...) → ảnh mặc định thay vì icon ảnh vỡ.
// - referrerPolicy="no-referrer": avatar Google (lh3.googleusercontent.com) trả 429 khi request
//   mang Referer của site nhúng ảnh; không gửi Referer thì Google trả ảnh bình thường.
export default function Avatar({ src, alt = '', ...props }) {
  return (
    <img
      {...props}
      src={src || DEFAULT_AVATAR}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={(e) => {
        // Chặn vòng lặp nếu chính ảnh mặc định cũng lỗi
        if (!e.currentTarget.src.endsWith(DEFAULT_AVATAR)) e.currentTarget.src = DEFAULT_AVATAR;
      }}
    />
  );
}
