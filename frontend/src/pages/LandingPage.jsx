import { Link } from 'react-router-dom';

const features = [
  { icon: '💸', title: 'Track Expenses', text: 'Log each spend and learn where your money goes.' },
  { icon: '📊', title: 'Understand Spending', text: 'See your habits through simple charts and summaries.' },
  { icon: '🎯', title: 'Set Budgets', text: 'Stay in control with weekly and monthly limits.' },
  { icon: '🏆', title: 'Build Savings', text: 'Work towards goals like gadgets, trips, and fun purchases.' },
];

export default function LandingPage() {
  return (
    <div className="hero">
      <div className="container hero-inner">
        <nav className="navbar">
          <div className="logo">💰 TeenTrack</div>
          <div className="hero-cta">
            <Link to="/login" className="btn btn-secondary">Login</Link>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
          </div>
        </nav>

        <div className="hero-main">
          <div>
            <p className="muted" style={{ letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>Student money, simplified</p>
            <h1 className="hero-title">Take Control of Your Money 💰</h1>
            <p className="hero-copy">
              Track your expenses, understand your spending, and build better habits with a simple dashboard made for teenagers.
            </p>
            <div className="hero-cta" style={{ marginTop: '24px' }}>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
              <Link to="/login" className="btn btn-secondary">Already have an account?</Link>
            </div>
          </div>

          <div className="hero-panel">
            <div className="summary-card" style={{ marginBottom: '18px' }}>
              <div className="summary-label">Monthly Budget</div>
              <div className="summary-value">₹3,500</div>
            </div>
            <div className="grid grid-2">
              <div className="summary-card">
                <div className="summary-label">Spent</div>
                <div className="summary-value" style={{ fontSize: '1.4rem' }}>₹2,240</div>
              </div>
              <div className="summary-card">
                <div className="summary-label">Saved</div>
                <div className="summary-value" style={{ fontSize: '1.4rem' }}>₹1,260</div>
              </div>
            </div>
          </div>
        </div>

        <section className="section">
          <div className="feature-grid">
            {features.map((feature) => (
              <div key={feature.title} className="feature-card">
                <div style={{ fontSize: '2rem' }}>{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p className="muted">{feature.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
