import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur border-b border-pine/10">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl font-semibold text-pine tracking-tight">
          Trailmark
        </Link>

        <div className="flex items-center gap-6 font-medium text-sm">
          {user && !isAdmin && (
            <>
              <Link to="/" className="hover:text-terracotta transition-colors">Activities</Link>
              <Link to="/my-bookings" className="hover:text-terracotta transition-colors">My Bookings</Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link to="/admin" className="hover:text-terracotta transition-colors">Activities</Link>
              <Link to="/admin/bookings" className="hover:text-terracotta transition-colors">Requests</Link>
            </>
          )}

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-stone hidden sm:inline">Hi, {user.username}</span>
              <button onClick={handleLogout} className="btn-secondary !py-1.5 !px-4 text-sm">
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="hover:text-terracotta transition-colors">Log in</Link>
              <Link to="/register" className="btn-primary !py-1.5 !px-4 text-sm">Sign up</Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
