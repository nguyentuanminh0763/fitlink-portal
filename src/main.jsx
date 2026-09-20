// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Environment } from "./config/environment.js";
import { SocketProvider } from "./contexts/SocketContext.jsx";
import { NotificationProvider } from "./contexts/NotificationContext.jsx";
import "./index.css";
import { BookingProvider } from "~/contexts/BookingContext";
import { ThemeProvider } from "~/contexts/ThemeContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "~/lib/queryClient";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={Environment.GG_CLIENT_ID}>
        <BrowserRouter>
          <ThemeProvider>
            <AuthProvider>
              <SocketProvider>
                <NotificationProvider>
                  <BookingProvider>
                    <App />
                  </BookingProvider>
                </NotificationProvider>
              </SocketProvider>
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
