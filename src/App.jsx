import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from './pages/login';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/dashboard';
import { ThemeProvider } from './constant/ThemeContext';

// Redirects to /dashboard if already logged in
function RedirectIfAuthenticated({ children }) {
  const token = localStorage.getItem("jwt_token");
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

// Protects routes that require authentication
function AuthGuard() {
  const token = localStorage.getItem("jwt_token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

function App() {
  return (
    <>
      <Router>
        <ThemeProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route
              path="/login"
              element={
                <RedirectIfAuthenticated>
                  <LoginPage />
                </RedirectIfAuthenticated>
              }
            />
            {/* Protected routes */}
            <Route element={<AuthGuard />}>
              <Route
                path="/dashboard"
                element={
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                }
              />
              {/* Add more protected routes here */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;