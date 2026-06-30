import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import logoImg from '../assets/image.png';

export default function NavBar() {
  const { user } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState(true);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?search=${encodeURIComponent(search.trim())}`);
      setCollapsed(true);
    }
  };

  const renderAcciones = (mobile?: boolean) => (
    <div className={`d-flex align-items-center gap-2 ${mobile ? 'flex-column w-100 mt-2' : ''}`}>
      <button onClick={toggleTheme} className="btn btn-sm rounded-circle p-1 border-0" style={{ fontSize: '18px', color: 'var(--reddit-muted)' }}>
        {darkMode ? '☀️' : '🌙'}
      </button>
      {user ? (
        <div className={`d-flex align-items-center gap-2 ${mobile ? 'w-100 justify-content-center' : ''}`}>
          <Link to="/create-post" className="btn btn-sm reddit-btn-orange">
            + Crear Post
          </Link>
          <Link to="/manage-tags" className="btn btn-sm border-0 px-2" style={{ color: 'var(--reddit-muted)', fontSize: '13px' }}>
            🏷️ Tags
          </Link>
          <Link to="/profile" className="btn btn-sm reddit-btn-secondary px-3" style={{ fontSize: '13px' }}>
            u/{user.nickName}
          </Link>
        </div>
      ) : (
        <div className={`d-flex align-items-center gap-2 ${mobile ? 'w-100 justify-content-center' : ''}`}>
          <Link to="/login" className="btn btn-sm reddit-btn-secondary px-3">Log In</Link>
          <Link to="/register" className="btn btn-sm reddit-btn-orange px-3">Sign Up</Link>
        </div>
      )}
    </div>
  );

  return (
    <nav className="navbar navbar-expand-lg sticky-top px-3" style={{ backgroundColor: 'var(--reddit-card-bg)', borderBottom: '1px solid var(--reddit-border)' }}>
      <div className="container-fluid gap-2">

        <Link to="/" className="navbar-brand fw-bold d-flex align-items-center gap-2 m-0 p-0" style={{ color: 'var(--reddit-text)' }}>
          <img src={logoImg} alt="BuzzU Logo" style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '50%' }} />
          <span className="fs-5 fw-bold d-none d-sm-inline" style={{ letterSpacing: '-0.5px' }}>buzz<span style={{ color: 'var(--reddit-orange)' }}>u</span></span>
        </Link>

        <form className="reddit-search-form d-flex align-items-center" onSubmit={handleSearch}>
          <span className="reddit-search-icon">🔍</span>
          <input type="text" className="reddit-search-input" placeholder="Buscar en BuzzU..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </form>

        <button className="navbar-toggler border-0 p-1" type="button" onClick={() => setCollapsed(!collapsed)} style={{ color: 'var(--reddit-text)' }}>
          <span style={{ fontSize: '24px', lineHeight: 1 }}>{collapsed ? '☰' : '✕'}</span>
        </button>

        <div className="d-none d-lg-flex align-items-center">
          {renderAcciones()}
        </div>
      </div>

      {!collapsed && (
        <div className="d-lg-none w-100 px-2 pb-2" style={{ borderTop: '1px solid var(--reddit-border)' }}>
          {renderAcciones(true)}
        </div>
      )}
    </nav>
  );
}