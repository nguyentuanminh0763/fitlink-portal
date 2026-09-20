import React, { useEffect, useState, useContext } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { AuthContext } from '~/contexts/AuthContext';
import { useTheme } from '~/contexts/ThemeContext';
import MainLayout from '~/layouts/MainLayout';
import { fetchTrainingSessions } from '~/services/trainingSessionService';
import { fetchStudentPackages } from '~/services/studentPackage';
import { 
  ChevronDown, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Dumbbell, 
  Clock, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import socket from '~/api/socket';

moment.locale('vi');
const localizer = momentLocalizer(moment);

const TrainingCalendar = ({ role = 'student' }) => {
  const { user } = useContext(AuthContext);
  const { isDark } = useTheme();
  const [events, setEvents] = useState([]);
  const [packages, setPackages] = useState([]);
  const [expandedPT, setExpandedPT] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week');
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?._id) {
      loadPackages();
    }
  }, [user]);

  const loadPackages = async () => {
    try {
      setLoadingPackages(true);
      const res = await fetchStudentPackages();
      const pkgList = res.data || [];
      setPackages(pkgList);
      
      // Tự động chọn gói đầu tiên nếu chưa chọn
      if (pkgList.length > 0 && !selectedPackage) {
        setSelectedPackage(pkgList[0]);
        const ptName = pkgList[0].pt?.name || (pkgList[0].pt?.email ? pkgList[0].pt.email.split('@')[0] : 'PT');
        setExpandedPT(ptName);
      }
    } catch (err) {
      console.error('Lỗi khi tải gói tập:', err);
    } finally {
      setLoadingPackages(false);
    }
  };

  useEffect(() => {
    if (selectedPackage?._id) {
      setEvents([]);
      loadSessions(selectedPackage._id);
    }
  }, [selectedPackage]);

  // REALTIME SESSION UPDATE
  useEffect(() => {
    if (!selectedPackage?._id) return;

    const handler = (data) => {
      console.log('Realtime session update received:', data);
      loadSessions(selectedPackage._id);
    };

    socket.on('session_updated', handler);
    return () => socket.off('session_updated', handler);
  }, [selectedPackage]);

  const loadSessions = async (packageId) => {
    try {
      setLoadingSessions(true);
      const data = await fetchTrainingSessions({
        userId: user._id,
        role,
        packageId
      });

      if (!data?.sessions?.length) {
        setEvents([]);
        return;
      }

      const formatted = data.sessions.map((s) => ({
        id: s._id,
        title: s.title || `Buổi tập với ${selectedPackage?.pt?.name || 'PT'}`,
        start: new Date(s.startTime),
        end: new Date(s.endTime),
        statusType: s.status || 'scheduled'
      }));

      setEvents(formatted);
    } catch (err) {
      console.error('Lỗi khi tải lịch tập:', err);
    } finally {
      setLoadingSessions(false);
    }
  };

  const groupPackagesByPT = (packages) => {
    const grouped = {};
    packages.forEach((pkg) => {
      let ptName = 'Huấn luyện viên FitLink';
      if (pkg.pt?.name) ptName = pkg.pt.name;
      else if (pkg.pt?.email) ptName = pkg.pt.email.split('@')[0];
      if (!grouped[ptName]) grouped[ptName] = [];
      grouped[ptName].push(pkg);
    });
    return grouped;
  };

  const eventStyleGetter = (event) => {
    let bg = '#3b82f6';
    let border = '#2563eb';
    if (event.statusType === 'completed') {
      bg = '#10b981';
      border = '#059669';
    } else if (event.statusType === 'missed' || event.statusType === 'cancelled') {
      bg = '#ef4444';
      border = '#dc2626';
    }
    return {
      style: {
        backgroundColor: bg,
        borderColor: border,
        color: '#ffffff',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: '600',
        padding: '3px 6px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
        border: `1px solid ${border}`
      }
    };
  };

  return (
    <MainLayout>
      <div className={`pt-28 pb-16 min-h-screen transition-colors duration-200 ${
        isDark ? '!bg-slate-950 text-slate-100' : '!bg-slate-50/70 text-slate-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Lịch tập luyện cá nhân
                </h1>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Theo dõi và đồng bộ các buổi tập luyện cùng Huấn luyện viên FitLink theo thời gian thực
              </p>
            </div>

            {/* STATUS LEGEND */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/50">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Sắp diễn ra</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Đã hoàn thành</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200/60 dark:border-red-800/50">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>Đã bỏ lỡ</span>
              </div>
            </div>
          </div>

          {/* MAIN TWO-COLUMN CONTENT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* SIDEBAR: PACKAGES & PT LIST (4 COLS) */}
            <div className="lg:col-span-4 xl:col-span-3 space-y-4">
              <div className={`rounded-2xl border p-5 transition-all shadow-sm ${
                isDark 
                  ? '!bg-slate-900 border-slate-800 text-white' 
                  : '!bg-white border-slate-200/80 text-slate-900'
              }`}>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-orange-500" />
                    Gói tập của bạn
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
                    {packages.length} gói
                  </span>
                </div>

                {loadingPackages ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-400">
                    <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs">Đang tải danh sách...</span>
                  </div>
                ) : packages.length === 0 ? (
                  <div className="py-6 px-2 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-500 flex items-center justify-center">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Chưa có gói tập nào
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                      Bạn chưa kích hoạt gói tập nào cùng Huấn luyện viên. Hãy khám phá và đặt lịch ngay!
                    </p>
                    <Link
                      to="/list-pt"
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 hover:from-orange-600 hover:to-amber-600 transition"
                    >
                      <span>Tìm Huấn Luyện Viên</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(groupPackagesByPT(packages)).map(([ptName, ptPackages]) => {
                      const isExpanded = expandedPT === ptName;
                      return (
                        <div key={ptName} className="rounded-xl overflow-hidden border border-slate-200/70 dark:border-slate-800">
                          {/* PT HEADER BUTTON */}
                          <button
                            type="button"
                            onClick={() => setExpandedPT(isExpanded ? null : ptName)}
                            className={`w-full flex items-center justify-between p-3 text-left transition ${
                              isExpanded 
                                ? 'bg-orange-50/60 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400' 
                                : 'bg-slate-50/70 dark:bg-slate-800/40 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-300 font-bold flex items-center justify-center text-xs border border-orange-200 dark:border-orange-800 flex-shrink-0">
                                {ptName.charAt(0).toUpperCase()}
                              </div>
                              <div className="truncate">
                                <span className="font-semibold text-xs sm:text-sm truncate block">{ptName}</span>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                                  {ptPackages.length} gói đang tập
                                </span>
                              </div>
                            </div>
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-orange-500 flex-shrink-0" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            )}
                          </button>

                          {/* PT PACKAGES LIST */}
                          {isExpanded && (
                            <div className="p-2 space-y-2 bg-white dark:bg-slate-900 border-t border-slate-200/70 dark:border-slate-800">
                              {ptPackages.map((pkg) => {
                                const isSelected = selectedPackage?._id === pkg._id;
                                return (
                                  <div
                                    key={pkg._id}
                                    onClick={() => setSelectedPackage(pkg)}
                                    className={`cursor-pointer p-3 rounded-xl border transition-all ${
                                      isSelected
                                        ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-500 text-orange-600 dark:text-orange-400 shadow-sm'
                                        : 'bg-slate-50/50 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-bold text-xs sm:text-sm truncate">
                                        {pkg.package?.name || 'Gói Huấn Luyện'}
                                      </span>
                                      {isSelected && (
                                        <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                                      <Clock className="w-3 h-3 text-slate-400" />
                                      <span className="truncate">{pkg.booking?.slotKey || 'Khung giờ cố định'}</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* QUICK ACTION CARD */}
              <div className={`rounded-2xl border p-4 transition-all ${
                isDark 
                  ? '!bg-slate-900/60 border-slate-800 text-slate-300' 
                  : '!bg-white border-slate-200/80 text-slate-600'
              }`}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Hỗ trợ & Lưu ý</h4>
                <ul className="text-xs space-y-2 text-slate-500 dark:text-slate-400">
                  <li className="flex items-start gap-1.5">
                    <span className="text-orange-500">•</span>
                    <span>Lịch tập cập nhật tức thì khi Huấn luyện viên điều chỉnh lịch.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-orange-500">•</span>
                    <span>Liên hệ PT trước ít nhất 2 giờ nếu cần đổi lịch buổi tập.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* CALENDAR MAIN AREA (8 or 9 COLS) */}
            <div className="lg:col-span-8 xl:col-span-9">
              <div className={`rounded-2xl border shadow-xl p-4 sm:p-6 transition-all ${
                isDark 
                  ? '!bg-slate-900 border-slate-800 shadow-slate-950/50' 
                  : '!bg-white border-slate-200/80 shadow-slate-200/50'
              }`}>
                {/* CALENDAR SUBHEADER */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {selectedPackage ? (
                        <>Lịch buổi tập: <span className="text-orange-600 dark:text-orange-400">{selectedPackage.package?.name}</span></>
                      ) : (
                        'Chọn gói tập bên trái để hiển thị lịch'
                      )}
                    </span>
                    {loadingSessions && (
                      <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin ml-2" />
                    )}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                    {events.length} buổi tập đã lên lịch
                  </div>
                </div>

                {/* REACT BIG CALENDAR */}
                <div className="calendar-wrapper relative min-h-[650px]">
                  <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    date={currentDate}
                    onNavigate={setCurrentDate}
                    view={view}
                    onView={setView}
                    views={['month', 'week', 'day']}
                    eventPropGetter={eventStyleGetter}
                    min={new Date(0, 0, 0, 5, 0)}
                    max={new Date(0, 0, 0, 22, 30)}
                    messages={{
                      week: 'Tuần',
                      day: 'Ngày',
                      month: 'Tháng',
                      previous: 'Trước',
                      next: 'Sau',
                      today: 'Hôm nay'
                    }}
                    style={{ height: '700px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TrainingCalendar;
