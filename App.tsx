
import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import ReviewList from './pages/ReviewList';
import CreateProject from './pages/CreateProject';
import ProjectDetail from './pages/ProjectDetail';
import AuditDetail from './pages/AuditDetail';
import AuditLoading from './pages/AuditLoading';
import VideoImport from './pages/VideoImport';
import AutoTasks from './pages/AutoTasks';
import KeyframeAnalysis from './pages/KeyframeAnalysis';
import VideoAnalysis from './pages/VideoAnalysis';
import FinalReviewConfirmation from './pages/FinalReviewConfirmation';
import Dashboard from './pages/Dashboard';
import ReportDetail from './pages/ReportDetail';
import AuditHistory from './pages/AuditHistory';
import NotificationManagement from './pages/NotificationManagement';
import SettingsCenter from './pages/SettingsCenter';
import { MasterLayout } from './master_page/MasterLayout';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isImmersivePage = 
    location.pathname.startsWith('/analysis/') || 
    location.pathname.startsWith('/audit/') ||
    location.pathname.startsWith('/final-confirm/') ||
    location.pathname.startsWith('/audit-loading') ||
    location.pathname.startsWith('/report/');

  const content = (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/list" element={<ReviewList />} />
      <Route path="/project/:id" element={<ProjectDetail />} />
      <Route path="/create" element={<CreateProject />} />
      <Route path="/import" element={<VideoImport />} />
      <Route path="/auto-tasks" element={<AutoTasks />} />
      <Route path="/keyframes/:id" element={<KeyframeAnalysis />} />
      <Route path="/analysis/:id" element={<VideoAnalysis />} />
      <Route path="/final-confirm/:id" element={<FinalReviewConfirmation />} />
      <Route path="/audit/:id" element={<AuditDetail />} />
      <Route path="/audit/history" element={<AuditHistory />} />
      <Route path="/audit-loading" element={<AuditLoading />} />
      <Route path="/report/:id" element={<ReportDetail />} />
      <Route path="/notifications" element={<NotificationManagement />} />
      <Route path="/settings" element={<SettingsCenter />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );

  if (isLoginPage || isImmersivePage) {
    return content;
  }

  return (
    <MasterLayout>
      {content}
    </MasterLayout>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
