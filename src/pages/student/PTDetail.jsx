// src/pages/student/PTDetail.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaCheckCircle,
  FaRegClock,
  FaMedal,
  FaStar,
  FaPhoneAlt,
  FaEnvelope,
  FaDumbbell,
  FaCalendarAlt,
  FaCar,
  FaInfoCircle,
  FaComments,
  FaExternalLinkAlt,
  FaAward,
  FaShieldAlt,
  FaChevronRight,
  FaPlayCircle,
  FaCheck,
  FaShareAlt,
  FaUser,
  FaBullseye,
  FaClock,
} from "react-icons/fa";
import { usePTDetailQuery, usePTPackagesQuery } from "~/hooks/usePTQueries";
import PackageDetailModal from "~/components/student/PackageDetailModel";
import Map from "~/components/Map";
import MainLayout from "~/layouts/MainLayout";
import { PackageTagLabels } from "~/domain/enum";
import { toast } from "react-toastify";
import { toSlug } from "~/utils/slug";

// =============== Helpers ===============
const formatVND = (n) =>
  typeof n === "number"
    ? n.toLocaleString("vi-VN")
    : typeof n === "string" && !Number.isNaN(Number(n))
    ? Number(n).toLocaleString("vi-VN")
    : "-";

const deliveryModeLabels = {
  atPtGym: "Tại phòng tập của HLV",
  atClient: "Tại nhà / Chung cư học viên",
  atOtherGym: "Tại phòng tập liên kết đối tác",
};

const daysOfWeekNames = [
  "Chủ Nhật",
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
];

export default function PTDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'packages' | 'location' | 'schedule'

  // TanStack Query: Cache thông tin HLV 5 phút trong RAM
  const {
    data: ptDetail,
    isLoading: ptLoading,
    error: ptError,
  } = usePTDetailQuery(id);

  const user = ptDetail?.user || {};
  const gym = ptDetail?.primaryGym || {};
  const ptUserId = user?._id || id;

  // TanStack Query: Cache danh sách gói tập công khai theo PT User ID
  const {
    data: packages = [],
    isLoading: pkgLoading,
  } = usePTPackagesQuery(user?._id);

  const loading = ptLoading;
  const error = ptError
    ? "Không thể tải thông tin HLV. Vui lòng kiểm tra lại đường truyền."
    : !ptLoading && !ptDetail
    ? "Không tìm thấy thông tin huấn luyện viên."
    : "";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Chuẩn hóa URL sang SEO slug nếu truy cập bằng ObjectId thô
  useEffect(() => {
    if (ptDetail) {
      const ptSlug = ptDetail.slug || toSlug(ptDetail.user?.name);
      if (ptSlug && id !== ptSlug) {
        navigate(`/pt/${ptSlug}`, { replace: true });
      }
    }
  }, [ptDetail, id, navigate]);

  // Rating & stats
  const ratingAvg = ptDetail?.ratingAvg || 5.0;
  const ratingCount = ptDetail?.ratingCount || 0;

  // Lowest price calculation
  const lowestPricePerSession = useMemo(() => {
    if (!packages.length) return null;
    let minPrice = Infinity;
    for (const pkg of packages) {
      if (pkg.price && pkg.totalSessions) {
        const perSession = Math.round(Number(pkg.price) / Number(pkg.totalSessions));
        if (perSession < minPrice) minPrice = perSession;
      } else if (pkg.price && Number(pkg.price) < minPrice) {
        minPrice = Number(pkg.price);
      }
    }
    return minPrice !== Infinity ? minPrice : null;
  }, [packages]);

  // Map coordinates
  const mapCenter = useMemo(() => {
    const c = gym?.location?.coordinates;
    if (Array.isArray(c) && c.length === 2) {
      return { lng: c[0], lat: c[1], fullAddress: gym?.address || "Vị trí phòng tập" };
    }
    return null;
  }, [gym]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Đã sao chép liên kết hồ sơ HLV vào bộ nhớ tạm!");
    } else {
      toast.info("Đường dẫn: " + window.location.href);
    }
  };

  const handleBookNow = (packageId = null) => {
    if (!packages.length) {
      toast.warn("Huấn luyện viên hiện chưa mở gói tập công khai.");
      return;
    }
    if (packageId) {
      navigate(`/booking/${ptUserId}?packageId=${packageId}`);
    } else {
      if (activeTab !== "packages") {
        setActiveTab("packages");
        const el = document.getElementById("packages-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate(`/booking/${ptUserId}`);
      }
    }
  };

  const handleChat = () => {
    navigate(`/chat/${ptUserId}`);
  };

  return (
    <MainLayout>
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-24 text-slate-800 dark:text-slate-100 transition-colors duration-200">
        {/* TOP BREADCRUMB & BACK BAR */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 sticky top-[73px] z-30 shadow-xs transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 overflow-hidden text-ellipsis whitespace-nowrap">
              <Link to="/" className="hover:text-orange-600 dark:hover:text-orange-400 transition">
                Trang chủ
              </Link>
              <FaChevronRight className="text-[10px] text-slate-400" />
              <Link to="/list-pt" className="hover:text-orange-600 dark:hover:text-orange-400 transition">
                Huấn luyện viên
              </Link>
              <FaChevronRight className="text-[10px] text-slate-400" />
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[150px] sm:max-w-xs">
                {user?.name || "Chi tiết HLV"}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleShare}
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-200 text-xs font-semibold flex items-center gap-1.5 transition"
                title="Chia sẻ hồ sơ"
              >
                <FaShareAlt className="text-xs" />
                <span className="hidden sm:inline">Chia sẻ</span>
              </button>
              <button
                type="button"
                onClick={() => navigate("/list-pt")}
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <FaArrowLeft className="text-xs" />
                <span className="hidden sm:inline">Về danh sách HLV</span>
              </button>
            </div>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="animate-pulse space-y-6">
              <div className="h-64 sm:h-80 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="max-w-3xl mx-auto px-4 py-20 text-center">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center text-2xl mb-4">
              <FaInfoCircle />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Không tìm thấy hồ sơ
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{error}</p>
            <button
              type="button"
              onClick={() => navigate("/list-pt")}
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition"
            >
              Xem danh sách Huấn luyện viên khác
            </button>
          </div>
        )}

        {/* MAIN PROFILE CONTENT */}
        {!loading && ptDetail && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
            {/* HERO SECTION WITH COVER PHOTO & FLOATING PROFILE CARD */}
            <div className="relative">
              {/* Cover Banner */}
              <div className="relative h-56 sm:h-72 md:h-80 rounded-3xl overflow-hidden shadow-md border border-slate-200/60 dark:border-slate-800 bg-slate-900">
                <img
                  src={
                    ptDetail?.coverImage ||
                    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600&auto=format&fit=crop"
                  }
                  alt={`Bìa của ${user?.name || "HLV"}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

                {/* Status Badge on Top-Right */}
                <div className="absolute top-4 right-4 z-10">
                  {ptDetail?.availableForNewClients !== false ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-md">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      Đang nhận học viên
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold shadow-md">
                      <FaRegClock /> Lịch tập kín
                    </span>
                  )}
                </div>
              </div>

              {/* Profile Card Overlapping Cover */}
              <div className="relative -mt-14 sm:-mt-16 px-4 sm:px-8">
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-5 sm:p-7 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    {/* Left: Avatar + Info */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <img
                          src={
                            user?.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              user?.name || "PT"
                            )}&background=f97316&color=ffffff&size=200`
                          }
                          alt={user?.name || "Avatar"}
                          className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-900 shadow-xl bg-slate-100 dark:bg-slate-800"
                          loading="lazy"
                          decoding="async"
                        />
                        {ptDetail?.verified && (
                          <div
                            className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow-md ring-2 ring-white dark:ring-slate-900"
                            title="HLV đã được FitLink xác thực danh tính và chứng chỉ"
                          >
                            <FaCheck />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            {user?.name || "Huấn luyện viên"}
                          </h1>
                          {ptDetail?.verified && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                              <FaCheckCircle className="text-emerald-600 dark:text-emerald-400" /> Đã Xác Minh
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm font-semibold text-orange-600 dark:text-orange-400 flex items-center justify-center sm:justify-start gap-1.5">
                          <FaMedal /> Huấn Luyện Viên Cá Nhân Chuyên Nghiệp (Certified PT)
                        </p>

                        {/* Rating & Location Meta */}
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                          <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                            <FaStar />
                            <span>{ratingAvg.toFixed(1)}</span>
                            <span className="text-slate-400 font-normal">
                              ({ratingCount} đánh giá)
                            </span>
                          </div>

                          {(gym?.address || ptDetail?.areaNote) && (
                            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                              <FaMapMarkerAlt className="text-orange-500 shrink-0" />
                              <span className="truncate max-w-xs">
                                {gym?.address || ptDetail?.areaNote}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Quick Action CTAs */}
                    <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
                      <button
                        type="button"
                        onClick={handleChat}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-orange-500 text-slate-700 dark:text-slate-200 font-bold text-xs shadow-xs transition flex items-center justify-center gap-2"
                      >
                        <FaComments className="text-orange-500" />
                        <span>Nhắn tin tư vấn</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleBookNow()}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 hover:shadow-lg transition flex items-center justify-center gap-2"
                      >
                        <FaDumbbell />
                        <span>Đặt lịch tập ngay</span>
                      </button>
                    </div>
                  </div>

                  {/* Social & Direct Contact Links */}
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex flex-wrap items-center gap-4">
                      {user?.phone && (
                        <a
                          href={`tel:${user.phone}`}
                          className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition"
                        >
                          <FaPhoneAlt className="text-xs text-orange-500" />
                          <span>{user.phone}</span>
                        </a>
                      )}
                      {user?.email && (
                        <a
                          href={`mailto:${user.email}`}
                          className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition"
                        >
                          <FaEnvelope className="text-xs text-orange-500" />
                          <span>{user.email}</span>
                        </a>
                      )}
                    </div>

                    {/* Social Media */}
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs text-slate-400">Mạng xã hội:</span>
                      {ptDetail?.socials?.facebook && (
                        <a
                          href={ptDetail.socials.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 flex items-center justify-center transition"
                          title="Facebook"
                        >
                          <FaFacebook className="text-xs" />
                        </a>
                      )}
                      {ptDetail?.socials?.instagram && (
                        <a
                          href={ptDetail.socials.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-pink-600 flex items-center justify-center transition"
                          title="Instagram"
                        >
                          <FaInstagram className="text-xs" />
                        </a>
                      )}
                      {ptDetail?.socials?.tiktok && (
                        <a
                          href={ptDetail.socials.tiktok}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-white flex items-center justify-center transition"
                          title="TikTok"
                        >
                          <FaTiktok className="text-xs" />
                        </a>
                      )}
                      {!ptDetail?.socials?.facebook &&
                        !ptDetail?.socials?.instagram &&
                        !ptDetail?.socials?.tiktok && (
                          <span className="text-xs text-slate-400 italic">
                            Chưa liên kết
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BENTO STATS GRID */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center text-lg shrink-0">
                  <FaMedal />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Kinh nghiệm
                  </span>
                  <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {ptDetail?.yearsExperience ?? 1} Năm
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg shrink-0">
                  <FaStar />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Đánh giá
                  </span>
                  <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {ratingAvg.toFixed(1)} / 5.0
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg shrink-0">
                  <FaDumbbell />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Gói tập
                  </span>
                  <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {packages.length} Chương trình
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg shrink-0">
                  <FaCar />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Bán kính dạy
                  </span>
                  <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {ptDetail?.travelPolicy?.enabled
                      ? `${ptDetail.travelPolicy.maxTravelKm || 15} km`
                      : "Tại phòng tập"}
                  </span>
                </div>
              </div>
            </div>

            {/* TAB CONTROLS (CLEAN SVG ICONS, ZERO AI EMOJIS) */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto gap-2 sm:gap-4 no-scrollbar">
              {[
                { key: "overview", label: "Tổng quan & Giới thiệu", icon: <FaUser className="text-xs" /> },
                {
                  key: "packages",
                  label: `Gói tập luyện (${packages.length})`,
                  icon: <FaDumbbell className="text-xs" />,
                },
                { key: "location", label: "Phòng tập & Bản đồ", icon: <FaMapMarkerAlt className="text-xs" /> },
                { key: "schedule", label: "Lịch biểu & Quy định", icon: <FaClock className="text-xs" /> },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-3 px-3 font-bold text-xs sm:text-sm whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
                    activeTab === tab.key
                      ? "border-orange-500 text-orange-600 dark:text-orange-400"
                      : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* TAB CONTENT & SIDEBAR GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
              {/* LEFT COLUMN: ACTIVE TAB CONTENT */}
              <div className="space-y-6">
                {/* 1. OVERVIEW TAB */}
                {activeTab === "overview" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Bio Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
                      <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
                        <FaUser className="text-orange-500 text-sm" />
                        <h2>Giới thiệu bản thân</h2>
                      </div>
                      <div className="relative pl-4 border-l-3 border-orange-500 italic text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                        {ptDetail?.bio ||
                          "Huấn luyện viên chưa cập nhật phần giới thiệu bản thân."}
                      </div>

                      {/* Delivery Modes */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                          Hình thức huấn luyện hỗ trợ
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {["atPtGym", "atClient", "atOtherGym"].map((key) => {
                            const isSupported = !!ptDetail?.deliveryModes?.[key];
                            return (
                              <span
                                key={key}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                                  isSupported
                                    ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                                    : "bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 opacity-60"
                                }`}
                              >
                                {isSupported ? (
                                  <FaCheckCircle className="text-emerald-500" />
                                ) : (
                                  <FaRegClock />
                                )}
                                {deliveryModeLabels[key]}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Specialties Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 border border-slate-100 dark:border-slate-800 shadow-xs space-y-3">
                      <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
                        <FaBullseye className="text-orange-500 text-sm" />
                        <h2>Mục tiêu & Thế mạnh chuyên môn</h2>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(ptDetail?.specialties ?? []).length ? (
                          ptDetail.specialties.map((spec, i) => (
                            <span
                              key={i}
                              className="px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 text-xs font-semibold border border-orange-100 dark:border-orange-800/60 flex items-center gap-1.5"
                            >
                              <FaDumbbell className="text-orange-500 text-[10px]" />
                              {spec}
                            </span>
                          ))
                        ) : (
                          <p className="text-xs text-slate-500 italic">
                            Chưa liệt kê chuyên môn cụ thể.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Certificates Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 border border-slate-100 dark:border-slate-800 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
                          <FaAward className="text-orange-500 text-sm" />
                          <h2>Bằng cấp & Chứng chỉ chuyên môn</h2>
                        </div>
                        <span className="text-xs text-slate-400">
                          {(ptDetail?.certificates ?? []).length} chứng chỉ
                        </span>
                      </div>

                      {(ptDetail?.certificates ?? []).length ? (
                        <div className="space-y-2.5">
                          {ptDetail.certificates.map((cert, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-orange-200 transition"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center text-sm">
                                  <FaAward />
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                                    {cert?.name || "Chứng chỉ thể hình"}
                                  </p>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    {[cert?.issuer, cert?.year].filter(Boolean).join(" • ")}
                                  </p>
                                </div>
                              </div>

                              {cert?.url && (
                                <a
                                  href={cert.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
                                >
                                  <span>Xem hồ sơ</span>
                                  <FaExternalLinkAlt className="text-[9px]" />
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-dashed border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500 dark:text-slate-400">
                          Chứng chỉ quốc tế (NASM, ACE, VFM...) đang được xác thực định kỳ bởi FitLink.
                        </div>
                      )}
                    </div>

                    {/* Intro Video */}
                    {ptDetail?.videoIntroUrl && (
                      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 border border-slate-100 dark:border-slate-800 shadow-xs space-y-3">
                        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
                          <FaPlayCircle className="text-orange-500 text-sm" />
                          <h2>Video giới thiệu thực tế</h2>
                        </div>
                        <div className="aspect-video w-full rounded-xl overflow-hidden shadow border border-slate-200 dark:border-slate-800 bg-black">
                          <iframe
                            className="w-full h-full"
                            src={ptDetail.videoIntroUrl}
                            title={`Video giới thiệu của ${user?.name}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 2. PACKAGES TAB */}
                {activeTab === "packages" && (
                  <motion.div
                    id="packages-section"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                          Các gói tập luyện hiện có
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Lựa chọn chương trình tập phù hợp nhất với mục tiêu của bạn
                        </p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 font-bold text-xs">
                        {packages.length} gói
                      </span>
                    </div>

                    {packages.length ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {packages.map((pkg) => {
                          const perSession =
                            pkg.price && pkg.totalSessions
                              ? Math.round(Number(pkg.price) / Number(pkg.totalSessions))
                              : null;

                          return (
                            <div
                              key={pkg._id}
                              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-orange-300 dark:hover:border-orange-500/50 transition-all flex flex-col justify-between"
                            >
                              <div className="space-y-2.5">
                                <div>
                                  <div className="flex flex-wrap gap-1 mb-1.5">
                                    {(pkg.tags || []).map((t) => (
                                      <span
                                        key={t}
                                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold"
                                      >
                                        {PackageTagLabels[t] || t}
                                      </span>
                                    ))}
                                  </div>
                                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                                    {pkg.name}
                                  </h3>
                                </div>

                                {/* Price Box */}
                                <div className="p-3 rounded-xl bg-orange-50/70 dark:bg-slate-800/70 border border-orange-100 dark:border-slate-700">
                                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                                    Học phí trọn gói
                                  </div>
                                  <div className="text-xl font-black text-orange-600 dark:text-orange-400">
                                    {formatVND(pkg.price)}{" "}
                                    <span className="text-xs font-semibold text-orange-500">
                                      VND
                                    </span>
                                  </div>
                                  {perSession && (
                                    <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                                      ~ {formatVND(perSession)} VND / buổi
                                    </div>
                                  )}
                                </div>

                                {/* Meta Specs */}
                                <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-600 dark:text-slate-400 py-1">
                                  <div className="flex items-center gap-1.5">
                                    <FaCalendarAlt className="text-orange-500 text-[10px]" />
                                    <span>
                                      Thời hạn: <strong>{pkg.durationDays || "-"} ngày</strong>
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <FaDumbbell className="text-orange-500 text-[10px]" />
                                    <span>
                                      Số buổi: <strong>{pkg.totalSessions || "-"} buổi</strong>
                                    </span>
                                  </div>
                                </div>

                                {/* Description */}
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                  {pkg.description ||
                                    "Chương trình tập luyện khoa học được thiết kế chuyên biệt theo thể trạng học viên."}
                                </p>
                              </div>

                              {/* Buttons */}
                              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 mt-3">
                                <button
                                  type="button"
                                  onClick={() => setSelectedPackage(pkg)}
                                  className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition text-center"
                                >
                                  Chi tiết gói
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleBookNow(pkg._id)}
                                  className="flex-1 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs transition text-center"
                                >
                                  Đặt gói này
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-100 dark:border-slate-800">
                        <FaDumbbell className="text-orange-500 text-2xl mx-auto mb-2" />
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                          Huấn luyện viên chưa mở gói tập công khai
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
                          Bạn có thể nhắn tin trực tiếp với HLV để được tư vấn lộ trình riêng phù hợp với thời gian biểu của mình.
                        </p>
                        <button
                          type="button"
                          onClick={handleChat}
                          className="px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold shadow-xs transition"
                        >
                          Nhắn tin trao đổi ngay
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 3. LOCATION TAB */}
                {activeTab === "location" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
                      <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
                        <FaMapMarkerAlt className="text-orange-500 text-sm" />
                        <h2>Thông tin phòng tập chính</h2>
                      </div>

                      <div className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        <p>
                          <strong className="text-slate-900 dark:text-white">Tên phòng tập:</strong>{" "}
                          {gym?.name || "Phòng tập của Huấn luyện viên"}
                        </p>
                        <p className="flex items-start gap-1.5">
                          <FaMapMarkerAlt className="text-orange-500 mt-0.5 shrink-0" />
                          <span>
                            <strong className="text-slate-900 dark:text-white">Địa chỉ:</strong>{" "}
                            {gym?.address || ptDetail?.areaNote || "Chưa cập nhật địa chỉ cụ thể."}
                          </span>
                        </p>
                      </div>

                      {/* Map */}
                      {mapCenter && (
                        <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner">
                          <Map center={mapCenter} />
                        </div>
                      )}

                      {/* Gym Photos */}
                      {Array.isArray(gym?.photos) && gym.photos.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Hình ảnh phòng tập & dụng cụ
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                            {gym.photos.map((photo, i) => (
                              <div
                                key={i}
                                className="h-28 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 group"
                              >
                                <img
                                  src={photo}
                                  alt={`Gym photo ${i + 1}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  loading="lazy"
                                  decoding="async"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* 4. SCHEDULE & RULES TAB */}
                {activeTab === "schedule" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* Working Hours */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 border border-slate-100 dark:border-slate-800 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
                          <FaClock className="text-orange-500 text-sm" />
                          <h2>Lịch làm việc hàng tuần</h2>
                        </div>
                        {ptDetail?.defaultBreakMin ? (
                          <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full font-medium">
                            Nghỉ giữa ca: {ptDetail.defaultBreakMin} phút
                          </span>
                        ) : null}
                      </div>

                      <div className="overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800">
                        <table className="min-w-full text-xs">
                          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold">
                            <tr>
                              <th className="text-left px-3.5 py-2.5 w-24">Thứ</th>
                              <th className="text-left px-3.5 py-2.5">Khung giờ nhận dạy</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {(ptDetail?.workingHours ?? []).length ? (
                              ptDetail.workingHours.map((wh, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                  <td className="px-3.5 py-2.5 font-bold text-slate-800 dark:text-slate-200">
                                    {daysOfWeekNames[wh.dayOfWeek ?? 0]}
                                  </td>
                                  <td className="px-3.5 py-2.5">
                                    {(wh.intervals ?? []).length ? (
                                      <div className="flex flex-wrap gap-1.5">
                                        {wh.intervals.map((itv, i) => (
                                          <span
                                            key={i}
                                            className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800 text-[11px]"
                                          >
                                            {itv.start} – {itv.end}
                                          </span>
                                        ))}
                                      </div>
                                    ) : (
                                      <span className="text-slate-400 italic">Nghỉ</span>
                                    )}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={2} className="px-4 py-4 text-center text-slate-400 italic">
                                  Chưa cập nhật khung giờ làm việc cố định.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Travel Policy */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 border border-slate-100 dark:border-slate-800 shadow-xs space-y-3">
                      <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
                        <FaCar className="text-orange-500 text-sm" />
                        <h2>Chính sách di chuyển khi dạy tại nhà</h2>
                      </div>

                      {ptDetail?.travelPolicy ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                            <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">
                              Nhận dạy tại nhà
                            </span>
                            <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                              {ptDetail.travelPolicy.enabled ? "Có hỗ trợ" : "Không"}
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                            <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">
                              Bán kính Free
                            </span>
                            <span className="font-bold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">
                              {ptDetail.travelPolicy.freeRadiusKm ?? 5} km
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                            <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">
                              Khoảng cách tối đa
                            </span>
                            <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                              {ptDetail.travelPolicy.maxTravelKm ?? 15} km
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                            <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">
                              Phụ phí km vượt
                            </span>
                            <span className="font-bold text-xs sm:text-sm text-orange-600 dark:text-orange-400">
                              {formatVND(ptDetail.travelPolicy.feePerKm || 10000)} đ/km
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic">
                          Chưa thiết lập chính sách di chuyển.
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* RIGHT COLUMN: STICKY BOOKING SUMMARY SIDEBAR */}
              <div className="space-y-4 lg:sticky lg:top-28">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-4">
                  {/* Price headline */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Học phí huấn luyện
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-2xl font-black text-orange-600 dark:text-orange-400">
                        {lowestPricePerSession ? formatVND(lowestPricePerSession) : "Liên hệ"}
                      </span>
                      {lowestPricePerSession && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                          VND / buổi
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Trust guarantees */}
                  <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-start gap-2">
                      <FaShieldAlt className="text-emerald-500 text-xs mt-0.5 shrink-0" />
                      <span>
                        <strong>Bảo đảm an toàn:</strong> Thanh toán PayOS, học phí được bảo vệ cho tới khi kích hoạt buổi đầu.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <FaCheckCircle className="text-emerald-500 text-xs mt-0.5 shrink-0" />
                      <span>
                        <strong>Đổi HLV miễn phí:</strong> Hỗ trợ đổi HLV nếu không phù hợp sau buổi trải nghiệm đầu tiên.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <FaMedal className="text-emerald-500 text-xs mt-0.5 shrink-0" />
                      <span>
                        <strong>Giáo án cá nhân:</strong> Kèm theo tư vấn dinh dưỡng và đo chỉ số cơ thể định kỳ.
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleBookNow()}
                      className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 hover:shadow-lg transition flex items-center justify-center gap-2"
                    >
                      <FaDumbbell />
                      <span>Chọn gói & Đặt lịch ngay</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleChat}
                      className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center justify-center gap-2"
                    >
                      <FaComments className="text-orange-500" />
                      <span>Nhắn tin tư vấn với HLV</span>
                    </button>
                  </div>
                </div>

                {/* Quick Consultation Info */}
                <div className="bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <FaInfoCircle className="text-orange-500" />
                    <span>Chưa biết chọn gói nào?</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                    Hãy nhắn tin trực tiếp để HLV kiểm tra thể trạng và đề xuất số buổi tập tối ưu nhất cho bạn.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MOBILE STICKY BOTTOM ACTION BAR */}
        {!loading && ptDetail && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 py-2.5 shadow-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || "PT"
                  )}&background=f97316&color=ffffff`
                }
                alt={user?.name}
                className="w-9 h-9 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                loading="lazy"
                decoding="async"
              />
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {user?.name || "HLV"}
                </p>
                <p className="text-xs font-black text-orange-600 dark:text-orange-400">
                  {lowestPricePerSession ? `${formatVND(lowestPricePerSession)} đ/buổi` : "Liên hệ"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleChat}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                <FaComments />
              </button>
              <button
                type="button"
                onClick={() => handleBookNow()}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md"
              >
                Đặt lịch
              </button>
            </div>
          </div>
        )}

        {/* PACKAGE DETAIL MODAL */}
        {selectedPackage && (
          <PackageDetailModal
            pkg={selectedPackage}
            onClose={() => setSelectedPackage(null)}
          />
        )}
      </div>
    </MainLayout>
  );
}
