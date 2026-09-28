import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: '🏠 Dashboard' },
  { to: '/expenses', label: '💸 Expenses' },
  { to: '/analytics', label: '📊 Analytics' },
  { to: '/budgets', label: '🎯 Budgets' },
  { to: '/savings', label: '🏆 Savings Goals' },
  { to: '/settings', label: '⚙️ Settings' },
];

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">💰 TeenTrack</div>
        <div className="muted">Hi, {user?.name || 'User'}</div>
        <nav className="nav-list">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span>{item.label}</span>
            </NavLink>
          ))}
          <button className="nav-link" onClick={handleLogout} style={{ background: 'transparent', border: 'none', textAlign: 'left', width: '100%' }}>
            🚪 Logout
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
