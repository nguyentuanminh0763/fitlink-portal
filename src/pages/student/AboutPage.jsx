import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaAward,
  FaHeartbeat,
  FaHandsHelping,
  FaShieldAlt,
  FaArrowRight,
} from "react-icons/fa";
import MainLayout from "~/layouts/MainLayout";
import AboutHero from "~/components/about/AboutHero";

export default function AboutPage() {
  const navigate = useNavigate();

  const coreValues = [
    {
      icon: <FaShieldAlt className="text-2xl" />,
      title: "Minh Bạch Tuyệt Đối",
      desc: "100% bằng cấp của HLV được đối soát kỹ lưỡng. Bảng giá công khai, không phí ẩn hay phát sinh.",
    },
    {
      icon: <FaHeartbeat className="text-2xl" />,
      title: "Chuẩn Y Học Thể Thao",
      desc: "Ưu tiên an toàn khớp và phục hồi cơ chế vận động chuẩn xác trước khi nâng cao cường độ tập.",
    },
    {
      icon: <FaHandsHelping className="text-2xl" />,
      title: "Đồng Hành Sát Cánh",
      desc: "PT không chỉ đếm nhịp mà còn theo dõi chế độ dinh dưỡng, thói quen sinh hoạt và giấc ngủ mỗi ngày.",
    },
    {
      icon: <FaAward className="text-2xl" />,
      title: "Cam Kết Kết Quả",
      desc: "Đo lường bằng chỉ số InBody thực tế mỗi 2 tuần. Hỗ trợ đổi HLV miễn phí nếu chưa đạt kỳ vọng.",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Tìm kiếm HLV phù hợp",
      desc: "Lọc theo vị trí gần bạn, chuyên môn (giảm mỡ, tăng cơ, trị liệu) và ngân sách phù hợp.",
    },
    {
      step: "02",
      title: "Kiểm tra thể trạng & Nhận giáo án",
      desc: "Đo chỉ số InBody miễn phí buổi đầu, xác định độ lệch cơ thể và thiết lập thực đơn cá nhân hóa.",
    },
    {
      step: "03",
      title: "Tập luyện & Chuyển đổi vóc dáng",
      desc: "Luyện tập theo lịch đã book, ghi nhận nhật ký tập luyện và theo dõi sự thay đổi rõ rệt sau 8 tuần.",
    },
  ];

  const team = [
    {
      name: "Nguyễn Tuấn Hùng",
      role: "Head of Coaching • CSCS Certified",
      exp: "7+ năm kinh nghiệm huấn luyện",
      img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400",
      desc: "Cựu VĐV thể hình quốc gia, chuyên gia phục hồi cơ bắp và phát triển sức mạnh nền tảng.",
    },
    {
      name: "Trần Mai Anh",
      role: "Master Coach • Pilates & Rehab",
      exp: "5+ năm kinh nghiệm",
      img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
      desc: "Chuyên gia nắn chỉnh tư thế, giải tỏa đau mỏi cột sống thắt lưng cho hơn 300+ học viên văn phòng.",
    },
    {
      name: "Lê Hoàng Long",
      role: "Senior Coach • Kickboxing & HIIT",
      exp: "5+ năm kinh nghiệm",
      img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400",
      desc: "Chuyên gia đốt mỡ cường độ cao, rèn luyện phản xạ và sức bền tim mạch cho người bận rộn.",
    },
  ];

  return (
    <MainLayout>
      {/* 1. HERO SLIDER */}
      <AboutHero />

      {/* 2. OUR STORY SECTION */}
      <section id="our-story" className="py-24 bg-white dark:bg-slate-950 scroll-mt-20 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-block px-3.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950/70 text-orange-700 dark:text-orange-300 text-xs font-bold uppercase tracking-wider">
                Câu chuyện khởi nguồn
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                FitLink ra đời để giải quyết bài toán lớn nhất của việc tập luyện: Sự Bỏ Cuộc.
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base sm:text-lg">
                Hơn 80% người mua thẻ gym bỏ cuộc sau 3 tháng đầu vì tập sai form gây đau mỏi, không thấy kết quả và cảm thấy cô độc trong phòng tập.
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                FitLink được sáng lập với niềm tin rằng: <strong>Mỗi người đều xứng đáng có một người đồng hành chuyên nghiệp</strong>. Chúng tôi kết hợp nền tảng công nghệ số hóa dữ liệu tập luyện với cái tâm của những huấn luyện viên được tuyển chọn khắt khe nhất.
              </p>

              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-3xl font-black text-orange-600 dark:text-orange-400">1,200+</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">Học viên tin chọn</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-orange-600 dark:text-orange-400">50+</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">HLV Xác minh</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-orange-600 dark:text-orange-400">92%</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">Đạt mục tiêu 8 tuần</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-orange-200 to-amber-100 dark:from-orange-950/40 dark:to-amber-950/20 rounded-3xl blur-lg opacity-70" />
                <img
                  src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop"
                  alt="FitLink Training Studio"
                  className="relative rounded-3xl shadow-2xl w-full h-[460px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 bg-slate-50/70 dark:bg-slate-900/60 scroll-mt-20 border-y border-slate-200/60 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950/70 text-orange-700 dark:text-orange-300 text-xs font-bold uppercase tracking-wider mb-3">
              Quy trình trải nghiệm
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              3 Bước Đơn Giản Để Bắt Đầu
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Không cần cam kết dài hạn trước. Trải nghiệm sự chuyên nghiệp ngay từ buổi tập đầu tiên.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-orange-100/80 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:border-slate-700 transition-all duration-300 relative flex flex-col justify-between"
              >
                <div>
                  <span className="text-5xl font-black text-orange-200 dark:text-slate-700 block mb-4">
                    {s.step}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-bold text-orange-600 dark:text-orange-400">
                  <FaCheckCircle />
                  <span>Dễ dàng thực hiện</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. OUR VALUES SECTION */}
      <section id="our-values" className="py-24 bg-white dark:bg-slate-950 scroll-mt-20 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950/70 text-orange-700 dark:text-orange-300 text-xs font-bold uppercase tracking-wider mb-3">
              Triết lý hoạt động
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              4 Giá Trị Cốt Lõi Của FitLink
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Kim chỉ nam định hình mọi trải nghiệm của học viên và tiêu chuẩn đạo đức nghề nghiệp của HLV.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((v, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl bg-orange-50/30 dark:bg-slate-900 border border-orange-100/80 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800/80 hover:shadow-xl dark:hover:border-slate-700 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center mb-6 shadow-md shadow-orange-500/20 group-hover:scale-110 transition-transform">
                  {v.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {v.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. OUR TEAM SECTION */}
      <section id="our-team" className="py-24 bg-slate-50/70 dark:bg-slate-900/60 scroll-mt-20 border-t border-slate-200/60 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950/70 text-orange-700 dark:text-orange-300 text-xs font-bold uppercase tracking-wider mb-3">
              Đội ngũ dẫn dắt
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Huấn Luyện Viên Trưởng & Cố Vấn
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Những chuyên gia định hình chất lượng giáo án và đào tạo đội ngũ HLV trên toàn hệ thống FitLink.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((m, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:border-slate-700 transition-all duration-300 group"
              >
                <div className="h-72 w-full overflow-hidden relative">
                  <img
                    src={m.img}
                    alt={m.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 text-xs font-bold text-white bg-orange-600/90 px-3 py-1 rounded-full">
                    {m.exp}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{m.name}</h3>
                  <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 mt-1">{m.role}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
            Bắt đầu thay đổi bản thân cùng FitLink ngay hôm nay
          </h2>
          <p className="text-orange-100 text-base sm:text-lg mb-8 max-w-xl mx-auto">
            Hàng trăm huấn luyện viên chất lượng cao đang sẵn sàng đồng hành cùng mục tiêu thể hình của bạn.
          </p>
          <button
            onClick={() => navigate("/list-pt")}
            className="px-9 py-4 rounded-full bg-white dark:bg-slate-950 text-orange-600 dark:text-orange-400 font-bold text-base shadow-xl hover:bg-orange-50 dark:hover:bg-slate-900 transition-all flex items-center gap-2 mx-auto hover:-translate-y-0.5"
          >
            <span>Khám Phá Huấn Luyện Viên Ngay</span>
            <FaArrowRight className="text-sm" />
          </button>
        </div>
      </section>
    </MainLayout>
  );
}
