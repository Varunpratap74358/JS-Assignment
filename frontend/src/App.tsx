import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import ProfileView from './pages/ProfileView';
import ProjectsList from './pages/ProjectsList';
import SearchView from './pages/SearchView';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EditProfile from './pages/EditProfile';
import CompleteProfile from './pages/CompleteProfile';
import ManagePortfolio from './pages/ManagePortfolio';
import { AuthProvider, useAuth } from './context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {
        user && (
          <nav className="glass-card sticky top-6 z-50 px-8 py-5 mb-12 max-w-7xl mx-auto rounded-[2rem] border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-3xl font-black gradient-text tracking-tighter hover:scale-105 transition-transform">
          ME-API.
        </Link>
        <div className="flex items-center space-x-1">
          <Link to="/" className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive('/') ? 'bg-brand/10 text-brand' : 'text-gray-500 hover:text-gray-800'}`}>Profile</Link>
          <Link to="/projects" className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive('/projects') ? 'bg-brand/10 text-brand' : 'text-gray-500 hover:text-gray-800'}`}>Projects</Link>
          <Link to="/search" className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive('/search') ? 'bg-brand/10 text-brand' : 'text-gray-500 hover:text-gray-800'}`}>Search</Link>

          {user ? (
            <div className="flex items-center pl-4 ml-4 border-l border-gray-100 space-x-2">
              <Link to="/manage-portfolio" className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive('/manage-portfolio') ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-brand hover:bg-brand/5'}`}>Manage Hub</Link>
              <div className="h-4 w-[1px] bg-gray-100 mx-2"></div>
              <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-2xl">
                <span className="text-sm font-black text-gray-700">{user.name}</span>
                <button
                  onClick={logout}
                  className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4 pl-4 ml-4 border-l border-gray-100">
              <Link to="/login" className="text-sm font-bold text-gray-500 hover:text-gray-800">Login</Link>
              <Link to="/signup" className="px-6 py-2.5 btn-primary rounded-xl text-sm font-black shadow-xl shadow-brand/20">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
        )
      }
    </>
  );
};

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand"></div>
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  if (!user.isProfileComplete && window.location.pathname !== '/complete-profile') {
    return <Navigate to="/complete-profile" replace />;
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <Routes>
        <Route path="/" element={<AuthGuard><ProfileView /></AuthGuard>} />
        <Route path="/projects" element={<AuthGuard><ProjectsList /></AuthGuard>} />
        <Route path="/search" element={<AuthGuard><SearchView /></AuthGuard>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/complete-profile" element={
          <AuthGuard>
            <CompleteProfile />
          </AuthGuard>
        } />
        <Route path="/edit-profile" element={<AuthGuard><EditProfile /></AuthGuard>} />
        <Route path="/manage-portfolio" element={<AuthGuard><ManagePortfolio /></AuthGuard>} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
