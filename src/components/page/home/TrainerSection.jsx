import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SectionWrapper from "~/components/SectionWrapper";
import { searchPTs } from "~/services/searchService";
import { toSlug } from "~/utils/slug";

const trainerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.45 },
  }),
};

const defaultTrainers = [
  {
    name: "PT Nguyễn Tuấn Hùng",
    img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500",
    exp: "7 năm kinh nghiệm",
    tag: "Tăng cơ & Giảm cân",
    rating: 4.9,
  },
  {
    name: "PT Trần Mai Anh",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500",
    exp: "4 năm kinh nghiệm",
    tag: "Pilates & Yoga Phục hồi",
    rating: 5.0,
  },
  {
    name: "PT Lê Hoàng Long",
    img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500",
    exp: "5 năm kinh nghiệm",
    tag: "Kickboxing & HIIT",
    rating: 4.8,
  },
];

export default function TrainerSection() {
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState(defaultTrainers);

  useEffect(() => {
    let mounted = true;
    const fetchTopTrainers = async () => {
      try {
        const res = await searchPTs({ limit: 3, sortBy: "rating" });
        const items = res?.items || [];
        if (mounted && items.length > 0) {
          const mapped = items.map((pt, idx) => ({
            id: pt.userInfo?._id || pt._id,
            name: pt.userInfo?.name || defaultTrainers[idx]?.name || "HLV Chuyên Nghiệp",
            img: pt.userInfo?.avatar || pt.coverImage || defaultTrainers[idx]?.img,
            exp: pt.yearsExperience ? `${pt.yearsExperience} năm kinh nghiệm` : "Chuyên gia thể hình",
            tag: pt.specialties?.[0] || "Fitness Coaching",
            rating: pt.ratingAvg || 5.0,
          }));
          setTrainers(mapped);
        }
      } catch {
        // Fallback already set
      }
    };
    fetchTopTrainers();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SectionWrapper className="py-20 bg-orange-50/40 dark:bg-slate-900/40 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-slate-900 dark:text-white mb-3"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4 }}
        >
          Huấn luyện viên tiêu biểu
        </motion.h2>
        <motion.p
          className="text-center text-gray-600 dark:text-slate-400 mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Được kiểm duyệt bởi FitLink, chấm điểm bởi học viên thực tế.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8">
          {trainers.map((t, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={trainerVariants}
              onClick={() => {
                const ptSlug = t.slug || toSlug(t.name) || t.id;
                if (ptSlug) navigate(`/pt/${ptSlug}`);
                else navigate("/list-pt");
              }}
              className="group cursor-pointer rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-2xl dark:hover:border-slate-700 transition-all duration-300 p-4 border border-orange-100/70 dark:border-slate-800 hover:-translate-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="relative overflow-hidden rounded-xl">
                  <motion.img
                    src={t.img}
                    alt={t.name}
                    loading="lazy"
                    decoding="async"
                    className="h-60 w-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs px-3 py-1 rounded-full shadow-md font-medium flex items-center gap-1">
                    <span>★</span>
                    <span>{t.rating ? Number(t.rating).toFixed(1) : "5.0"}</span>
                  </div>
                  <span className="absolute top-3 right-3 bg-white/90 dark:bg-slate-950/90 text-slate-800 dark:text-slate-200 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow">
                    Top Rated
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="font-bold text-xl text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {t.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{t.exp}</p>
                  <p className="text-xs mt-2 inline-flex px-3 py-1 bg-orange-100 dark:bg-orange-950/70 text-orange-700 dark:text-orange-300 rounded-full font-medium">
                    {t.tag}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm text-orange-600 dark:text-orange-400 font-medium">
                <span>Xem hồ sơ & lịch dạy</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Explore all CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate("/list-pt")}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-600 hover:bg-orange-500 text-white rounded-full font-semibold shadow-lg hover:shadow-orange-200 dark:hover:shadow-orange-950/50 transition-all hover:-translate-y-0.5"
          >
            <span>Khám phá tất cả Huấn luyện viên</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </SectionWrapper>
  );
}
