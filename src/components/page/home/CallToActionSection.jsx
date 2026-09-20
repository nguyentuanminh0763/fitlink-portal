// src/components/home/CallToActionSection.jsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaArrowRight } from "react-icons/fa";

export default function CallToActionSection() {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white text-center rounded-t-[40px] shadow-2xl relative overflow-hidden">
      {/* Background glow circle */}
      <div className="pointer-events-none absolute -left-20 -top-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-black/10 blur-3xl" />

      <motion.div
        className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          Khởi động hành trình ngay hôm nay
        </span>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-5 leading-tight">
          Sẵn sàng biến đổi vóc dáng của bạn?
        </h2>

        <p className="text-base sm:text-xl text-orange-50 mb-8 max-w-2xl mx-auto leading-relaxed">
          Đặt lịch làm quen cùng huấn luyện viên trong 1 phút. Trải nghiệm buổi tập đánh giá chỉ số InBody và tư vấn dinh dưỡng hoàn toàn miễn phí.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.25)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/list-pt')}
            className="px-9 py-4 text-base sm:text-lg font-bold bg-white text-orange-600 rounded-full shadow-xl hover:bg-orange-50 transition-all flex items-center gap-2"
          >
            <span>Tìm Huấn Luyện Viên Ngay</span>
            <FaArrowRight className="text-sm" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/contact')}
            className="px-8 py-4 text-base sm:text-lg font-semibold bg-orange-700/40 hover:bg-orange-700/60 text-white rounded-full border border-white/30 backdrop-blur-sm transition-all"
          >
            Nhận tư vấn 1-kèm-1
          </motion.button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-orange-100">
          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-white" />
            <span>Đổi HLV miễn phí nếu không hợp</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-white" />
            <span>Không phát sinh phí ẩn</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-white" />
            <span>Thanh toán an toàn 100%</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
