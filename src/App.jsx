import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import ErrorBoundary from './errors/ErrorBoundary';
import { AuthContext } from './contexts/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';
import ScrollToTop from './components/ScrollToTop';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function App() {
  const { loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <ScrollToTop />
      {/* Bọc ngoài router để bắt cả lỗi lazy import của từng trang; resetKey xoá lỗi khi đổi trang */}
      <ErrorBoundary resetKey={location.pathname}>
        <AppRouter />
      </ErrorBoundary>
      <ToastContainer
        position="top-left"
        autoClose={3000}
        limit={3}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
