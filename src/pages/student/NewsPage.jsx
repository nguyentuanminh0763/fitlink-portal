import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaRegClock,
  FaUserEdit,
  FaTag,
  FaSearch,
  FaArrowRight,
  FaPaperPlane,
} from "react-icons/fa";
import MainLayout from "~/layouts/MainLayout";
import { toast } from "react-toastify";

const categories = [
  "Tất cả",
  "Giảm mỡ & Siết cân",
  "Tăng cơ & Sức mạnh",
  "Dinh dưỡng khoa học",
  "Yoga & Phục hồi",
];

const articles = [
  {
    id: 1,
    category: "Giảm mỡ & Siết cân",
    title: "5 Sai lầm tai hại khi nhịn ăn ngắt quãng (Intermittent Fasting) khiến bạn tích mỡ nhiều hơn",
    desc: "Nhiều người lầm tưởng nhịn ăn càng lâu thì mỡ giảm càng nhanh. Thực tế, việc thâm hụt calo quá mức và thiếu protein sẽ làm suy giảm trao đổi chất nghiêm trọng.",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop",
    author: "HLV Đỗ Mai Anh",
    readTime: "5 phút đọc",
    date: "18 Tháng 9, 2026",
    featured: true,
  },
  {
    id: 2,
    category: "Tăng cơ & Sức mạnh",
    title: "Nguyên lý Progressive Overload: Bí quyết cốt lõi để phá vỡ mức tạ dậm chân tại chỗ",
    desc: "Tăng mức tạ không phải là cách duy nhất để quá tải lũy tiến. Khám phá 4 biến số khác giúp kích thích phì đại sợi cơ mà không lo chấn thương khớp.",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop",
    author: "HLV Nguyễn Tuấn Hùng",
    readTime: "6 phút đọc",
    date: "15 Tháng 9, 2026",
  },
  {
    id: 3,
    category: "Dinh dưỡng khoa học",
    title: "1g Protein trên mỗi kg cân nặng liệu đã đủ cho người tập kháng lực?",
    desc: "Đánh giá các nghiên cứu lâm sàng mới nhất về hàm lượng đạm tối ưu để kích hoạt tổng hợp protein cơ bắp (MPS) tối đa trong từng bữa ăn.",
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=800&auto=format&fit=crop",
    author: "Chuyên gia Dinh dưỡng FitLink",
    readTime: "4 phút đọc",
    date: "12 Tháng 9, 2026",
  },
  {
    id: 4,
    category: "Yoga & Phục hồi",
    title: "Hội chứng chéo trên (Upper Crossed Syndrome) của dân IT: 4 bài tập giải cứu đốt sống cổ",
    desc: "Nếu bạn thường xuyên bị mỏi cổ, vai nhô ra phía trước và lưng gù, đây là chuỗi động tác kéo giãn và kích hoạt cơ trám bạn cần thực hiện hàng ngày.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop",
    author: "HLV Đỗ Mai Anh",
    readTime: "7 phút đọc",
    date: "10 Tháng 9, 2026",
  },
  {
    id: 5,
    category: "Tăng cơ & Sức mạnh",
    title: "Cardio trước hay sau khi tập tạ? Lựa chọn thứ tự tối ưu hóa năng lượng glycogen",
    desc: "Phân tích tác động của hiệu ứng giao thoa (interference effect) giữa sức bền và sức mạnh để bạn sắp xếp buổi tập hiệu quả nhất.",
    image: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=800&auto=format&fit=crop",
    author: "HLV Lê Hoàng Long",
    readTime: "4 phút đọc",
    date: "05 Tháng 9, 2026",
  },
  {
    id: 6,
    category: "Giảm mỡ & Siết cân",
    title: "NEAT: Vũ khí bí mật đốt thêm 400-600 kcal mỗi ngày mà không cần chạm vào tạ",
    desc: "Tại sao những người vận động phi thể thao lại duy trì được tỷ lệ mỡ thấp quanh năm? Cách tăng chỉ số NEAT đơn giản ngay tại văn phòng.",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=800&auto=format&fit=crop",
    author: "HLV Nguyễn Tuấn Hùng",
    readTime: "5 phút đọc",
    date: "01 Tháng 9, 2026",
  },
];

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const filteredArticles = articles.filter((a) => {
    const matchCategory =
      selectedCategory === "Tất cả" || a.category === selectedCategory;
    const matchSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const featuredArticle = articles[0];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      toast.error("Vui lòng nhập địa chỉ email hợp lệ!");
      return;
    }
    toast.success("Cảm ơn bạn! FitLink sẽ gửi bí quyết tập luyện vào hòm thư của bạn.");
    setNewsletterEmail("");
  };

  return (
    <MainLayout>
      <div className="bg-slate-50/60 dark:bg-slate-950 pb-24 transition-colors duration-200">
        {/* HERO SECTION */}
        <section className="bg-gradient-to-b from-orange-50 via-white to-slate-50/60 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 pt-16 pb-14 border-b border-orange-100/60 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block px-3.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950/70 text-orange-700 dark:text-orange-300 text-xs font-bold uppercase tracking-wider mb-3">
                FitLink Knowledge Base
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Kiến Thức & Bí Quyết Thể Hình Khoa Học
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Được tổng hợp và chia sẻ trực tiếp từ các huấn luyện viên giàu kinh nghiệm, giúp bạn tập luyện an toàn, tối ưu dinh dưỡng và giữ vững động lực.
              </p>

              {/* Search Bar */}
              <div className="mt-8 max-w-xl mx-auto relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết, thực đơn, kỹ thuật..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm transition"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED POST (nếu không đang search) */}
        {!searchQuery && selectedCategory === "Tất cả" && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-16">
            <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-orange-100/80 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 group transition-colors">
              <div className="lg:col-span-7 relative h-72 lg:h-[440px] overflow-hidden">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-bold shadow-md">
                  ★ Tiêu Điểm Trong Tuần
                </span>
              </div>

              <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-orange-600 dark:text-orange-400 font-semibold mb-3">
                    <span className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-950/60 px-3 py-1 rounded-full">
                      <FaTag className="text-[10px]" />
                      {featuredArticle.category}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500">•</span>
                    <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-normal">
                      <FaRegClock className="text-[11px]" />
                      {featuredArticle.readTime}
                    </span>
                  </div>

                  <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white leading-snug group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {featuredArticle.title}
                  </h2>

                  <p className="mt-4 text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-4">
                    {featuredArticle.desc}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 font-bold flex items-center justify-center text-sm">
                      <FaUserEdit />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{featuredArticle.author}</p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">{featuredArticle.date}</p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 dark:text-orange-400 group-hover:translate-x-1 transition-transform">
                    <span>Đọc tiếp</span>
                    <FaArrowRight className="text-xs" />
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CATEGORY TABS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/25"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* ARTICLES GRID */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <FaSearch className="text-3xl mx-auto mb-3 text-slate-400" />
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">Không tìm thấy bài viết phù hợp</p>
              <p className="text-sm text-slate-400 mt-1">Thử đổi từ khóa hoặc chọn danh mục khác nhé.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredArticles.map((a, idx) => (
                  <motion.article
                    key={a.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.08, duration: 0.35 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:border-slate-700 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5"
                  >
                    <div>
                      {/* Image */}
                      <div className="relative h-52 w-full overflow-hidden">
                        <img
                          src={a.image}
                          alt={a.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm text-slate-800 dark:text-slate-200 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                          {a.category}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mb-2.5">
                          <FaRegClock className="text-[10px]" />
                          <span>{a.readTime}</span>
                          <span>•</span>
                          <span>{a.date}</span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          {a.title}
                        </h3>

                        <p className="mt-2.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                          {a.desc}
                        </p>
                      </div>
                    </div>

                    {/* Author footer */}
                    <div className="px-6 pb-6 pt-3 border-t border-slate-50 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-600 dark:text-slate-400">{a.author}</span>
                      <span className="text-orange-600 dark:text-orange-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Chi tiết</span>
                        <span>→</span>
                      </span>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* NEWSLETTER BOX */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="max-w-md">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-3">
                Bản tin hàng tuần
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                Nhận giáo án & thực đơn mẫu miễn phí
              </h3>
              <p className="mt-2 text-sm text-orange-100">
                FitLink gửi trực tiếp các mẹo giảm mỡ, công thức meal prep và lịch tập khoa học vào thứ Hai hàng tuần.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full sm:w-auto flex-1 max-w-md">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="email"
                  placeholder="Nhập email của bạn..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="px-5 py-3.5 rounded-full text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none flex-1 shadow-inner border border-transparent dark:border-slate-700"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-full bg-slate-950 hover:bg-slate-900 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <FaPaperPlane className="text-xs" />
                  <span>Đăng ký</span>
                </button>
              </div>
              <p className="text-[11px] text-orange-200 mt-2 text-center sm:text-left">
                Không spam. Hủy đăng ký bất kỳ lúc nào chỉ với 1 click.
              </p>
            </form>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
