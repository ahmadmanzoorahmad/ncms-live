// Dashboard Router - Shows correct dashboard based on user role

import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import ClientDashboard from './ClientDashboard';
import AgentDashboard from './AgentDashboard';
import SupervisorDashboard from './SupervisorDashboard';
import ExecutiveDashboard from './ExecutiveDashboard';
import AuditDashboard from './AuditDashboard';
import CallCenterDashboard from './CallCenterDashboard';
import AdminDashboard from './AdminDashboard';

export default function DashboardRouter() {
  const { currentUser, isAuthenticated } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  // Route to correct dashboard based on user role
  switch (currentUser.role) {
    case 'Citizen':
      return <ClientDashboard />;
    
    case 'Call Center Officer':
      return <CallCenterDashboard />;
    
    case 'Support Agent':
      return <AgentDashboard />;
    
    case 'Field Engineer':
      return <AgentDashboard />;
    
    case 'Supervisor':
      return <SupervisorDashboard />;
    
    case 'Department Head':
      return <SupervisorDashboard />;
    
    case 'Executive':
      return <ExecutiveDashboard />;
    
    case 'Auditor':
      return <AuditDashboard />;
    
    case 'System Admin':
      return <AdminDashboard />;
    
    default:
      return <ClientDashboard />;
  }
}
