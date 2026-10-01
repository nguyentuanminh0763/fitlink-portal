import axios from '../api/axiosClient';
import { queryClient } from '~/lib/queryClient';

export const loginWithGoogle = async (idToken) => {
  try {
    // cookie được set bởi backend, frontend không cần lưu token
    const res = await axios.post('/auth/google', { idToken });
    // Xoá cache TanStack của tài khoản trước, tránh hiện/gửi nhầm dữ liệu người khác
    queryClient.clear();
    return res.data; // chỉ cần user
  } catch (error) {
    console.error('Google login failed:', error);
    throw error;
  }
};

export const login = async (phone, password) => {
    try {
        const res = await axios.post('/auth/login', { phone, password });
        // setToken(res.data.accessToken);
        queryClient.clear();
        return res.data;
    } catch (error) {
        console.error('Login failed:', error); // xử lý lỗi cụ thể
        throw error;
    }

};

export const registerByPhone = async (name, phone, password, email) => {
    try {
        const res = await axios.post('/auth/register', { phone, password, name, email });
        // setToken(res.data.accessToken);
        return res.data;
    } catch (error) {
        console.error('Register failed:', error); // xử lý lỗi cụ thể
        throw error;
    }
}

export const logout = async () => {
    try {
        await axios.post('/auth/logout')
        queryClient.clear();
    } catch (error) {
        console.error('Logout failed:', error); // xử lý lỗi cụ thể
        throw error;
    }
}

export const sendForgotPasswordRequest = async ({ phone }) => {
  return await axios.post('/auth/forgot-password', { phone });
};

export const resetPassword = async (token, newPassword, confirmPassword) => {
  const res = await axios.post(`/auth/reset-password/${token}`, { password: newPassword, confirmPassword });
  return res.data;
};

export const registerStart = async ({ name, phone, password, email, role }) => {  
  const res = await axios.post('/auth/register/start', { name, phone, password, email, role });
  return res.data;
};


