import { Outlet, Link, useNavigate } from 'react-router-dom';
import { User, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Shield, History, LogOut, LogIn, UserPlus, Search } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  user: User | null;
}

export default function Layout({ user }: LayoutProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <Shield className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                TruthLens
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {user && (
                <>
                  <Link to="/analyze" className="text-slate-600 hover:text-blue-600 font-medium flex items-center space-x-1">
                    <Search className="w-4 h-4" />
                    <span>Analyze</span>
                  </Link>
                  <Link to="/history" className="text-slate-600 hover:text-blue-600 font-medium flex items-center space-x-1">
                    <History className="w-4 h-4" />
                    <span>History</span>
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-slate-500 hidden sm:inline">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-slate-600 hover:text-blue-600 font-medium flex items-center space-x-1"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-1"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} TruthLens – Fake News Detector. Powered by AI.</p>
        </div>
      </footer>
    </div>
  );
}
