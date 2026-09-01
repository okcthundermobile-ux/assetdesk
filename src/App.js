import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RoleProvider } from './context/RoleContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './components/LoginPage/LoginPage';
import AppShell from './components/AppShell';
import HomePanel from './components/HomePanel/HomePanel';
import CalendarPanel from './components/CalendarPanel/CalendarPanel';
import HeatmapPanel from './components/HeatmapPanel/HeatmapPanel';
import KPIPanel from './components/KPIPanel/KPIPanel';
import DeploymentsPanel from './components/DeploymentsPanel/DeploymentsPanel';
import './index.css';

/**
 * The main App component, takes care of routing and context providers.
 * Pages live under the AppShell: sidebar navigation + topbar.
 * @returns - the render
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RoleProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* Protected app — redirects to /login if not authenticated */}
            <Route
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<HomePanel />} />
              <Route path="/schedule" element={<CalendarPanel />} />
              <Route path="/arena" element={<HeatmapPanel />} />
              <Route path="/reports" element={<KPIPanel />} />
              <Route path="/deployments" element={<DeploymentsPanel />} />
            </Route>

            {/* redirect unknown paths to the app root */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </RoleProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
