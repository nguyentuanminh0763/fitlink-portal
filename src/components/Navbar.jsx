// src/components/Navbar.jsx
import React, { useEffect, useState, useRef, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUser,
  FaBars,
  FaTimes,
  FaDumbbell,
  FaSignOutAlt,
  FaCalendarAlt,
  FaBoxOpen,
  FaComments,
  FaTachometerAlt,
  FaChevronDown,
  FaSun,
  FaMoon,
} from 'react-icons/fa';
import { AuthContext } from '~/contexts/AuthContext';
import { useTheme } from '~/contexts/ThemeContext';
import { logout } from '~/services/authService';
import { toast } from 'react-toastify';
import NotificationBell from '~/components/notifications/NotificationBell';

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const profileRef = useRef();

  // Close profile on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  const handleClickLogout = async () => {
    try {
      await logout();
      toast.success('Đăng xuất thành công!');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Đăng xuất thất bại, vui lòng thử lại.');
    }
  };

  const navLinks = [
    { label: 'Trang chủ', path: '/home', matchPaths: ['/home', '/'] },
    { label: 'Huấn luyện viên', path: '/list-pt', matchPaths: ['/list-pt', '/trainer', '/pt'] },
    { label: 'Về FitLink', path: '/about', matchPaths: ['/about'] },
    { label: 'Kiến thức & Tin tức', path: '/news', matchPaths: ['/news'] },
    { label: 'Liên hệ tư vấn', path: '/contact', matchPaths: ['/contact'] },
  ];

  const isActive = (link) => {
    return link.matchPaths.some((p) =>
      p === '/' ? location.pathname === '/' : location.pathname.startsWith(p)
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-orange-100/70 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <FaDumbbell className="text-xl" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              FitLink<span className="text-orange-500">.</span>
            </span>
            <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400 tracking-wider uppercase -mt-0.5">
              Personal Coaching
            </span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const active = isActive(link);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  active
                    ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="navbar-indicator"
                    className="absolute bottom-1 left-4 right-4 h-0.5 bg-orange-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT CONTROLS: THEME / AUTH / PROFILE / HAMBURGER */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* THEME TOGGLE (DESKTOP & TABLET) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-slate-200 dark:border-slate-700 shadow-sm"
            title={isDark ? "Chuyển sang chế độ Sáng" : "Chuyển sang chế độ Tối"}
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <FaSun className="text-amber-400 text-base" />
            ) : (
              <FaMoon className="text-slate-600 text-sm" />
            )}
          </button>

          {user ? (
            <div className="relative flex items-center gap-2.5 sm:gap-3" ref={profileRef}>
              {/* Notification Bell */}
              <NotificationBell
                isOpen={isNotifOpen}
                onOpen={() => {
                  setIsNotifOpen(true);
                  setIsProfileOpen(false);
                }}
                onClose={() => setIsNotifOpen(false)}
                variant={isDark ? "dark" : "light"}
              />

              {/* Profile Trigger Button */}
              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen((prev) => !prev);
                  setIsNotifOpen(false);
                }}
                className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-slate-200/80 dark:border-slate-700 group"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || 'User'}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-400/40"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : <FaUser className="text-xs" />}
                  </div>
                )}
                <span className="hidden sm:inline text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                  {user.name || 'Tài khoản'}
                </span>
                <FaChevronDown
                  className={`text-[10px] text-slate-400 transition-transform duration-200 ${
                    isProfileOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Profile Menu */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl text-slate-700 dark:text-slate-200 z-[9999] overflow-hidden"
                  >
                    {/* User summary header */}
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-slate-800 dark:to-slate-800/80 border-b border-orange-100/60 dark:border-slate-700">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{user.name || 'Thành viên'}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email || user.phone}</p>
                      <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-orange-200/70 dark:bg-orange-900/60 text-orange-800 dark:text-orange-300 text-[10px] font-bold uppercase tracking-wider">
                        {user.role === 'admin'
                          ? 'Quản trị viên'
                          : user.role === 'pt'
                          ? 'Huấn luyện viên'
                          : 'Học viên'}
                      </span>
                    </div>

                    {/* Menu links based on role */}
                    <ul className="py-2 text-sm">
                      <li
                        className="px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-3 transition-colors font-medium text-slate-700 dark:text-slate-200"
                        onClick={() => {
                          navigate('/profile');
                          setIsProfileOpen(false);
                        }}
                      >
                        <FaUser className="text-slate-400 text-xs" />
                        Hồ sơ cá nhân
                      </li>

                      {user.role === 'admin' && (
                        <li
                          className="px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-3 transition-colors font-medium text-slate-700 dark:text-slate-200"
                          onClick={() => {
                            navigate('/admin');
                            setIsProfileOpen(false);
                          }}
                        >
                          <FaTachometerAlt className="text-slate-400 text-xs" />
                          Trang quản trị Admin
                        </li>
                      )}

                      {user.role === 'pt' && (
                        <>
                          <li
                            className="px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-3 transition-colors font-medium text-slate-700 dark:text-slate-200"
                            onClick={() => {
                              navigate('/pt/dashboard');
                              setIsProfileOpen(false);
                            }}
                          >
                            <FaTachometerAlt className="text-slate-400 text-xs" />
                            Bảng điều khiển PT
                          </li>
                          <li
                            className="px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-3 transition-colors font-medium text-slate-700 dark:text-slate-200"
                            onClick={() => {
                              navigate('/pt/schedule');
                              setIsProfileOpen(false);
                            }}
                          >
                            <FaCalendarAlt className="text-slate-400 text-xs" />
                            Lịch huấn luyện
                          </li>
                          <li
                            className="px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-3 transition-colors font-medium text-slate-700 dark:text-slate-200"
                            onClick={() => {
                              navigate('/pt/packages');
                              setIsProfileOpen(false);
                            }}
                          >
                            <FaBoxOpen className="text-slate-400 text-xs" />
                            Quản lý gói tập
                          </li>
                        </>
                      )}

                      {user.role === 'student' && (
                        <>
                          <li
                            className="px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-3 transition-colors font-medium text-slate-700 dark:text-slate-200"
                            onClick={() => {
                              navigate('/training-calendar');
                              setIsProfileOpen(false);
                            }}
                          >
                            <FaCalendarAlt className="text-slate-400 text-xs" />
                            Lịch tập của tôi
                          </li>
                          <li
                            className="px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-3 transition-colors font-medium text-slate-700 dark:text-slate-200"
                            onClick={() => {
                              navigate('/my-packages');
                              setIsProfileOpen(false);
                            }}
                          >
                            <FaBoxOpen className="text-slate-400 text-xs" />
                            Gói tập đã mua
                          </li>
                        </>
                      )}

                      <li
                        className="px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-3 transition-colors font-medium text-slate-700 dark:text-slate-200"
                        onClick={() => {
                          navigate('/chat');
                          setIsProfileOpen(false);
                        }}
                      >
                        <FaComments className="text-slate-400 text-xs" />
                        Tin nhắn trò chuyện
                      </li>

                      <li
                        className="px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer flex items-center gap-3 transition-colors font-semibold border-t border-slate-100 dark:border-slate-800 mt-1 pt-2"
                        onClick={() => {
                          setIsProfileOpen(false);
                          setIsNotifOpen(false);
                          handleClickLogout();
                        }}
                      >
                        <FaSignOutAlt className="text-red-500 text-xs" />
                        Đăng xuất
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-md shadow-orange-500/25 hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                Bắt đầu ngay
              </button>
            </div>
          )}

          {/* MOBILE HAMBURGER BUTTON */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden border-t border-orange-100/70 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-5 shadow-2xl space-y-4"
          >
            {/* THEME TOGGLE IN MOBILE DRAWER */}
            <div>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center justify-between w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold transition"
              >
                <span className="flex items-center gap-2.5">
                  {isDark ? <FaSun className="text-amber-400 text-base" /> : <FaMoon className="text-slate-600 text-sm" />}
                  <span>Giao diện {isDark ? "Tối (Dark Mode)" : "Sáng (Light Mode)"}</span>
                </span>
                <span className="text-xs text-orange-600 dark:text-orange-400 font-bold">Chạm để đổi</span>
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const active = isActive(link);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl text-base font-semibold flex items-center justify-between transition-all ${
                      active
                        ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{link.label}</span>
                    {active && <span className="w-2 h-2 rounded-full bg-orange-500" />}
                  </Link>
                );
              })}
            </nav>

            {!user && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="w-full py-3 rounded-xl text-center font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/register');
                  }}
                  className="w-full py-3 rounded-xl text-center font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-600 shadow-md hover:shadow-lg transition"
                >
                  Đăng ký tài khoản
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
