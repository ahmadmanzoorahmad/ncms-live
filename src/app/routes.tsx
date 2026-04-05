// React Router Configuration

import { createBrowserRouter } from 'react-router';
import Root from './pages/Root';
import Login from './pages/Login';
import DashboardRouter from './pages/DashboardRouter';
import ClientDashboard from './pages/ClientDashboard';
import AgentDashboard from './pages/AgentDashboard';
import SupervisorDashboard from './pages/SupervisorDashboard';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import AuditDashboard from './pages/AuditDashboard';
import CallCenterDashboard from './pages/CallCenterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TicketDetails from './pages/TicketDetails';
import CreateTicket from './pages/CreateTicket';
import TicketsPage from './pages/TicketsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import MobileClient from './pages/MobileClient';
import MobileAgent from './pages/MobileAgent';
import MobileManagement from './pages/MobileManagement';
import NotFound from './pages/NotFound';
import { AppProvider } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';

// Layout wrapper to provide context to all routes
function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </AppProvider>
  );
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <RootLayout>
        <Login />
      </RootLayout>
    ),
  },
  {
    path: '/',
    element: (
      <RootLayout>
        <Root />
      </RootLayout>
    ),
    children: [
      { index: true, Component: DashboardRouter }, // Dynamic dashboard based on role
      { path: 'citizen', Component: ClientDashboard },
      { path: 'call-center', Component: CallCenterDashboard },
      { path: 'agent', Component: AgentDashboard },
      { path: 'field-engineer', Component: AgentDashboard }, // Field engineers use agent dashboard
      { path: 'supervisor', Component: SupervisorDashboard },
      { path: 'department-head', Component: SupervisorDashboard }, // Dept heads use supervisor dashboard
      { path: 'executive', Component: ExecutiveDashboard },
      { path: 'audit', Component: AuditDashboard },
      { path: 'admin', Component: AdminDashboard },
      { path: 'ticket/:id', Component: TicketDetails },
      { path: 'tickets', Component: TicketsPage }, // Dedicated tickets page
      { path: 'analytics', Component: AnalyticsPage }, // Dedicated analytics page
      { path: 'create-ticket', Component: CreateTicket },
      { path: 'mobile-citizen', Component: MobileClient },
      { path: 'mobile-agent', Component: MobileAgent },
      { path: 'mobile-management', Component: MobileManagement },
      { path: '*', Component: NotFound },
    ],
  },
]);