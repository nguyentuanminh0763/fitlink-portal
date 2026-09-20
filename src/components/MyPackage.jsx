import React, { useEffect, useState } from "react";
import myPackagesService from "~/services/myPackagesService";
import materialService from "~/services/materialService"; // ⭐ NEW
import Navbar from "~/components/Navbar";

export default function MyPackage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPkg, setSelectedPkg] = useState(null);

  // ⭐ NEW — state cho tài liệu
  const [materials, setMaterials] = useState([]);
  const [showMaterials, setShowMaterials] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const pkgRes = await myPackagesService.getMyPackages();
        setPackages(pkgRes.data);
      } catch (err) {
        console.error("Lỗi lấy gói tập:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const openDetail = (pkg) => setSelectedPkg(pkg);
  const closeDetail = () => setSelectedPkg(null);

  // ⭐ NEW — load tài liệu theo packageId
  async function loadMaterials() {
    try {
      const mats = await materialService.getMaterialsByPackage(
        selectedPkg.package?._id
      );
      setMaterials(mats);
      setShowMaterials(true);
    } catch (err) {
      console.error("Lỗi load tài liệu:", err);
    }
  }

  if (loading)
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    );

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* HEADER */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 text-slate-900 dark:text-white">
          Gói tập của tôi
        </h1>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 overflow-hidden transition-colors">
          {/* HEADER ROW */}
          <div className="grid grid-cols-6 font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 py-3.5 px-6 border-b border-slate-200 dark:border-slate-800 text-sm">
            <div>Tên gói</div>
            <div className="text-center">Số buổi</div>
            <div className="text-center">Thời hạn</div>
            <div className="text-center">Hết hạn</div>
            <div className="text-center">Trạng thái</div>
            <div className="text-right">Thao tác</div>
          </div>

          {packages.length === 0 ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
              Bạn chưa đăng ký gói tập nào. Hãy khám phá danh sách huấn luyện viên nhé!
            </div>
          ) : (
            packages.map((pkg) => {
              const duration =
                pkg.startDate && pkg.endDate
                  ? Math.ceil(
                      (new Date(pkg.endDate) - new Date(pkg.startDate)) /
                        (1000 * 60 * 60 * 24)
                    )
                  : null;

              return (
                <div
                  key={pkg._id}
                  className="grid grid-cols-6 items-center py-4 px-6 border-b border-slate-100 dark:border-slate-800/70 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition text-sm"
                >
                  <div className="text-slate-900 dark:text-white font-medium">
                    {pkg.package?.name || "Unknown package"}
                  </div>

                  <div className="text-center text-slate-600 dark:text-slate-300">
                    {pkg.totalSessions} buổi
                  </div>

                  <div className="text-center text-slate-600 dark:text-slate-300">
                    {duration ? `${duration} ngày` : "-"}
                  </div>

                  <div className="text-center text-slate-600 dark:text-slate-300">
                    {pkg.endDate
                      ? new Date(pkg.endDate).toLocaleDateString()
                      : "-"}
                  </div>

                  <div className="text-center">
                    <span className="inline-block px-3 py-0.5 bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full border border-green-200 dark:border-green-800">
                      Active
                    </span>
                  </div>

                  <div className="text-right flex gap-2 justify-end">
                    <button
                      onClick={() => openDetail(pkg)}
                      className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-xs"
                    >
                      Chi tiết
                    </button>

                    <button
                      onClick={() =>
                        (window.location.href = `/training-calendar`)
                      }
                      className="px-3.5 py-1.5 text-xs font-semibold bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition shadow-xs"
                    >
                      Lịch tập
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* MODAL DETAILS */}
      {selectedPkg && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl animate-fadeIn transition-colors">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Thông tin chi tiết gói tập
            </h2>

            <Detail label="Tên gói" value={selectedPkg.package?.name} />
            <Detail
              label="Số buổi"
              value={`${selectedPkg.totalSessions} buổi`}
            />
            <Detail
              label="Thời hạn"
              value={`${Math.ceil(
                (new Date(selectedPkg.endDate) -
                  new Date(selectedPkg.startDate)) /
                  (1000 * 60 * 60 * 24)
              )} ngày`}
            />
            <Detail
              label="Ngày hết hạn"
              value={new Date(selectedPkg.endDate).toLocaleDateString()}
            />
            <Detail label="Huấn luyện viên (PT)" value={selectedPkg.pt?.name} />

            <div className="text-right mt-6 flex justify-end gap-2.5">
              <button
                onClick={loadMaterials}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition"
              >
                Xem tài liệu
              </button>

              <button
                onClick={() => (window.location.href = "/training-calendar")}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition"
              >
                Xem lịch tập
              </button>

              <button
                onClick={closeDetail}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MATERIAL MODAL */}
      {showMaterials && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-fadeIn transition-colors">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Tài liệu đã chia sẻ</h2>

            {materials.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-sm py-4">
                Huấn luyện viên chưa chia sẻ tài liệu bài tập cho gói này.
              </p>
            ) : (
              <div className="space-y-3">
                {materials.map((mat) => (
                  <div key={mat._id} className="border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 p-3.5 rounded-xl">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{mat.title}</p>

                    {mat.url && (
                      <a
                        href={mat.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-orange-500 hover:text-orange-600 hover:underline text-xs font-medium mt-1 inline-block"
                      >
                        Mở tập tin đính kèm →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="text-right mt-6">
              <button
                onClick={() => setShowMaterials(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="mb-3.5">
      <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">{label}</p>
      <p className="text-base font-semibold text-slate-900 dark:text-white">{value || "—"}</p>
    </div>
  );
}
