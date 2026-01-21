import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ContentProvider } from './context/ContentContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Admin/LoginPage';
import DashboardPage from './pages/Admin/DashboardPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // Or a spinner
  if (!isAuthenticated) return <Navigate to="/admin" replace />;

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ContentProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/admin" element={<LoginPage />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </ContentProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
