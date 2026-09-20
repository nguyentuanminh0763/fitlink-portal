// src/components/home/FeaturesSection.jsx
import { motion } from "framer-motion";
import {
  FaUserCheck,
  FaClipboardList,
  FaChartLine,
  FaMapMarkedAlt,
} from "react-icons/fa";

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

export default function FeaturesSection() {
  const features = [
    {
      icon: <FaUserCheck className="text-2xl" />,
      title: "PT Xác Minh 100%",
      desc: "Tất cả huấn luyện viên đều có chứng chỉ quốc tế (NASM, ACE...) và trải qua phỏng vấn kỹ lưỡng.",
      accent: "from-orange-500 to-amber-500",
    },
    {
      icon: <FaClipboardList className="text-2xl" />,
      title: "Lộ Trình Độc Quyền",
      desc: "Giáo án tập luyện và chế độ dinh dưỡng thiết kế riêng theo tạng người, mục tiêu và thói quen sinh hoạt.",
      accent: "from-rose-500 to-orange-500",
    },
    {
      icon: <FaChartLine className="text-2xl" />,
      title: "Theo Dõi Chỉ Số Sát Sao",
      desc: "Báo cáo InBody, chỉ số mỡ/cơ và tiến trình được cập nhật định kỳ mỗi tuần để điều chỉnh kịp thời.",
      accent: "from-amber-500 to-yellow-500",
    },
    {
      icon: <FaMapMarkedAlt className="text-2xl" />,
      title: "Linh Hoạt Địa Điểm",
      desc: "Lựa chọn tập tại phòng gym của PT, phòng tập gần bạn, tại nhà riêng hoặc huấn luyện online tiện lợi.",
      accent: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white via-orange-50/20 to-white dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950/70 text-orange-700 dark:text-orange-300 text-xs font-bold uppercase tracking-wider mb-3">
            Trải nghiệm tập luyện kiểu mới
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Vì sao 1,200+ học viên lựa chọn FitLink?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Chúng tôi giải quyết tận gốc rào cản tập sai kỹ thuật, lười biếng và thiếu người dẫn dắt bằng công nghệ kết nối trực tiếp.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -6 }}
              className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-orange-100/80 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:border-slate-700 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.accent} text-white flex items-center justify-center mb-6 shadow-md shadow-orange-500/15 group-hover:scale-110 transition-transform`}
                >
                  {f.icon}
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-bold text-orange-600 dark:text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Tìm hiểu thêm →</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
