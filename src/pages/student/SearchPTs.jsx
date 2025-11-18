// src/pages/SearchPTs.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchPTs } from "~/services/searchService";
import { PackageTagLabels } from "~/domain/enum";
import MainLayout from "~/layouts/MainLayout";

const modeLabels = {
  atPtGym: "Tại PT's Gym",
  atClient: "Tại nhà khách",
  atOtherGym: "Gym khác",
};

export default function SearchPTs() {
  const navigate = useNavigate();
  const [pts, setPTs] = useState([]);
  const [availableAt, setAvailableAt] = useState("");
  const [sortBy, setSortBy] = useState("best");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [total, setTotal] = useState(0);

  // Location + mode
  const [showLocationScreen, setShowLocationScreen] = useState(false);
  const [area, setArea] = useState("");
  const [selectedMode, setSelectedMode] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [detectedInfo, setDetectedInfo] = useState("");
  const [coords, setCoords] = useState("");
  const [showFallback, setShowFallback] = useState(false);

  // Search by name + goals
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");

  // Provinces
  const provinces = [
    "An Giang", "Bắc Ninh", "Cà Mau", "Cần Thơ", "Cao Bằng", "Đà Nẵng", "Đắk Lắk", "Điện Biên",
    "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Nội", "Hà Tĩnh", "Hải Phòng", "Hưng Yên",
    "Khánh Hòa", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Nghệ An", "Ninh Bình",
    "Phú Thọ", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sơn La", "Tây Ninh", "Thái Nguyên",
    "Thanh Hóa", "Huế", "Tuyên Quang", "Vĩnh Long", "Hồ Chí Minh",
  ];

  // Detect GPS location
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported.");
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const latLon = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
        setCoords(latLon);
        try {
          const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1&accept-language=en`;
          const res = await fetch(url);
          const data = await res.json();
          const addr = data?.address || {};
          const line = addr.city || addr.town || addr.state || data?.display_name || "";
          setDetectedInfo(`Detected: ${line || latLon}`);
        } catch {
          setDetectedInfo(`Detected coordinates: ${latLon}`);
        } finally {
          setDetecting(false);
        }
      },
      () => {
        alert("Failed to get location permission.");
        setDetecting(false);
      }
    );
  };

  // Load saved
  useEffect(() => {
    const savedArea = localStorage.getItem("studentArea");
    const savedMode = localStorage.getItem("studentMode") || "";
    const savedCoords = localStorage.getItem("studentCoords") || "";

    if (savedArea) {
      setArea(savedArea);
      setCoords("");
      localStorage.removeItem("studentCoords");
    } else if (savedCoords) {
      setCoords(savedCoords);
    }

    if (savedMode) setSelectedMode(savedMode);

    setShowLocationScreen(!savedArea && !savedCoords);
  }, []);

  // Save local
  useEffect(() => {
    if (area) localStorage.setItem("studentArea", area);
    if (coords) localStorage.setItem("studentCoords", coords);
    if (selectedMode) localStorage.setItem("studentMode", selectedMode);
  }, [area, coords, selectedMode]);

  // Fetch PTs
  const fetchPTs = async () => {
    if (!area && !coords) return;

    try {
      setLoading(true);
      setError("");

      const params = {
        availableAt,
        sortBy,
        specialty: goal,
        page,
        limit,
        modes: selectedMode ? [selectedMode] : [],
        name,
      };

      if (area) params.area = area;
      else if (coords) params.coords = coords;

      const res = await searchPTs(params);
      const list = res?.items || [];
      setPTs(list);
      setTotal(res?.total || 0);

      setShowFallback(list.length === 0 && !!coords);
    } catch (err) {
      console.error(err);
      setError("Failed to load trainers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showLocationScreen && (area || coords) && selectedMode) fetchPTs();
  }, [
    availableAt,
    sortBy,
    name,
    goal,
    page,
    limit,
    area,
    coords,
    selectedMode,
    showLocationScreen,
  ]);

  const handleConfirmArea = () => {
    if (!area && !coords) {
      alert("Please select a location (city or GPS).");
      return;
    }
    setShowLocationScreen(false);
    setPage(1);
    fetchPTs();
  };

  /* ========== SETUP LOCATION SCREEN ========== */
  if (showLocationScreen) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-white flex flex-col pt-12">
          <div className="px-6 md:px-10 mb-4">
            <button
              onClick={() => setShowLocationScreen(false)}
              className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
            >
              <span>←</span>
              <span>Back to trainers</span>
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center px-4 pb-10">
            <div className="w-full max-w-xl bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-orange-100 px-7 py-8 md:px-10 md:py-10 animate-card-fade-up">
              <div className="text-center mb-6">
                <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[11px] font-semibold text-orange-600 mb-3">
                  <span>📍</span>
                  <span>Step 1 · Chọn khu vực & chế độ tập</span>
                </p>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
                  Tìm <span className="text-orange-600">Personal Trainer</span> gần bạn
                </h1>
                <p className="text-sm text-slate-500">
                  Chọn tỉnh / thành hoặc dùng GPS để chúng mình gợi ý PT phù hợp hơn 🧭
                </p>
              </div>

              {/* Select area */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">
                    Tỉnh / thành
                  </label>
                  <select
                    value={area}
                    onChange={(e) => {
                      setArea(e.target.value);
                      if (e.target.value) {
                        setCoords("");
                        localStorage.removeItem("studentCoords");
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-shadow"
                  >
                    <option value="">-- Chọn tỉnh / thành --</option>
                    {provinces.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Coordinates */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">
                    Hoặc nhập toạ độ
                  </label>
                  <input
                    type="text"
                    value={coords}
                    onChange={(e) => setCoords(e.target.value)}
                    placeholder="VD: 15.96810, 108.26340"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-shadow"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3 mb-5">
                <button
                  onClick={detectLocation}
                  disabled={detecting}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  <span>📡</span>
                  <span>{detecting ? "Đang xác định vị trí..." : "Dùng vị trí hiện tại"}</span>
                </button>
                <button
                  onClick={() => {
                    if (!coords) {
                      alert("Chưa có toạ độ để lưu.");
                      return;
                    }
                    localStorage.setItem("studentCoords", coords);
                    alert(`Đã lưu toạ độ: ${coords}`);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white py-2.5 rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all"
                >
                  <span>💾</span>
                  <span>Lưu toạ độ</span>
                </button>
              </div>

              <button
                onClick={handleConfirmArea}
                disabled={!area && !coords}
                className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-base shadow-md hover:shadow-lg transition-all"
              >
                🔎 Xác nhận & tìm PT
              </button>

              {detectedInfo && (
                <p className="text-center text-xs text-slate-500 mt-4">{detectedInfo}</p>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  /* ========== MAIN PAGE ========== */
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-orange-50/70 to-white text-gray-900 px-4 md:px-6 pt-24 pb-12">
        <div className="max-w-7xl mx-auto">

          {/* HERO + FILTER trên poster */}
          <section className="relative mb-10 rounded-3xl overflow-hidden shadow-xl">
            {/* Background poster */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/poster2.jpg')" }} // hoặc '/poster.jpg'
            />
            {/* Overlay màu để chữ dễ đọc */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />

            {/* Nội dung hero */}
            <div className="relative px-4 md:px-8 lg:px-10 py-7 md:py-9 flex flex-col gap-5 md:gap-6">
              {/* Header text */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 text-white">
                  <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-[11px] font-semibold tracking-wide">
                    <span>🏋️‍♂️</span>
                    <span>Discover your Personal Trainer</span>
                  </p>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight drop-shadow-sm">
                    Personal Trainers
                  </h1>
                  <p className="text-xs md:text-sm text-white/80">
                    Khu vực hiện tại:{" "}
                    <span className="font-semibold">
                      {area || (coords ? "Dựa trên GPS" : "Chưa chọn")}
                    </span>{" "}
                    · Toạ độ:{" "}
                    <span className="font-mono text-[11px]">
                      {coords || "—"}
                    </span>{" "}
                    · Chế độ:{" "}
                    <span className="font-semibold">
                      {selectedMode ? modeLabels[selectedMode] : "Chưa chọn"}
                    </span>
                  </p>
                </div>

                <button
                  onClick={() => setShowLocationScreen(true)}
                  className="self-start md:self-auto inline-flex items-center gap-2 text-xs md:text-sm text-orange-600 bg-white rounded-full px-3.5 py-1.5 font-medium shadow-md hover:shadow-lg hover:text-orange-700 transition-all"
                >
                  ✏️ Change area & mode
                </button>
              </div>

              {/* Filter card nằm trên poster */}
              <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl shadow-lg px-4 py-4 md:px-6 md:py-5 flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2 border-r border-slate-100 pr-3">
                  <span className="hidden md:inline text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Search
                  </span>
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setPage(1);
                    }}
                    className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 min-w-[180px]"
                  />
                </div>

                <select
                  value={goal}
                  onChange={(e) => {
                    setGoal(e.target.value);
                    setPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-sm min-w-[170px] shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                >
                  <option value="">All goals</option>
                  {Object.keys(PackageTagLabels).map((key) => (
                    <option key={key} value={key}>
                      {PackageTagLabels[key] || key}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedMode}
                  onChange={(e) => {
                    setSelectedMode(e.target.value);
                    setPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-sm min-w-[170px] shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                >
                  <option value="">All modes</option>
                  <option value="atPtGym">At PT's Gym</option>
                  <option value="atClient">At Client's Home / Gym</option>
                  <option value="atOtherGym">At Other Gym</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-sm min-w-[150px] shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                >
                  <option value="best">Best match</option>
                  <option value="rating">Highest rating</option>
                  <option value="price">Lowest price</option>
                </select>

                <div className="ml-auto flex items-center gap-3 text-xs text-slate-500">
                  <span>
                    {total > 0 ? `${total} trainers found` : "Chọn filter để tìm PT phù hợp"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Results */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 max-w-5xl gap-6 mx-auto">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-[260px] bg-white border border-orange-100 rounded-3xl shadow-sm animate-pulse"
                >
                  <div className="h-32 bg-slate-100 rounded-t-3xl" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-slate-100 rounded w-2/3" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                    <div className="h-3 bg-slate-100 rounded w-3/4" />
                    <div className="h-8 bg-slate-100 rounded-xl w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-12 font-medium">
              {error}
            </div>
          ) : pts.length === 0 ? (
            <div className="text-center text-slate-500 py-16">
              <p className="text-lg font-semibold mb-2">Không tìm thấy PT phù hợp 🧐</p>
              <p className="text-sm text-slate-500 mb-4">
                Thử đổi khu vực, chế độ tập hoặc bỏ bớt bộ lọc nhé.
              </p>

              {showFallback && (
                <div className="mt-2">
                  <p className="text-xs mb-3">
                    Không có PT nào gần bạn theo GPS. Bạn có thể chuyển sang tìm theo tỉnh / thành.
                  </p>
                  <button
                    onClick={() => {
                      setCoords("");
                      fetchPTs();
                    }}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-full text-sm shadow-md hover:shadow-lg transition-all"
                  >
                    🔄 Tìm theo tỉnh / thành
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 max-w-5xl w-full">
                {pts.map((pt, index) => {
                  const rating = pt.ratingAvg || 0;
                  const ratingRounded = Math.round(rating);
                  const ratingCount = pt.ratingCount || 0;

                  const modes = [];
                  if (pt.deliveryModes?.atPtGym) modes.push("atPtGym");
                  if (pt.deliveryModes?.atClient) modes.push("atClient");
                  if (pt.deliveryModes?.atOtherGym) modes.push("atOtherGym");

                  const priceText = pt.lowestPricePerSession
                    ? `${Number(pt.lowestPricePerSession).toLocaleString("vi-VN")}₫ / buổi`
                    : "Giá: liên hệ";

                  return (
                    <article
                      key={pt._id}
                      className="group mx-auto w-full max-w-sm bg-white rounded-3xl border border-orange-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden animate-card-fade-up"
                      style={{ animationDelay: `${index * 60}ms` }}
                    >
                      {/* COVER IMAGE */}
                      <div className="relative">
                        <img
                          src={
                            pt.coverImage ||
                            pt.userInfo?.avatar ||
                            "https://placehold.co/600x360"
                          }
                          alt={pt.userInfo?.name}
                          className="w-full h-44 object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* BADGES */}
                        {pt.availableForNewClients && (
                          <span className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 shadow-sm">
                            Nhận học viên mới
                          </span>
                        )}

                        {pt.verified && (
                          <span className="absolute top-3 right-3 rounded-full bg-orange-500 text-white px-2.5 py-1 text-[11px] font-semibold shadow">
                            Verified
                          </span>
                        )}

                        {/* AVATAR */}
                        <div className="absolute -bottom-7 left-4 h-20 w-20 rounded-full border-3 border-white overflow-hidden shadow-lg bg-slate-200">
                          <img
                            src={
                              pt.userInfo?.avatar ||
                              pt.coverImage ||
                              "https://placehold.co/120x120"
                            }
                            alt="avatar"
                            className="h-full w-full object-cover object-top"
                          />
                        </div>
                      </div>

                      {/* CONTENT */}
                      <div className="pt-10 pb-4 px-4 flex flex-col justify-between min-h-[200px]">
                        <div>
                          {/* Name + exp */}
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-base font-semibold text-slate-900 truncate">
                                {pt.userInfo?.name || "Unnamed Trainer"}
                              </h3>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {pt.yearsExperience
                                  ? `${pt.yearsExperience}+ năm kinh nghiệm`
                                  : "PT cá nhân"}
                              </p>
                            </div>
                          </div>

                          {/* Rating */}
                          <div className="mt-2 flex items-center gap-2 text-xs">
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span
                                  key={i}
                                  className={
                                    i < ratingRounded ? "text-amber-400" : "text-slate-300"
                                  }
                                >
                                  ★
                                </span>
                              ))}
                            </div>

                            {ratingCount > 0 ? (
                              <span className="text-slate-500">
                                {rating.toFixed(1)} · {ratingCount} đánh giá
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">
                                Chưa có đánh giá
                              </span>
                            )}
                          </div>

                          {/* Gym + Price */}
                          <p className="mt-2 text-xs text-slate-600 line-clamp-2">
                            📍 {pt.primaryGym?.name || "Khu vực linh hoạt"}
                          </p>

                          <p className="mt-1 text-sm font-semibold text-orange-600">
                            {priceText}
                          </p>

                          {/* Tags */}
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {pt.specialties?.slice(0, 2).map((s) => (
                              <span
                                key={s}
                                className="inline-flex items-center rounded-full bg-orange-50 text-[11px] text-orange-700 px-2 py-0.5"
                              >
                                {PackageTagLabels[s] || s}
                              </span>
                            ))}

                            {modes.slice(0, 2).map((m) => (
                              <span
                                key={m}
                                className="inline-flex items-center rounded-full bg-slate-50 text-[11px] text-slate-600 px-2 py-0.5"
                              >
                                {modeLabels[m]}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Button */}
                        <button
                          onClick={() => navigate(`/pt/${pt.userInfo?._id}`)}
                          className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full py-2.5 text-sm shadow-md hover:shadow-lg transition-all"
                        >
                          View details
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-3 text-xs md:text-sm">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:border-orange-400 hover:text-orange-600 transition-colors"
                  >
                    ← Prev
                  </button>
                  <span className="text-slate-500">
                    Page <span className="font-semibold">{page}</span> /{" "}
                    <span className="font-semibold">{totalPages}</span>
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:border-orange-400 hover:text-orange-600 transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
