import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="page">
      <div className="header-row">
        <div>
          <h1 style={{ margin: 0 }}>Settings</h1>
          <p className="muted" style={{ margin: '8px 0 0' }}>Customize your experience.</p>
        </div>
      </div>
      <div className="card">
        <h3>Profile</h3>
        <p><strong>Name:</strong> {user?.name || 'Guest'}</p>
        <p><strong>Email:</strong> {user?.email || 'Not available'}</p>
      </div>
    </div>
  );
}
