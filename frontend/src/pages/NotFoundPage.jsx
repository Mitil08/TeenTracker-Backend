import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <h1>404</h1>
        <p className="muted">This page doesn’t exist.</p>
        <Link to="/" className="btn btn-primary">Back home</Link>
      </div>
    </div>
  );
}
