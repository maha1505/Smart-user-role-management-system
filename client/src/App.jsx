import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import SharedLayout from './layouts/SharedLayout';

import ManagerTeam from './pages/manager/Team';
import ManagerTasks from './pages/manager/Tasks';
import ManagerDashboard from './pages/manager/Dashboard';
import ManagerLeaveApprovals from './pages/manager/LeaveApprovals';
import ManagerReports from './pages/manager/Reports';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import PendingApprovals from './pages/admin/PendingApprovals';
import Departments from './pages/admin/Departments';
import AllTasks from './pages/admin/AllTasks';
import LeaveRequests from './pages/admin/LeaveRequests';
import Payroll from './pages/admin/Payroll';
import AuditLogs from './pages/admin/AuditLogs';
import MyDashboard from './pages/employee/Dashboard';
import TaskList from './pages/employee/Tasks';
import LeaveHistory from './pages/employee/Leaves';
import MyPayroll from './pages/employee/Payroll';
import LeaveApprovals from './pages/shared/LeaveApprovals';
import EmployeeRecords from './pages/hr/Employees';
import HRDashboard from './pages/hr/Dashboard';
import HRLeaveApprovals from './pages/hr/Leaves';
import PayrollManagement from './pages/accountant/Payroll';
import AccountantDashboard from './pages/accountant/Dashboard';
import GeneratePayslip from './pages/accountant/GeneratePayslip';
import AccountantReports from './pages/accountant/Reports';

// Placeholder for missing components
const ComingSoon = ({ title }) => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h5" sx={{ fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>{title} Coming Soon</Typography>
    <Typography color="text.secondary" sx={{ mt: 1 }}>This module is currently being optimized for the new experience.</Typography>
  </Box>
);

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
      <Route path="/unauthorized" element={<Box sx={{ p: 4 }}>Unauthorized Access</Box>} />

      {/* Protected Dashboard Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <SharedLayout>
              <Routes>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="pending" element={<PendingApprovals />} />
                <Route path="departments" element={<Departments />} />
                <Route path="tasks" element={<AllTasks />} />
                <Route path="leaves" element={<LeaveRequests />} />
                <Route path="payroll" element={<Payroll />} />
                <Route path="logs" element={<AuditLogs />} />
                <Route path="my-leaves" element={<LeaveHistory />} />
              </Routes>
            </SharedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/*"
        element={
          <ProtectedRoute allowedRoles={['manager']}>
            <SharedLayout>
              <Routes>
                <Route index element={<ManagerDashboard />} />
                <Route path="team" element={<ManagerTeam />} />
                <Route path="tasks" element={<ManagerTasks />} />
                <Route path="leaves" element={<ManagerLeaveApprovals />} />
                <Route path="reports" element={<ManagerReports />} />
                {/* Self Service */}
                <Route path="my-leaves" element={<LeaveHistory />} />
                <Route path="my-payroll" element={<MyPayroll />} />
              </Routes>
            </SharedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/*"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <SharedLayout>
              <Routes>
                <Route index element={<MyDashboard />} />
                <Route path="tasks" element={<TaskList />} />
                <Route path="leaves" element={<LeaveHistory />} />
                <Route path="payroll" element={<MyPayroll />} />
              </Routes>
            </SharedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/*"
        element={
          <ProtectedRoute allowedRoles={['hr']}>
            <SharedLayout>
              <Routes>
                <Route index element={<HRDashboard />} />
                <Route path="employees" element={<EmployeeRecords />} />
                <Route path="leaves" element={<HRLeaveApprovals />} />
                {/* Self Service */}
                <Route path="my-leaves" element={<LeaveHistory />} />
                <Route path="my-payroll" element={<MyPayroll />} />
              </Routes>
            </SharedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/accountant/*"
        element={
          <ProtectedRoute allowedRoles={['accountant']}>
            <SharedLayout>
              <Routes>
                <Route index element={<AccountantDashboard />} />
                <Route path="payroll" element={<PayrollManagement />} />
                <Route path="generate" element={<GeneratePayslip />} />
                <Route path="reports" element={<AccountantReports />} />
                {/* Self Service */}
                <Route path="my-leaves" element={<LeaveHistory />} />
              </Routes>
            </SharedLayout>
          </ProtectedRoute>
        }
      />

      {/* Root Redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Box sx={{ p: 4 }}>404 - Not Found</Box>} />
    </Routes>
  );
};

export default App;
