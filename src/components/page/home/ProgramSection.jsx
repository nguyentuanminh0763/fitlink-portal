// src/components/home/ProgramSection.jsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaClock } from "react-icons/fa";
import SectionWrapper from "~/components/SectionWrapper";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.45 },
  }),
};

export default function ProgramSection() {
  const navigate = useNavigate();

  const programs = [
    {
      name: "Giảm Mỡ & Siết Cân Cấp Tốc",
      img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop",
      tag: "weight_loss",
      badge: "Phổ biến nhất",
      desc: "Lộ trình Cardio HIIT kết hợp thâm hụt calo khoa học, giảm 3-6kg an toàn không mất sức.",
      duration: "6 - 12 tuần",
    },
    {
      name: "Tăng Cơ & Sức Mạnh Nền Tảng",
      img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop",
      tag: "muscle_gain",
      badge: "Hiệu quả cao",
      desc: "Kỹ thuật Hypertrophy chuẩn y khoa, xây dựng cơ bắp săn chắc và cải thiện vóc dáng hình chữ V.",
      duration: "8 - 16 tuần",
    },
    {
      name: "Chỉnh Dáng, Pilates & Phục Hồi",
      img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop",
      tag: "rehab",
      badge: "Dân văn phòng",
      desc: "Giải phóng áp lực cột sống, khắc phục gù lưng, võng lưng và tăng cường độ dẻo dai toàn thân.",
      duration: "4 - 8 tuần",
    },
  ];

  return (
    <SectionWrapper className="py-24 bg-white dark:bg-slate-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
        >
          <div>
            <span className="inline-block px-3.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950/70 text-orange-700 dark:text-orange-300 text-xs font-bold uppercase tracking-wider mb-3">
              Mục tiêu luyện tập
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Chương trình huấn luyện nổi bật
            </h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-md text-sm sm:text-base">
            Chọn mục tiêu phù hợp và FitLink sẽ gợi ý huấn luyện viên có chuyên môn cao nhất đồng hành cùng bạn.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((p, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              onClick={() => navigate(`/list-pt`)}
              className="group rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl dark:hover:border-slate-700 transition-all duration-300 cursor-pointer bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col hover:-translate-y-2"
            >
              {/* Image container */}
              <div className="relative h-60 w-full overflow-hidden">
                <img
                  src={p.img}
                  alt={p.name}
                  className="h-full w-full object-cover transform group-hover:scale-105 transition duration-500"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  {p.badge}
                </span>
                <span className="absolute bottom-4 left-4 text-xs font-semibold text-white/90 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <FaClock className="text-[11px]" />
                  <span>{p.duration}</span>
                </span>
              </div>

              {/* Text content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm font-semibold text-orange-600 dark:text-orange-400">
                  <span>Tìm HLV cho gói này</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
