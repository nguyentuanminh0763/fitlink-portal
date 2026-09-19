import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaAward,
  FaDumbbell,
} from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80">
      {/* Trust Highlights Bar */}
      <div className="border-b border-slate-800/60 bg-slate-900/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center text-lg shrink-0">
              <FaAward />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">100% PT Kiểm Duyệt</p>
              <p className="text-xs text-slate-400">Đầy đủ chứng chỉ thể hình & y học thể thao</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center text-lg shrink-0">
              <FaShieldAlt />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Bảo Vệ Học Viên</p>
              <p className="text-xs text-slate-400">Đổi huấn luyện viên linh hoạt nếu không hợp</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center text-lg shrink-0">
              <FaDumbbell />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Cá Nhân Hóa 100%</p>
              <p className="text-xs text-slate-400">Giáo án thiết kế theo chỉ số cơ thể thực tế</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Col 1: Brand Info */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-orange-500/20">
              <FaDumbbell />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white">
              FitLink<span className="text-orange-500">.</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
            Nền tảng công nghệ thể hình thông minh kết nối học viên với huấn luyện viên cá nhân (PT) uy tín, mang lại lộ trình tập luyện và dinh dưỡng khoa học chuẩn y khoa.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-orange-500 text-slate-300 hover:text-white flex items-center justify-center transition-all"
              aria-label="Facebook"
            >
              <FaFacebookF className="text-sm" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-orange-500 text-slate-300 hover:text-white flex items-center justify-center transition-all"
              aria-label="Instagram"
            >
              <FaInstagram className="text-sm" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-orange-500 text-slate-300 hover:text-white flex items-center justify-center transition-all"
              aria-label="YouTube"
            >
              <FaYoutube className="text-sm" />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-orange-500 text-slate-300 hover:text-white flex items-center justify-center transition-all"
              aria-label="TikTok"
            >
              <FaTiktok className="text-sm" />
            </a>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div>
          <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
            Khám phá
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/home" className="hover:text-orange-400 transition-colors">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link to="/list-pt" className="hover:text-orange-400 transition-colors">
                Tìm Huấn luyện viên
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-orange-400 transition-colors">
                Về chúng tôi
              </Link>
            </li>
            <li>
              <Link to="/news" className="hover:text-orange-400 transition-colors">
                Kiến thức & Blog
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-orange-400 transition-colors">
                Liên hệ tư vấn
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Specialties */}
        <div>
          <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
            Chương trình tập
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/list-pt" className="hover:text-orange-400 transition-colors">
                Giảm mỡ & Siết cân
              </Link>
            </li>
            <li>
              <Link to="/list-pt" className="hover:text-orange-400 transition-colors">
                Tăng cơ & Sức mạnh
              </Link>
            </li>
            <li>
              <Link to="/list-pt" className="hover:text-orange-400 transition-colors">
                Chỉnh dáng & Phục hồi
              </Link>
            </li>
            <li>
              <Link to="/list-pt" className="hover:text-orange-400 transition-colors">
                Kickboxing & Cardio HIIT
              </Link>
            </li>
            <li>
              <Link to="/list-pt" className="hover:text-orange-400 transition-colors">
                Huấn luyện tại nhà / Gym
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact Info */}
        <div>
          <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
            Liên hệ hỗ trợ
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2.5">
              <FaPhoneAlt className="text-orange-500 text-xs shrink-0" />
              <a href="tel:1900888999" className="hover:text-white transition">
                1900 888 999
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <FaEnvelope className="text-orange-500 text-xs shrink-0" />
              <a href="mailto:support@fitlink.vn" className="hover:text-white transition">
                support@fitlink.vn
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <FaMapMarkerAlt className="text-orange-500 text-xs mt-1 shrink-0" />
              <span>TP. Hồ Chí Minh & Hà Nội, Việt Nam</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} FitLink Platform. Nền tảng huấn luyện thể hình cá nhân.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-200 transition">Điều khoản sử dụng</Link>
            <Link to="/about" className="hover:text-slate-200 transition">Chính sách bảo mật</Link>
            <Link to="/contact" className="hover:text-slate-200 transition">Hỗ trợ kỹ thuật</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
