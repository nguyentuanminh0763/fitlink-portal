import React, { useContext } from 'react';
import AppRouter from './routes/AppRouter';
import { AuthContext } from './contexts/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';
import ScrollToTop from './components/ScrollToTop';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function App() {
  const { loading } = useContext(AuthContext);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <ScrollToTop />
      <AppRouter />
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
