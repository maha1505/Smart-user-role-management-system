import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SharedLayout from './layouts/SharedLayout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
// import Unauthorized from './pages/Unauthorized';
// import AdminDashboard from './pages/admin/Dashboard';
// import ManagerDashboard from './pages/manager/Dashboard';
// import EmployeeDashboard from './pages/employee/Dashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />

      {/* Protected Dashboard Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <SharedLayout><div>Admin Dashboard Content</div></SharedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/*"
        element={
          <ProtectedRoute allowedRoles={['manager']}>
            <SharedLayout><div>Manager Dashboard Content</div></SharedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/*"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <SharedLayout><div>Employee Dashboard Content</div></SharedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/*"
        element={
          <ProtectedRoute allowedRoles={['hr']}>
            <SharedLayout><div>HR Dashboard Content</div></SharedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/accountant/*"
        element={
          <ProtectedRoute allowedRoles={['accountant']}>
            <SharedLayout><div>Accountant Dashboard Content</div></SharedLayout>
          </ProtectedRoute>
        }
      />

      {/* Root Redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<div>404 - Not Found</div>} />
    </Routes>
  );
};

export default App;
