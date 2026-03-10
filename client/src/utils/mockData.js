export const mockUsers = [
    { id: 1, name: 'Admin User', username: 'admin', email: 'admin@system.com', role: 'admin', department: 'IT', registrationStatus: 'approved', isActive: true, joiningDate: '2025-01-01' },
    { id: 2, name: 'John Manager', username: 'manager', email: 'manager@system.com', role: 'manager', department: 'Engineering', registrationStatus: 'approved', isActive: true, joiningDate: '2025-02-15' },
    { id: 3, name: 'Alice Employee', username: 'employee', email: 'alice@system.com', role: 'employee', department: 'Engineering', registrationStatus: 'approved', isActive: true, joiningDate: '2025-03-10' },
    { id: 4, name: 'Bob HR', username: 'hr', email: 'bob@system.com', role: 'hr', department: 'Human Resources', registrationStatus: 'approved', isActive: true, joiningDate: '2025-01-20' },
    { id: 5, name: 'Charlie Accountant', username: 'accountant', email: 'charlie@system.com', role: 'accountant', department: 'Finance', registrationStatus: 'approved', isActive: true, joiningDate: '2025-02-05' },
    { id: 6, name: 'David New', username: 'dnew', email: 'david@system.com', role: 'employee', department: 'Marketing', registrationStatus: 'pending', isActive: false, joiningDate: '2026-03-05' },
    { id: 7, name: 'Eve Pending', username: 'epending', email: 'eve@system.com', role: 'manager', department: 'Sales', registrationStatus: 'pending', isActive: false, joiningDate: '2026-03-06' },
];

export const mockTasks = [
    { id: 1, title: 'Fix Login Bug', description: 'Resolve the JWT expiration issue on mobile.', assignedTo: 'alice', assignedBy: 'manager', department: 'Engineering', priority: 'high', status: 'in_progress', deadline: '2026-03-15' },
    { id: 2, title: 'Update HR Policy', description: 'Review and update the remote work policy.', assignedTo: 'bob', assignedBy: 'manager', department: 'Human Resources', priority: 'medium', status: 'not_started', deadline: '2026-03-20' },
];

export const mockLeaveRequests = [
    {
        id: 1,
        employeeId: 'alice',
        employeeName: 'Alice Employee',
        leaveType: 'sick',
        fromDate: '2026-03-10',
        toDate: '2026-03-12',
        reason: 'Flu symptoms',
        managerApproval: { status: 'approved', approvedBy: 'manager', comment: 'Get well soon', actionDate: '2026-03-08' },
        hrApproval: { status: 'pending', approvedBy: null, comment: '', actionDate: null },
        finalStatus: 'pending',
    },
];

export const mockPayroll = [
    { id: 1, employeeId: 'alice', month: 'February-2026', basicSalary: 5000, deductions: 200, netSalary: 4800, generatedBy: 'accountant' },
];

export const mockAuditLogs = [
    { id: 1, userId: 'admin', action: 'APPROVED_REGISTRATION', resource: 'user', resourceId: '6', description: 'Approved David New registration', Ip: '192.168.1.1', createdAt: '2026-03-05T14:30:00Z' },
];
