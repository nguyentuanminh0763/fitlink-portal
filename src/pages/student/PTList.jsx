import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePublicPTListQuery } from '~/hooks/usePTQueries'
import { getPackagesByPTPublic } from '~/services/packageService'
import MainLayout from '~/layouts/MainLayout'
import { FaSearch, FaClock, FaComments } from 'react-icons/fa'
import { toSlug } from '~/utils/slug'

const PTList = () => {
  const { data: ptList = [], isLoading: loading, error: queryError } = usePublicPTListQuery()
  const [packagesByPT, setPackagesByPT] = useState({})
  const error = queryError ? 'Lỗi khi tải danh sách PT.' : null
  const navigate = useNavigate()

  // 🔹 Lấy gói tập của từng PT
  const fetchPackagesForAllPTs = async (ptProfiles) => {
    const packageMap = {}
    await Promise.all(
      ptProfiles.map(async (pt) => {
        try {
          const res = await getPackagesByPTPublic(pt.user?._id)
          packageMap[pt.user._id] =
            res?.success && Array.isArray(res.data) ? res.data : []
        } catch {
          packageMap[pt.user._id] = []
        }
      })
    )
    setPackagesByPT(packageMap)
  }

  useEffect(() => {
    if (ptList.length > 0) fetchPackagesForAllPTs(ptList)
  }, [ptList])

  if (loading)
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </MainLayout>
    )

  if (error)
    return (
      <MainLayout>
        <p className="text-center text-red-500 font-medium mt-10">{error}</p>
      </MainLayout>
    )

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 pt-[90px]">
          {/* Thanh tìm kiếm bên trái + Tiêu đề giữa */}
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
            {/* Ô tìm kiếm */}
            <div className="relative w-full sm:w-auto">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                placeholder="Tìm kiếm huấn luyện viên..."
                className="pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-full text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 w-full sm:w-64 transition shadow-xs"
              />
            </div>

            {/* Tiêu đề ở giữa */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-center sm:absolute sm:left-1/2 sm:-translate-x-1/2">
              Danh sách Huấn luyện viên cá nhân
            </h1>

            <div className="hidden sm:block w-24" />
          </div>

          {/* Danh sách PT */}
          {ptList.length === 0 ? (
            <p className="text-center text-slate-500 dark:text-slate-400 text-base py-16">
              Chưa có huấn luyện viên nào phù hợp.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {ptList.map((pt) => {
                const allowedTypes = [
                  'Rehab',
                  'Fat loss',
                  'Posture correction',
                  'Mobility'
                ]
                const types =
                  pt.specialties?.filter((s) => allowedTypes.includes(s)) || []
                const ptPackages = packagesByPT[pt.user?._id] || []

                const ptSlug = pt.slug || toSlug(pt.user?.name) || pt.user?._id;

                return (
                  <div
                    key={pt._id}
                    className="cursor-pointer bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-xl overflow-hidden border border-slate-200/80 dark:border-slate-800 hover:-translate-y-1 transform transition duration-300 flex flex-col justify-between"
                    onClick={() => navigate(`/pt/${ptSlug}`)}
                  >
                    {/* Ảnh đại diện */}
                    <div className="relative w-full h-56 bg-slate-200 dark:bg-slate-800">
                      <img
                        src={pt.user?.avatar || '/default-avatar.png'}
                        alt={pt.user?.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      {pt.verified && (
                        <span className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
                          Verified
                        </span>
                      )}
                    </div>

                    {/* Nội dung */}
                    <div className="p-5 text-center flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                          {pt.user?.name}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">
                          Kinh nghiệm: <span className="font-semibold text-slate-700 dark:text-slate-300">{pt.yearsExperience || 0} năm</span>
                        </p>
                        <p className="text-orange-600 dark:text-orange-400 text-xs font-semibold mb-3">
                          {types.length
                            ? types.join(' • ')
                            : 'Chưa cập nhật chuyên môn'}
                        </p>

                        {/* Gói tập nổi bật */}
                        {ptPackages.length > 0 ? (
                          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-left border border-slate-200/70 dark:border-slate-800 mb-3">
                            <p className="text-slate-700 dark:text-slate-300 text-xs font-semibold mb-2">
                              Gói tập nổi bật:
                            </p>
                            {ptPackages.slice(0, 2).map((pkg) => (
                              <div
                                key={pkg._id}
                                className="bg-white dark:bg-slate-850 rounded-lg shadow-2xs border border-slate-200 dark:border-slate-700/80 px-3 py-2 mb-2 hover:shadow-xs transition"
                              >
                                <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                                  {pkg.name}
                                </p>
                                <p className="text-slate-500 dark:text-slate-400 text-[11px] line-clamp-1">
                                  {pkg.description}
                                </p>
                                <div className="flex justify-between mt-1 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                                  <span className="text-orange-600 dark:text-orange-400 font-semibold">{pkg.price?.toLocaleString()} VND</span>
                                  <span className="flex items-center gap-1">
                                    <FaClock className="text-[10px] text-slate-400" /> {pkg.duration} ngày
                                  </span>
                                </div>
                              </div>
                            ))}
                            {ptPackages.length > 2 && (
                              <p className="text-[11px] text-slate-400 dark:text-slate-500 italic text-center">
                                + {ptPackages.length - 2} gói khác...
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-slate-400 dark:text-slate-500 text-xs italic mb-4">
                            Chưa có gói tập công khai
                          </p>
                        )}
                      </div>

                      {/* Nút hành động */}
                      <div className="mt-2 flex gap-2.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/pt/${ptSlug}`)
                          }}
                          className="flex-1 bg-gradient-to-r from-orange-500 to-amber-600 text-white py-2 rounded-xl text-xs font-semibold hover:from-orange-600 hover:to-amber-700 transition shadow-xs"
                        >
                          Xem chi tiết
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/chat/${pt.user?._id}`)
                          }}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <FaComments size={13} />
                          <span>Nhắn tin</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default PTList
