// src/components/home/TestimonialSection.jsx
import { motion } from "framer-motion";
import { FaStar, FaQuoteLeft, FaTrophy } from "react-icons/fa";
import SectionWrapper from "~/components/SectionWrapper";

const reviewVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.45 },
  }),
};

export default function TestimonialSection() {
  const reviews = [
    {
      name: "Nguyễn Lan Anh",
      role: "Marketing Manager • 26 tuổi",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
      rating: 5,
      achievement: "Giảm 6.5kg sau 8 tuần",
      coach: "HLV Mai Anh (Pilates & Cardio)",
      content:
        "Mình từng bỏ cuộc nhiều lần vì tự tập gym hay bị đau lưng. Nhờ PT Mai Anh chỉnh từng góc độ chuyển động, kết hợp thực đơn thâm hụt calo dễ nấu, mình đã siết eo từ 74cm xuống 65cm!",
    },
    {
      name: "Trần Văn Nam",
      role: "Software Engineer • 28 tuổi",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
      rating: 5,
      achievement: "Tăng 4kg cơ & hết gù lưng",
      coach: "HLV Tuấn Hùng (Tăng cơ & Sức mạnh)",
      content:
        "Dân IT ngồi 10 tiếng/ngày khiến vai cổ gáy của mình đau buốt. HLV Hùng lên giáo án tập trung vào nhóm cơ lưng xô và mông đùi. Sau 2 tháng người dày dặn hơn hẳn, form dáng thẳng tắp!",
    },
    {
      name: "Đặng Minh Tuấn",
      role: "Chủ doanh nghiệp • 35 tuổi",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
      rating: 5,
      achievement: "Giảm 8% mỡ nội tạng",
      coach: "HLV Hoàng Long (Kickboxing & HIIT)",
      content:
        "Lịch công tác dày đặc nhưng FitLink cho phép mình book lịch cực kỳ linh hoạt. Các buổi tập Kickboxing vừa đốt năng lượng điên cuồng vừa xả stress hiệu quả nhất sau giờ làm việc căng thẳng.",
    },
  ];

  return (
    <SectionWrapper className="py-24 bg-gradient-to-b from-white via-orange-50/30 to-white dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950/70 text-orange-700 dark:text-orange-300 text-xs font-bold uppercase tracking-wider mb-3">
            Học viên thực tế
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Câu chuyện thay đổi cùng FitLink
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Hơn 92% học viên đạt được mục tiêu thể hình sau 8 tuần nhờ sự kèm cặp sát sao của huấn luyện viên.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={reviewVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -6 }}
              className="p-8 rounded-3xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl dark:hover:border-slate-700 transition-all duration-300 border border-orange-100/80 dark:border-slate-800 flex flex-col justify-between"
            >
              <div>
                {/* Header: Rating & Quote */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400 gap-1 text-sm">
                    {Array.from({ length: r.rating }).map((_, idx) => (
                      <FaStar key={idx} />
                    ))}
                  </div>
                  <FaQuoteLeft className="text-orange-200 dark:text-slate-700 text-2xl" />
                </div>

                {/* Achievement Badge */}
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200/60 dark:border-emerald-800">
                    <FaTrophy className="text-amber-500 text-xs" />
                    <span>{r.achievement}</span>
                  </span>
                </div>

                {/* Testimonial text */}
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                  “{r.content}”
                </p>
              </div>

              {/* Author footer */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3.5">
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-orange-400/40"
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{r.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{r.role}</p>
                  <p className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 mt-0.5">{r.coach}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
