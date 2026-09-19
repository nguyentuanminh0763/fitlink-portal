// src/pages/SearchPTs.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaCrosshairs,
  FaFilter,
  FaStar,
  FaDumbbell,
  FaTimes,
  FaCheckCircle,
  FaRedo,
  FaSlidersH,
  FaArrowRight,
  FaThLarge,
  FaList,
  FaCalendarCheck,
  FaShieldAlt,
} from "react-icons/fa";
import { searchPTs } from "~/services/searchService";
import { useSearchPTsQuery } from "~/hooks/usePTQueries";
import { PackageTagLabels } from "~/domain/enum";
import MainLayout from "~/layouts/MainLayout";
import { toast } from "react-toastify";
import { toSlug } from "~/utils/slug";

const modeLabels = {
  atPtGym: "Tại phòng PT",
  atClient: "Tại nhà học viên",
  atOtherGym: "Phòng gym đối tác",
};

// Clean text pills without emoji spam
const quickGoalPills = [
  { key: "", label: "Tất cả mục tiêu" },
  { key: "weight_loss", label: "Giảm mỡ & Siết cân" },
  { key: "muscle_gain", label: "Tăng cơ & Sức mạnh" },
  { key: "rehab", label: "Yoga & Phục hồi" },
  { key: "posture", label: "Chỉnh dáng & Cột sống" },
  { key: "endurance", label: "Kickboxing & Cardio" },
];

const provinces = [
  "Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ", "Hải Phòng", "Bình Dương",
  "Đồng Nai", "Khánh Hòa", "Lâm Đồng", "Bà Rịa - Vũng Tàu", "An Giang",
  "Bắc Ninh", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Điện Biên", "Đồng Tháp",
  "Gia Lai", "Hà Tĩnh", "Hưng Yên", "Lai Châu", "Lạng Sơn", "Lào Cai",
  "Nghệ An", "Ninh Bình", "Phú Thọ", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị",
  "Sơn La", "Tây Ninh", "Thái Nguyên", "Thanh Hóa", "Huế", "Tuyên Quang", "Vĩnh Long",
];

export default function SearchPTs() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("best");
  const [page, setPage] = useState(1);
  const [limit] = useState(12); // Display 12 PTs per page for rich density
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'

  // Filters
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [selectedMode, setSelectedMode] = useState("");
  const [area, setArea] = useState("");
  const [coords, setCoords] = useState("");

  // Location Modal
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [detectedInfo, setDetectedInfo] = useState("");

  // Load saved location on mount
  useEffect(() => {
    const savedArea = localStorage.getItem("studentArea");
    const savedMode = localStorage.getItem("studentMode") || "";
    const savedCoords = localStorage.getItem("studentCoords") || "";

    if (savedArea) {
      setArea(savedArea);
      setCoords("");
    } else if (savedCoords) {
      setCoords(savedCoords);
    }
    if (savedMode) setSelectedMode(savedMode);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (area) {
      localStorage.setItem("studentArea", area);
      localStorage.removeItem("studentCoords");
    } else if (coords) {
      localStorage.setItem("studentCoords", coords);
      localStorage.removeItem("studentArea");
    }
    if (selectedMode) localStorage.setItem("studentMode", selectedMode);
  }, [area, coords, selectedMode]);

  // GPS Geolocation Detection
  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Trình duyệt của bạn không hỗ trợ định vị GPS.");
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const latLon = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
        setCoords(latLon);
        setArea("");
        try {
          const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1&accept-language=vi`;
          const res = await fetch(url);
          const data = await res.json();
          const addr = data?.address || {};
          const line = addr.city || addr.town || addr.state || data?.display_name || "";
          setDetectedInfo(line ? `Vị trí: ${line}` : `Tọa độ: ${latLon}`);
          toast.success("Đã xác định vị trí GPS thành công!");
        } catch {
          setDetectedInfo(`Tọa độ GPS: ${latLon}`);
        } finally {
          setDetecting(false);
          setIsLocationModalOpen(false);
          setPage(1);
        }
      },
      (err) => {
        console.error(err);
        toast.warn("Không thể lấy vị trí. Vui lòng cho phép quyền truy cập GPS trên trình duyệt.");
        setDetecting(false);
      },
      { timeout: 10000 }
    );
  };

  // Search parameters for TanStack Query
  const searchParams = useMemo(() => {
    const params = {
      sortBy,
      specialty: goal,
      page,
      limit,
      name: name.trim(),
    };
    if (selectedMode) params.modes = [selectedMode];
    if (area) params.area = area;
    else if (coords) params.coords = coords;
    return params;
  }, [sortBy, goal, page, limit, name, selectedMode, area, coords]);

  // TanStack Query: Caching 5 phút, 0ms khi quay lại bộ lọc cũ
  const {
    data: searchData,
    isLoading: loading,
    isFetching,
    error: queryError,
  } = useSearchPTsQuery(searchParams);

  const pts = searchData?.items || [];
  const total = searchData?.total || 0;
  const error = queryError
    ? "Không thể tải danh sách huấn luyện viên. Vui lòng thử lại sau."
    : "";

  // Reset all filters
  const handleResetFilters = () => {
    setName("");
    setGoal("");
    setSelectedMode("");
    setArea("");
    setCoords("");
    setSortBy("best");
    setPage(1);
    localStorage.removeItem("studentArea");
    localStorage.removeItem("studentCoords");
    localStorage.removeItem("studentMode");
    toast.info("Đã xóa tất cả bộ lọc");
  };

  const hasActiveFilters = useMemo(() => {
    return !!(name || goal || selectedMode || area || coords || sortBy !== "best");
  }, [name, goal, selectedMode, area, coords, sortBy]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-20 transition-colors duration-200">
        {/* COMPACT HERO HEADER & SEARCH BAR */}
        <section className="bg-gradient-to-b from-orange-50/60 via-white to-slate-50/50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 pt-10 pb-8 border-b border-orange-100/60 dark:border-slate-800 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
                Sàn Kết Nối Huấn Luyện Viên Cá Nhân
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Tìm Huấn Luyện Viên Phù Hợp
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                100% PT được xác thực danh tính & chứng chỉ y học thể thao, kèm 1-1 theo thể trạng của bạn.
              </p>
            </div>

            {/* SEARCH TOOLBAR */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-800 p-3 sm:p-4 space-y-3 transition-colors">
              {/* Row 1: Search Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5">
                {/* Search by Name */}
                <div className="lg:col-span-4 relative flex items-center">
                  <FaSearch className="absolute left-3.5 text-slate-400 text-xs pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Tìm theo tên HLV..."
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800 transition"
                  />
                  {name && (
                    <button
                      onClick={() => setName("")}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>

                {/* Location Picker */}
                <div className="lg:col-span-3">
                  <button
                    type="button"
                    onClick={() => setIsLocationModalOpen(true)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-orange-500 flex items-center justify-between transition group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FaMapMarkerAlt className="text-orange-500 text-xs shrink-0" />
                      <span className="truncate">
                        {area || (coords ? "GPS đã chọn" : "Tất cả khu vực")}
                      </span>
                    </div>
                    <span className="text-[10px] text-orange-600 dark:text-orange-400 font-bold group-hover:underline shrink-0">
                      Chọn
                    </span>
                  </button>
                </div>

                {/* Delivery Mode */}
                <div className="lg:col-span-3">
                  <select
                    value={selectedMode}
                    onChange={(e) => {
                      setSelectedMode(e.target.value);
                      setPage(1);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                  >
                    <option value="">Hình thức tập: Tất cả</option>
                    <option value="atPtGym">Tại phòng tập PT</option>
                    <option value="atClient">Tại nhà học viên</option>
                    <option value="atOtherGym">Tại phòng gym đối tác</option>
                  </select>
                </div>

                {/* Sort dropdown */}
                <div className="lg:col-span-2">
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setPage(1);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                  >
                    <option value="best">Đánh giá cao nhất</option>
                    <option value="price_asc">Giá: Thấp đến Cao</option>
                    <option value="price_desc">Giá: Cao đến Thấp</option>
                    <option value="exp_desc">Kinh nghiệm nhiều nhất</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Quick Goals Pills & Action Bar */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
                {/* Goal filter pills (Clean, No AI Emojis) */}
                <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1 hidden sm:inline">
                    Mục tiêu:
                  </span>
                  {quickGoalPills.map((pill) => {
                    const isSelected = goal === pill.key;
                    return (
                      <button
                        key={pill.key}
                        type="button"
                        onClick={() => {
                          setGoal(pill.key);
                          setPage(1);
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                          isSelected
                            ? "bg-orange-500 text-white shadow-sm"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        {pill.label}
                      </button>
                    );
                  })}
                </div>

                {/* Right controls: View Mode & Reset */}
                <div className="flex items-center gap-2 shrink-0">
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition flex items-center gap-1"
                      title="Xóa tất cả bộ lọc"
                    >
                      <FaRedo className="text-[10px]" />
                      <span>Xóa lọc</span>
                    </button>
                  )}

                  {/* Grid / List Toggle */}
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded-md text-xs transition ${
                        viewMode === "grid"
                          ? "bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-xs"
                          : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                      }`}
                      title="Xem dạng Lưới"
                    >
                      <FaThLarge />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 rounded-md text-xs transition ${
                        viewMode === "list"
                          ? "bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-xs"
                          : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                      }`}
                      title="Xem dạng Danh sách"
                    >
                      <FaList />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RESULTS SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Header info */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Danh sách Huấn Luyện Viên</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400">
                  {total} HLV
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Hiển thị {pts.length} / {total} HLV phù hợp
            </p>
          </div>

          {/* SKELETON LOADER */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 animate-pulse space-y-3"
                >
                  <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                  <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl mt-4" />
                </div>
              ))}
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && pts.length === 0 && (
            <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 max-w-xl mx-auto p-8">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center text-xl mb-3">
                <FaDumbbell />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Không tìm thấy huấn luyện viên phù hợp
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5 leading-relaxed">
                Hãy thử nới lỏng bộ lọc khu vực, đổi mục tiêu thể hình hoặc xóa từ khóa tìm kiếm để xem thêm nhiều HLV khác.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition"
              >
                Xem tất cả huấn luyện viên
              </button>
            </div>
          )}

          {/* TRAINERS LISTING */}
          {!loading && pts.length > 0 && (
            <>
              {/* DENSE GRID VIEW (4 COLUMNS ON DESKTOP) */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                  {pts.map((pt, index) => {
                    const rating = pt.ratingAvg || 5.0;
                    const ratingCount = pt.ratingCount || 0;
                    const priceText = pt.lowestPricePerSession
                      ? `${Number(pt.lowestPricePerSession).toLocaleString("vi-VN")}₫`
                      : "Liên hệ";

                    const coverPhoto =
                      pt.coverImage ||
                      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop";

                    const avatarPhoto =
                      pt.userInfo?.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        pt.userInfo?.name || "PT"
                      )}&background=f97316&color=ffffff`;

                    const specs = pt.specialties || [];
                    const displayedSpecs = specs.slice(0, 2);
                    const remainingSpecsCount = specs.length - 2;
                    {/* TRAINER CARD */}
                    const ptSlug = pt.slug || toSlug(pt.userInfo?.name) || pt.userInfo?._id || pt._id;

                    return (
                      <motion.article
                        key={pt._id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04, duration: 0.25 }}
                        whileHover={{ y: -4 }}
                        className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-lg hover:border-orange-300 dark:hover:border-orange-500/50 transition-all duration-200 overflow-hidden flex flex-col justify-between"
                      >
                        <div>
                          {/* COMPACT COVER IMAGE WITH FLOATING AVATAR */}
                          <div className="relative">
                            <div 
                              className="relative h-32 sm:h-36 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
                              onClick={() => navigate(`/pt/${ptSlug}`)}
                            >
                              <img
                                src={coverPhoto}
                                alt={pt.userInfo?.name || "Trainer"}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                                decoding="async"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                              {/* Top Badges */}
                              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                                {pt.availableForNewClients && (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-xs">
                                    ● Nhận HV
                                  </span>
                                )}
                                {pt.verified && (
                                  <span className="px-2 py-0.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-orange-600 dark:text-orange-400 text-[10px] font-bold shadow-xs">
                                    Verified ✓
                                  </span>
                                )}
                              </div>

                              {/* Rating on cover bottom right */}
                              <div className="absolute bottom-2 right-2.5 px-2 py-0.5 rounded-md bg-slate-950/70 backdrop-blur-sm text-amber-400 text-[11px] font-bold flex items-center gap-1">
                                <FaStar className="text-[10px]" />
                                <span>{rating.toFixed(1)}</span>
                                <span className="text-slate-400 font-normal text-[10px]">
                                  ({ratingCount})
                                </span>
                              </div>
                            </div>

                            {/* Floating Avatar (Fixed: Outside overflow-hidden with z-20) */}
                            <div 
                              className="absolute -bottom-5 left-3.5 z-20 cursor-pointer"
                              onClick={() => navigate(`/pt/${ptSlug}`)}
                            >
                              <img
                                src={avatarPhoto}
                                alt={pt.userInfo?.name}
                                className="w-12 h-12 rounded-xl object-cover ring-2 ring-white dark:ring-slate-900 shadow-md bg-slate-200 dark:bg-slate-700 hover:scale-105 transition"
                                loading="lazy"
                                decoding="async"
                              />
                            </div>
                          </div>

                          {/* CARD BODY */}
                          <div className="p-3.5 pt-6 space-y-2">
                            <div>
                              <h3 
                                onClick={() => navigate(`/pt/${ptSlug}`)}
                                className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition cursor-pointer"
                              >
                                {pt.userInfo?.name || "Huấn luyện viên"}
                              </h3>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                {pt.yearsExperience ?? 1} năm kinh nghiệm
                              </p>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 truncate">
                              <FaMapMarkerAlt className="text-orange-500 text-[10px] shrink-0" />
                              <span className="truncate">
                                {pt.primaryGym?.address || pt.areaNote || "TP. Hồ Chí Minh"}
                              </span>
                            </div>

                            {/* Specialties pills */}
                            <div className="flex flex-wrap gap-1 pt-1">
                              {displayedSpecs.map((s, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium truncate max-w-[130px]"
                                >
                                  {s}
                                </span>
                              ))}
                              {remainingSpecsCount > 0 && (
                                <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] font-medium">
                                  +{remainingSpecsCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* CARD FOOTER WITH COMPACT PRICE & CTA */}
                        <div className="p-3.5 pt-0">
                          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div>
                              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">
                                Giá từ
                              </span>
                              <p className="text-xs sm:text-sm font-black text-orange-600 dark:text-orange-400">
                                {priceText}
                                {pt.lowestPricePerSession && (
                                  <span className="text-[10px] font-normal text-slate-400"> /buổi</span>
                                )}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => navigate(`/pt/${ptSlug}`)}
                              className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs hover:shadow transition flex items-center gap-1"
                            >
                              <span>Xem hồ sơ</span>
                              <FaArrowRight className="text-[9px]" />
                            </button>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              ) : (
                /* COMPACT LIST VIEW */
                <div className="space-y-3">
                  {pts.map((pt, index) => {
                    const rating = pt.ratingAvg || 5.0;
                    const ratingCount = pt.ratingCount || 0;
                    const priceText = pt.lowestPricePerSession
                      ? `${Number(pt.lowestPricePerSession).toLocaleString("vi-VN")}₫`
                      : "Liên hệ";

                    const avatarPhoto =
                      pt.userInfo?.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        pt.userInfo?.name || "PT"
                      )}&background=f97316&color=ffffff`;

                    return (
                      <motion.article
                        key={pt._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03, duration: 0.2 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs hover:shadow-md hover:border-orange-300 dark:hover:border-orange-500/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        {/* Left: Avatar & Info */}
                        <div className="flex items-center gap-3.5">
                          <img
                            src={avatarPhoto}
                            alt={pt.userInfo?.name}
                            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 shrink-0"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                                {pt.userInfo?.name}
                              </h3>
                              {pt.verified && (
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                                  Verified ✓
                                </span>
                              )}
                              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                                <FaStar />
                                <span>{rating.toFixed(1)}</span>
                                <span className="text-slate-400 font-normal">({ratingCount})</span>
                              </div>
                            </div>

                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {pt.yearsExperience ?? 1} năm kinh nghiệm • {pt.primaryGym?.name || pt.primaryGym?.address || "Hồ Chí Minh"}
                            </p>

                            {/* Specialties pills */}
                            <div className="flex flex-wrap gap-1.5 pt-0.5">
                              {(pt.specialties || []).map((s, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right: Price & CTA */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 shrink-0">
                          <div className="sm:text-right">
                            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">
                              Giá chỉ từ
                            </span>
                            <span className="text-base font-black text-orange-600 dark:text-orange-400">
                              {priceText}
                            </span>
                            {pt.lowestPricePerSession && (
                              <span className="text-[10px] text-slate-400 font-normal"> /buổi</span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const ptSlug = pt.slug || toSlug(pt.userInfo?.name) || pt.userInfo?._id || pt._id;
                              navigate(`/pt/${ptSlug}`);
                            }}
                            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                          >
                            <span>Xem hồ sơ & Đặt lịch</span>
                            <FaArrowRight className="text-[10px]" />
                          </button>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              )}

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-3 text-xs sm:text-sm">
                  <button
                    disabled={page === 1}
                    onClick={() => {
                      setPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 300, behavior: "smooth" });
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold disabled:opacity-40 hover:border-orange-500 hover:text-orange-600 transition shadow-xs"
                  >
                    ← Trang trước
                  </button>
                  <span className="text-slate-500 dark:text-slate-400 font-medium px-2">
                    Trang <strong className="text-slate-900 dark:text-white">{page}</strong> / {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => {
                      setPage((p) => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 300, behavior: "smooth" });
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold disabled:opacity-40 hover:border-orange-500 hover:text-orange-600 transition shadow-xs"
                  >
                    Trang kế tiếp →
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* LOCATION SELECTION MODAL */}
        <AnimatePresence>
          {isLocationModalOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
              >
                {/* Modal Header */}
                <div className="p-5 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center text-xs font-bold">
                      <FaMapMarkerAlt />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        Chọn Khu Vực & Định Vị
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Tìm kiếm HLV gần khu vực của bạn
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsLocationModalOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-5 space-y-4">
                  {/* Quick GPS button */}
                  <div>
                    <button
                      type="button"
                      onClick={detectLocation}
                      disabled={detecting}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                    >
                      <FaCrosshairs className={detecting ? "animate-spin" : ""} />
                      <span>
                        {detecting ? "Đang dò toạ độ GPS..." : "Dùng vị trí hiện tại (GPS)"}
                      </span>
                    </button>
                    {detectedInfo && (
                      <p className="text-center text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
                        {detectedInfo}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                    <span>Hoặc chọn Tỉnh / Thành</span>
                    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                  </div>

                  {/* Province Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Tỉnh / Thành phố
                    </label>
                    <select
                      value={area}
                      onChange={(e) => {
                        setArea(e.target.value);
                        if (e.target.value) setCoords("");
                      }}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                    >
                      <option value="">-- Tất cả các tỉnh thành --</option>
                      {provinces.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5 bg-slate-50/50 dark:bg-slate-800/40">
                  <button
                    type="button"
                    onClick={() => {
                      setArea("");
                      setCoords("");
                      setIsLocationModalOpen(false);
                      setPage(1);
                    }}
                    className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition"
                  >
                    Xóa vị trí
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLocationModalOpen(false);
                      setPage(1);
                    }}
                    className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow transition"
                  >
                    Áp dụng
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}
