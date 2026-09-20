import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BMIWidget from "./student/BMIWidget";

const slides = [
  {
    title: "Chuyển Đổi Vóc Dáng,\nLàm Chủ Sức Khỏe.",
    desc:
      "Tập luyện hiệu quả cùng huấn luyện viên cá nhân 1-kèm-1, giáo án chuẩn y học thể thao và chế độ dinh dưỡng tối ưu theo mục tiêu của bạn.",
    primaryCta: "Tìm Huấn Luyện Viên",
    secondaryCta: "Tư Vấn Miễn Phí",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1400&auto=format&fit=crop",
    badge: "Đội ngũ PT 4.9★",
    tag: "Hơn 1,200+ học viên tin chọn",
  },
  {
    title: "Tập Luyện Khoa Học,\nTiến Bộ Từng Ngày.",
    desc:
      "Linh hoạt tập tại nhà, phòng gym đối tác hoặc online. Đo lường chỉ số inbody hàng tuần và nhận phản hồi chi tiết từ chuyên gia.",
    primaryCta: "Khám Phá Gói Tập",
    secondaryCta: "Liên Hệ Chuyên Gia",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1400&auto=format&fit=crop",
    badge: "Giáo án Độc quyền",
    tag: "Dinh dưỡng & Kỹ thuật chuẩn",
  },
];

export default function HeroCarousel() {
  const navigate = useNavigate();
  const [showBMI, setShowBMI] = useState(false);

  return (
    <>
      <Swiper
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        loop
        effect="fade"
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination, EffectFade]}
        className="w-full h-[620px] md:h-[680px]"
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i}>
            <section className="relative h-[620px] md:h-[680px] overflow-hidden">
              {/* background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-50 via-white to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-200" />
              {/* soft shapes */}
              <div className="pointer-events-none absolute -right-24 -top-24 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-orange-200/60 to-amber-100 dark:from-orange-950/30 dark:to-amber-950/20 blur-2xl" />
              <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-[58%] h-[120%] bg-gradient-to-l from-orange-100 via-orange-50 to-transparent dark:from-orange-950/20 dark:via-slate-900/40 dark:to-transparent rounded-l-[48px]" />

              {/* main content */}
              <div className="relative z-10 mx-auto h-full max-w-[1200px] px-6 md:px-10 lg:px-14 flex flex-col md:flex-row items-center gap-10 md:gap-8">
                {/* left text */}
                <div className="flex-1 max-w-2xl pt-10 md:pt-0">
                  {/* top tag */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 px-3 py-1 text-xs font-semibold">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500" />
                      {s.badge}
                    </div>
                    <span className="hidden sm:inline text-xs font-medium text-gray-500 dark:text-slate-400">
                      {s.tag}
                    </span>
                  </div>

                  <h1 className="whitespace-pre-line text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
                    {s.title}
                  </h1>

                  <p className="mt-5 text-base sm:text-lg text-gray-600 dark:text-slate-300 max-w-xl">
                    {s.desc}
                  </p>

                  {/* CTA buttons */}
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => navigate('/list-pt')}
                      className="px-7 py-3 rounded-full text-sm sm:text-base text-white font-semibold bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-md shadow-orange-500/25 hover:shadow-lg transition-all hover:-translate-y-0.5"
                    >
                      {s.primaryCta}
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/contact')}
                      className="px-7 py-3 rounded-full text-sm sm:text-base font-semibold text-gray-800 dark:text-slate-200 border border-gray-300 dark:border-slate-700 hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50/50 dark:hover:bg-slate-800 transition-all hover:-translate-y-0.5"
                    >
                      {s.secondaryCta}
                    </button>

                    {/* Quick BMI */}
                    <button
                      type="button"
                      onClick={() => setShowBMI(true)}
                      className="text-sm font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 underline underline-offset-4 transition"
                    >
                      Kiểm tra BMI nhanh →
                    </button>
                  </div>

                  {/* quick tips bar */}
                  <div className="mt-8 hidden md:flex items-center gap-6 text-sm font-medium text-gray-700 dark:text-slate-300">
                    {[
                      "Get Adequate Sleep",
                      "Include Rest Days",
                      "Focus on Form",
                      "Stay Consistent",
                    ].map((tip) => (
                      <div key={tip} className="flex items-center gap-2">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500" />
                        {tip}
                      </div>
                    ))}
                  </div>

                  {/* stats row */}
                  <div className="mt-6 grid grid-cols-3 max-w-xs text-xs sm:text-sm text-gray-600 dark:text-slate-400">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg">
                        50+
                      </div>
                      <div>Certified PTs</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg">
                        1.2k
                      </div>
                      <div>Active members</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg">
                        92%
                      </div>
                      <div>See progress in 8 weeks</div>
                    </div>
                  </div>
                </div>

                {/* right image / card */}
                <div className="flex-1 flex justify-center md:justify-end w-full">
                  <div className="relative w-full max-w-[480px]">
                    <div className="absolute -right-6 -bottom-6 w-40 h-40 rounded-3xl bg-gradient-to-br from-orange-200 to-amber-100 dark:from-orange-950/40 dark:to-amber-950/30" />
                    <img
                      src={s.image}
                      alt="Personal Trainer"
                      className="relative z-10 h-[320px] sm:h-[420px] lg:h-[480px] w-full object-cover rounded-3xl shadow-[0_30px_80px_rgba(15,23,42,0.45)]"
                    />

                    {/* small glass card */}
                    <div className="absolute left-4 bottom-4 bg-white/90 dark:bg-slate-900/90 dark:border dark:border-slate-800 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950/80 flex items-center justify-center text-orange-600 dark:text-orange-400 text-lg font-bold">
                        PT
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-slate-400">Today&apos;s focus</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          Strength & form
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* BMI Popup (nhỏ gọn, không full màn) */}
      {showBMI && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs">
          <div className="w-full sm:w-[420px] bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-transparent dark:border-slate-800">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
                Quick BMI Check
              </h3>
              <button
                onClick={() => setShowBMI(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 text-lg px-2"
              >
                ×
              </button>
            </div>
            <div className="p-4 max-h-[420px] overflow-y-auto">
              <BMIWidget />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
