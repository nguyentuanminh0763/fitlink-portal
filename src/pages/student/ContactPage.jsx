import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
  FaChevronDown,
  FaCheckCircle,
} from "react-icons/fa";
import MainLayout from "~/layouts/MainLayout";
import { toast } from "react-toastify";

const faqs = [
  {
    q: "Buổi tập làm quen và đo InBody ban đầu có mất phí không?",
    a: "Hoàn toàn miễn phí 100%! Huấn luyện viên sẽ kiểm tra thể trạng, đo lường tỷ lệ cơ/mỡ và tư vấn lộ trình phù hợp với mục tiêu của bạn trước khi bạn quyết định đăng ký.",
  },
  {
    q: "Nếu trong quá trình tập luyện tôi thấy không hợp phong cách của PT thì sao?",
    a: "FitLink cam kết đặt trải nghiệm học viên lên hàng đầu. Bạn có quyền yêu cầu đổi huấn luyện viên khác hoàn toàn miễn phí bất kỳ lúc nào hoặc bảo lưu số buổi tập còn lại.",
  },
  {
    q: "Tôi là người mới tinh chưa bao giờ tập gym, liệu có theo nổi không?",
    a: "Hơn 70% học viên tại FitLink bắt đầu từ số 0. Giáo án 1-kèm-1 được cá nhân hóa hoàn toàn theo thể lực thực tế của bạn, đi từ kỹ thuật hít thở, chuẩn hóa khớp cơ bản rồi mới nâng cao dần.",
  },
  {
    q: "FitLink hỗ trợ các phương thức thanh toán và bảo lưu gói tập thế nào?",
    a: "Bạn có thể thanh toán tiện lợi qua chuyển khoản ngân hàng hoặc ví điện tử. Trong trường hợp bận công tác, ốm đau, bạn có thể gửi yêu cầu bảo lưu lên đến 60 ngày trên hệ thống.",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    goal: "weight_loss",
    mode: "atPtGym",
    note: "",
  });

  const [openFaq, setOpenFaq] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error("Vui lòng điền họ tên và số điện thoại!");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Gửi yêu cầu tư vấn thành công! Chuyên viên FitLink sẽ liên hệ với bạn trong vòng 30 phút.");
      setFormData({
        name: "",
        phone: "",
        email: "",
        goal: "weight_loss",
        mode: "atPtGym",
        note: "",
      });
    }, 800);
  };

  return (
    <MainLayout>
      <div className="bg-slate-50/60 dark:bg-slate-950 pb-24 transition-colors duration-200">
        {/* HERO HEADER */}
        <section className="bg-gradient-to-b from-orange-50 via-white to-slate-50/60 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 pt-16 pb-14 border-b border-orange-100/60 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-3.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950/70 text-orange-700 dark:text-orange-300 text-xs font-bold uppercase tracking-wider mb-3">
              Hỗ trợ & Đặt lịch
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Liên Hệ & Nhận Tư Vấn Lộ Trình 1-Kèm-1
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Bạn có thắc mắc về huấn luyện viên, mức giá hay chế độ tập luyện? Đội ngũ chuyên môn của FitLink luôn sẵn sàng hỗ trợ bạn 24/7.
            </p>
          </div>
        </section>

        {/* QUICK CONTACT CARDS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <a
              href="tel:1900888999"
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-orange-100/80 dark:border-slate-800 shadow-md hover:shadow-xl dark:hover:border-slate-700 transition-all duration-300 flex items-center gap-4 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                <FaPhoneAlt />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Hotline 24/7</p>
                <p className="text-lg font-black text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">1900 888 999</p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">● Tư vấn tức thì</p>
              </div>
            </a>

            <a
              href="mailto:support@fitlink.vn"
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-orange-100/80 dark:border-slate-800 shadow-md hover:shadow-xl dark:hover:border-slate-700 transition-all duration-300 flex items-center gap-4 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                <FaEnvelope />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Email hỗ trợ</p>
                <p className="text-base font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors truncate">support@fitlink.vn</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Phản hồi dưới 2h</p>
              </div>
            </a>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-orange-100/80 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center text-xl shrink-0">
                <FaMapMarkerAlt />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Văn phòng chính</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Quận 1, TP. HCM</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Phủ sóng 30+ phòng tập</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-orange-100/80 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center text-xl shrink-0">
                <FaClock />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Giờ hoạt động</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">06:00 - 22:00</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Tất cả các ngày trong tuần</p>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN SECTION: FORM + FAQ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* CONSULTATION FORM */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 shadow-xl border border-orange-100/80 dark:border-slate-800 transition-colors">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Đăng Ký Nhận Tư Vấn & Đo InBody Miễn Phí
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Điền thông tin bên dưới, chuyên viên thể hình sẽ gọi lại hỗ trợ bạn ngay.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn A"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="VD: 0905 123 456"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Địa chỉ Email (để nhận giáo án)
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Mục tiêu thể hình
                  </label>
                  <select
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800 transition"
                  >
                    <option value="weight_loss">Giảm mỡ & Siết cân</option>
                    <option value="muscle_gain">Tăng cơ & Sức mạnh</option>
                    <option value="posture">Chỉnh dáng & Trị liệu lưng/cổ</option>
                    <option value="general_health">Duy trì sức khỏe & Dẻo dai</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Hình thức tập mong muốn
                  </label>
                  <select
                    value={formData.mode}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800 transition"
                  >
                    <option value="atPtGym">Tại phòng tập của PT</option>
                    <option value="atClient">PT đến tận nhà của tôi</option>
                    <option value="atOtherGym">Tại phòng gym gần nhà tôi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Ghi chú thêm (khung giờ rảnh, tình trạng chấn thương cũ...)
                </label>
                <textarea
                  rows="3"
                  placeholder="Chia sẻ thêm về lịch sinh hoạt hoặc yêu cầu đặc biệt của bạn..."
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800 transition"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 text-base hover:-translate-y-0.5"
              >
                {submitting ? (
                  <span>Đang gửi thông tin...</span>
                ) : (
                  <>
                    <FaPaperPlane className="text-sm" />
                    <span>Gửi Yêu Cầu Tư Vấn Ngay</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 pt-2">
                <span className="flex items-center gap-1">
                  <FaCheckCircle className="text-emerald-500" /> Miễn phí 100%
                </span>
                <span className="flex items-center gap-1">
                  <FaCheckCircle className="text-emerald-500" /> Bảo mật thông tin
                </span>
                <span className="flex items-center gap-1">
                  <FaCheckCircle className="text-emerald-500" /> Không ép mua gói
                </span>
              </div>
            </form>
          </div>

          {/* FAQ ACCORDION */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="inline-block px-3.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950/70 text-orange-700 dark:text-orange-300 text-xs font-bold uppercase tracking-wider mb-2">
                Giải đáp thắc mắc
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Câu Hỏi Thường Gặp
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Những điều học viên thường băn khoăn trước khi chọn PT.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                      className="w-full p-5 text-left font-bold text-slate-800 dark:text-slate-200 text-sm sm:text-base flex items-center justify-between gap-4 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <FaChevronDown
                        className={`text-xs text-slate-400 transition-transform duration-200 shrink-0 ${
                          isOpen ? "rotate-180 text-orange-500" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
