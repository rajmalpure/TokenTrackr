import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import AdminTreasury from './pages/AdminTreasury';
import TokenWallet from './pages/TokenWallet';

// Protected route wrapper
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <svg className="animate-spin w-10 h-10 text-purple-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/login"
        element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace /> : <Register />}
      />

      {/* Student: Dashboard & Vault */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole="student">
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wallet"
        element={
          <ProtectedRoute requiredRole="student">
            <TokenWallet />
          </ProtectedRoute>
        }
      />

      {/* Admin: Panel & Treasury */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/treasury"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminTreasury />
          </ProtectedRoute>
        }
      />

      {/* 404 catch-all */}
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
            <h1 className="text-6xl font-black text-purple-400">404</h1>
            <p className="text-slate-400 mt-2">Page not found</p>
            <Link to="/" className="mt-6 px-6 py-2 bg-purple-600 rounded-xl text-white hover:bg-purple-700 transition">
              Go Home
            </Link>
          </div>
        }
      />
    </Routes>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
