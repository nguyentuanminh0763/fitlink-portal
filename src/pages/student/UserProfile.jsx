import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import MainLayout from '~/layouts/MainLayout';
import { toast } from 'react-toastify';
import { useAuth } from '~/contexts/AuthProvider';
import { useTheme } from '~/contexts/ThemeContext';
import { User, Lock, Mail, Phone, Calendar as CalendarIcon, MapPin, Camera, ShieldCheck } from 'lucide-react';
import {
  useUserProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation
} from '~/hooks/useUserProfileQuery';

const profileSchema = yup.object().shape({
  name: yup
    .string()
    .required('Tên là bắt buộc')
    .min(2, 'Tên phải từ 2 ký tự')
    .max(30, 'Tên tối đa 30 ký tự'),
  email: yup
    .string()
    .email('Email không đúng định dạng'),
  gender: yup
    .string()
    .oneOf(['male', 'female', 'other'], 'Giới tính không hợp lệ'),
  address: yup
    .string(),
  dob: yup
    .date()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    })
});

const passwordSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .required('Mật khẩu hiện tại là bắt buộc'),
  newPassword: yup
    .string()
    .required('Mật khẩu mới là bắt buộc')
    .min(6, 'Mật khẩu ít nhất 6 ký tự'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Mật khẩu xác nhận không khớp')
    .required('Xác nhận mật khẩu là bắt buộc')
});

export default function UserProfile() {
  const { user: authUser } = useAuth();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // TanStack Query: Tự động lấy profile từ RAM cache 0ms
  const { data: profileData, isLoading: isProfileLoading } = useUserProfileQuery();
  const updateProfileMutation = useUpdateProfileMutation();
  const changePasswordMutation = useChangePasswordMutation();

  const user = profileData || authUser;

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors, isSubmitting: isSubmittingProfile },
    reset: resetProfile
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      gender: user?.gender || '',
      address: user?.address || '',
      dob: user?.dob ? new Date(user.dob).toISOString().split('T')[0] : ''
    }
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
    reset: resetPassword
  } = useForm({
    resolver: yupResolver(passwordSchema)
  });

  // Tự động đồng bộ form khi dữ liệu profileData được nạp hoặc cập nhật từ TanStack Query
  useEffect(() => {
    if (profileData) {
      resetProfile({
        name: profileData.name || '',
        email: profileData.email || '',
        gender: profileData.gender || '',
        address: profileData.address || '',
        dob: profileData.dob ? new Date(profileData.dob).toISOString().split('T')[0] : ''
      });
    }
  }, [profileData, resetProfile]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmitProfile = async (data) => {
    try {
      await updateProfileMutation.mutateAsync({ profileData: data, avatarFile });
      setAvatarFile(null);
      setAvatarPreview(null);
      toast.success('Cập nhật profile thành công!');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Cập nhật profile thất bại');
    }
  };

  const onSubmitPassword = async (data) => {
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      toast.success('Đổi mật khẩu thành công!');
      resetPassword();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Đổi mật khẩu thất bại');
    }
  };

  // Chỉ hiển thị spinner nếu chưa có dữ liệu trong cache (lần mở đầu tiên không có cache)
  if (isProfileLoading && !user) {
    return (
      <MainLayout>
        <div className={`pt-32 pb-16 min-h-screen flex items-center justify-center transition-colors duration-200 ${
          isDark ? '!bg-slate-950 text-slate-100' : '!bg-slate-50 text-slate-900'
        }`}>
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
            <span className="text-sm font-medium text-slate-400">Đang tải thông tin cá nhân...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={`pt-28 pb-16 min-h-screen transition-colors duration-200 ${
        isDark ? '!bg-slate-950 text-slate-100' : '!bg-slate-50/70 text-slate-800'
      }`}>
        <div className="container mx-auto px-4 max-w-4xl">
          {/* HEADER PROFILE BANNER */}
          <div className={`rounded-2xl shadow-xl border p-6 sm:p-8 mb-8 transition-all duration-300 ${
            isDark
              ? '!bg-slate-900 border-slate-800 text-white shadow-slate-950/40'
              : '!bg-white border-slate-200/80 text-slate-800 shadow-slate-200/50'
          }`}>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar with Camera shortcut */}
              <div className="relative group flex-shrink-0">
                <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-orange-500/30 dark:ring-orange-500/20 bg-orange-100 dark:bg-orange-950 flex items-center justify-center shadow-inner">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl text-orange-600 dark:text-orange-400 font-black">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <label 
                  htmlFor="avatar-upload-direct" 
                  className="absolute -bottom-2 -right-2 p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg cursor-pointer transition transform hover:scale-110 active:scale-95"
                  title="Thay đổi ảnh đại diện nhanh"
                >
                  <Camera className="w-4 h-4" />
                </label>
                <input
                  id="avatar-upload-direct"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              {/* User Info Details */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {user?.name || 'Người dùng'}
                  </h1>
                  <span className="inline-flex items-center gap-1.5 self-center sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-950/70 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/60">
                    <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
                    {user?.role === 'admin' ? 'Quản trị viên' : user?.role === 'pt' ? 'Huấn luyện viên' : 'Học viên FitLink'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-slate-600 dark:text-slate-400 mt-2">
                  {user?.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-orange-500/80" />
                      <span>{user.email}</span>
                    </div>
                  )}
                  {user?.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-orange-500/80" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* TABS & FORM CONTAINER */}
          <div className={`rounded-2xl shadow-xl border overflow-hidden transition-all duration-300 ${
            isDark
              ? '!bg-slate-900 border-slate-800 shadow-slate-950/40'
              : '!bg-white border-slate-200/80 shadow-slate-200/50'
          }`}>
            {/* Tabs Header */}
            <div className={`border-b px-6 pt-2 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200/80 bg-slate-50/50'}`}>
              <nav className="flex space-x-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 px-2 border-b-2 font-bold text-sm flex items-center gap-2 transition ${
                    activeTab === 'profile'
                      ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Thông tin cá nhân</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('password')}
                  className={`py-4 px-2 border-b-2 font-bold text-sm flex items-center gap-2 transition ${
                    activeTab === 'password'
                      ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Đổi mật khẩu</span>
                </button>
              </nav>
            </div>

            {/* Tab Body */}
            <div className="p-6 sm:p-8">
              {activeTab === 'profile' && (
                <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Họ và tên */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        {...registerProfile('name')}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                          isDark 
                            ? '!bg-slate-800/90 border-slate-700 text-white placeholder-slate-500' 
                            : '!bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                        }`}
                        placeholder="Nhập họ và tên"
                      />
                      {profileErrors.name && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{profileErrors.name.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        {...registerProfile('email')}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                          isDark 
                            ? '!bg-slate-800/90 border-slate-700 text-white placeholder-slate-500' 
                            : '!bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                        }`}
                        placeholder="Nhập email"
                      />
                      {profileErrors.email && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{profileErrors.email.message}</p>
                      )}
                    </div>

                    {/* Giới tính */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Giới tính
                      </label>
                      <select
                        {...registerProfile('gender')}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                          isDark 
                            ? '!bg-slate-800/90 border-slate-700 text-white' 
                            : '!bg-white border-slate-200 text-slate-900'
                        }`}
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                      </select>
                      {profileErrors.gender && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{profileErrors.gender.message}</p>
                      )}
                    </div>

                    {/* Ngày sinh */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Ngày sinh
                      </label>
                      <input
                        type="date"
                        {...registerProfile('dob')}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                          isDark 
                            ? '!bg-slate-800/90 border-slate-700 text-white' 
                            : '!bg-white border-slate-200 text-slate-900'
                        }`}
                      />
                      {profileErrors.dob && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{profileErrors.dob.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Địa chỉ */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Địa chỉ
                    </label>
                    <textarea
                      {...registerProfile('address')}
                      rows={3}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                        isDark 
                          ? '!bg-slate-800/90 border-slate-700 text-white placeholder-slate-500' 
                          : '!bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                      placeholder="Nhập địa chỉ của bạn"
                    />
                    {profileErrors.address && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{profileErrors.address.message}</p>
                    )}
                  </div>

                  {/* Avatar Upload */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Ảnh đại diện
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
                      <div className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                        ) : user?.avatar ? (
                          <img src={user.avatar} alt="Current avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs text-slate-400">Chưa có ảnh</span>
                        )}
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="block w-full text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-orange-50 dark:file:bg-orange-950/60 file:text-orange-700 dark:file:text-orange-300 hover:file:bg-orange-100 dark:hover:file:bg-orange-900/60 transition cursor-pointer"
                        />
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Định dạng PNG, JPG, JPEG tối đa 10MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="submit"
                      disabled={isSubmittingProfile || updateProfileMutation.isPending}
                      className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 hover:from-orange-600 hover:to-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {(isSubmittingProfile || updateProfileMutation.isPending) && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      )}
                      <span>{isSubmittingProfile || updateProfileMutation.isPending ? 'Đang lưu...' : 'Lưu thông tin cá nhân'}</span>
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'password' && (
                <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6 max-w-md">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Mật khẩu hiện tại *
                    </label>
                    <input
                      type="password"
                      {...registerPassword('currentPassword')}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                        isDark 
                          ? '!bg-slate-800/90 border-slate-700 text-white placeholder-slate-500' 
                          : '!bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                    {passwordErrors.currentPassword && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{passwordErrors.currentPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Mật khẩu mới *
                    </label>
                    <input
                      type="password"
                      {...registerPassword('newPassword')}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                        isDark 
                          ? '!bg-slate-800/90 border-slate-700 text-white placeholder-slate-500' 
                          : '!bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                      placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                    />
                    {passwordErrors.newPassword && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{passwordErrors.newPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Xác nhận mật khẩu mới *
                    </label>
                    <input
                      type="password"
                      {...registerPassword('confirmPassword')}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                        isDark 
                          ? '!bg-slate-800/90 border-slate-700 text-white placeholder-slate-500' 
                          : '!bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                      placeholder="Xác nhận lại mật khẩu mới"
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{passwordErrors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="submit"
                      disabled={isSubmittingPassword || changePasswordMutation.isPending}
                      className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 hover:from-orange-600 hover:to-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {(isSubmittingPassword || changePasswordMutation.isPending) && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      )}
                      <span>{isSubmittingPassword || changePasswordMutation.isPending ? 'Đang đổi mật khẩu...' : 'Cập nhật mật khẩu'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}