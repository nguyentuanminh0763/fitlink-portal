import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AdminLayout from "~/layouts/AdminLayout";
import PageLoadingFallback from "~/components/PageLoadingFallback";

// Public / Auth Pages (Lazy Loaded)
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("~/pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("~/pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("~/pages/ResetPasswordPage"));
const UnauthorizedPage = lazy(() => import("~/pages/UnauthorizedPage"));
const VerifyEmail = lazy(() => import("~/pages/VerifyEmail"));
const HomePage = lazy(() => import("~/pages/student/HomePage"));
const AboutPage = lazy(() => import("~/pages/student/AboutPage"));
const NewsPage = lazy(() => import("~/pages/student/NewsPage"));
const ContactPage = lazy(() => import("~/pages/student/ContactPage"));
const SearchPTs = lazy(() => import("~/pages/student/SearchPTs"));
const PTDetail = lazy(() => import("~/pages/student/PTDetail"));
const PaymentResult = lazy(() => import("~/pages/payment/PaymentResult"));

// Shared Authenticated Pages (Lazy Loaded)
const UserProfile = lazy(() => import("~/pages/student/UserProfile"));
const NotificationsPage = lazy(() => import("~/pages/student/NotificationsPage"));

// Student Protected Pages (Lazy Loaded)
const TrainingCalendar = lazy(() => import("~/components/TrainingCalendar"));
const MyPackage = lazy(() => import("~/components/MyPackage"));
const MessagePage = lazy(() => import("~/pages/MessagePage"));
const ChatAIPage = lazy(() => import("~/pages/AIChatPage"));
const BookingWizard = lazy(() => import("~/pages/booking/BookingWizard"));

// PT Protected Pages (Lazy Loaded)
const PTDashboard = lazy(() => import("~/pages/pt/PTDashboard"));
const PTPackages = lazy(() => import("~/pages/pt/PTPackages"));
const PTCreatePackage = lazy(() => import("~/pages/pt/PTCreatePackage"));
const PTPackageDetail = lazy(() => import("~/pages/pt/PTPackageDetail"));
const PTPackageEdit = lazy(() => import("~/pages/pt/PTPackageEdit"));
const PTProfile = lazy(() => import("~/pages/pt/PTProfile"));
const PTMaterialsPage = lazy(() => import("~/pages/pt/PTMaterialsPage"));
const PTSchedule = lazy(() => import("~/pages/pt/PTSchedule"));
const PTStudents = lazy(() => import("~/pages/pt/PTStudent"));
const PTWallet = lazy(() => import("~/pages/pt/PTWalletPage"));
const PTFeedback = lazy(() => import("~/pages/pt/PTFeedbackPage"));
const PTMessagePage = lazy(() => import("~/pages/pt/PTMessagePage"));
const PTApprovalPage = lazy(() => import("~/pages/pt/PTApprovalPage"));

// Admin Protected Pages (Lazy Loaded)
const DashboardPage = lazy(() => import("~/pages/admin/dashboardAdmin/DashboardPage"));
const ManagerUser = lazy(() => import("../pages/admin/managerUser/ManagerUser"));
const UserDetail = lazy(() => import("../pages/admin/managerUser/UserDetail"));
const PTListAdmin = lazy(() => import("~/pages/admin/managerUser/PTList"));
const StudentListAdmin = lazy(() => import("~/pages/admin/managerUser/StudentList"));
const AdminPayouts = lazy(() => import("~/pages/admin/AdminPayouts"));
const PTRequestList = lazy(() => import("~/pages/admin/PTRequestList"));
const PTRequestDetail = lazy(() => import("~/pages/admin/PTRequestDetail"));
const Transactions = lazy(() => import("~/pages/admin/Transactions"));

export default function AppRouter() {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <Routes>
      {/* Public / Auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/list-pt" element={<SearchPTs />} />
      <Route path="/trainer/:id" element={<PTDetail />} />
      <Route path="/pt/:id" element={<PTDetail />} />
      <Route path="/payment/result" element={<PaymentResult />} />

      {/* Shared Authenticated routes */}
      <Route
        path="/profile"
        element={
          <PrivateRoute allowedRoles={["student", "pt"]}>
            <UserProfile />
          </PrivateRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <PrivateRoute allowedRoles={["student", "pt"]}>
            <NotificationsPage />
          </PrivateRoute>
        }
      />

      {/* Student Protected routes */}
      <Route
        path="/training-calendar"
        element={
          <PrivateRoute allowedRoles={["student"]}>
            <TrainingCalendar />
          </PrivateRoute>
        }
      />
      <Route
        path="/my-packages"
        element={
          <PrivateRoute allowedRoles={["student"]}>
            <MyPackage />
          </PrivateRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <PrivateRoute allowedRoles={["student"]}>
            <MessagePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/chat/:ptId"
        element={
          <PrivateRoute allowedRoles={["student"]}>
            <MessagePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/chat-ai"
        element={
          <PrivateRoute allowedRoles={["student"]}>
            <ChatAIPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/booking/:id"
        element={
          <PrivateRoute allowedRoles={["student"]}>
            <BookingWizard />
          </PrivateRoute>
        }
      />

      {/* PT Protected routes */}
      <Route path="/pt" element={<Navigate to="/pt/dashboard" replace />} />
      <Route
        path="/pt/dashboard"
        element={
          <PrivateRoute allowedRoles={["pt"]}>
            <PTDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/pt/packages"
        element={
          <PrivateRoute allowedRoles={["pt"]}>
            <PTPackages />
          </PrivateRoute>
        }
      />
      <Route
        path="/pt/packages/new"
        element={
          <PrivateRoute allowedRoles={["pt"]}>
            <PTCreatePackage />
          </PrivateRoute>
        }
      />
      <Route
        path="/pt/packages/:packageId"
        element={
          <PrivateRoute allowedRoles={["pt"]}>
            <PTPackageDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/pt/packages/:packageId/edit"
        element={
          <PrivateRoute allowedRoles={["pt"]}>
            <PTPackageEdit />
          </PrivateRoute>
        }
      />
      <Route
        path="/pt/profile"
        element={
          <PrivateRoute allowedRoles={["pt"]}>
            <PTProfile />
          </PrivateRoute>
        }
      />
      <Route
        path="/pt/materials"
        element={
          <PrivateRoute allowedRoles={["pt"]}>
            <PTMaterialsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/pt/schedule"
        element={
          <PrivateRoute allowedRoles={["pt"]}>
            <PTSchedule />
          </PrivateRoute>
        }
      />
      <Route
        path="/pt/students"
        element={
          <PrivateRoute allowedRoles={["pt"]}>
            <PTStudents />
          </PrivateRoute>
        }
      />
      <Route
        path="/pt/wallet"
        element={
          <PrivateRoute allowedRoles={["pt"]}>
            <PTWallet />
          </PrivateRoute>
        }
      />
      <Route
        path="/pt/feedback"
        element={
          <PrivateRoute allowedRoles={["pt"]}>
            <PTFeedback />
          </PrivateRoute>
        }
      />
      <Route
        path="/pt/chat"
        element={
          <PrivateRoute allowedRoles={["pt"]}>
            <PTMessagePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/pt/approval-request"
        element={
          <PrivateRoute allowedRoles={["pt"]}>
            <PTApprovalPage />
          </PrivateRoute>
        }
      />

      {/* Admin Protected routes */}
      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <ManagerUser />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/users/:id"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <UserDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/users/pts"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminLayout>
              <PTListAdmin />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/users/students"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminLayout>
              <StudentListAdmin />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/payouts"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminPayouts />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/pt-requests"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <PTRequestList />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/pt-requests/:id"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <PTRequestDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin-transactions"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminLayout>
              <Transactions />
            </AdminLayout>
          </PrivateRoute>
        }
      />

      {/* Default & Catch-all Fallback */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
    </Suspense>
  );
}
