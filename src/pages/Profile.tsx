import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../api/api';
import type { Post, User } from '../types';

export default function Profile() {
  const { user: userContext, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<User | null>(null);
  const [misPosts, setMisPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userContext) return;

    Promise.all([
      apiService.getUserByNickName(userContext.nickName),
      apiService.getPosts(userContext._id),
    ])
      .then(([userData, posts]) => {
        setProfile(userData);
        setMisPosts(posts);
      })
      .catch((err) => {
        console.error(err);
        setError('No se pudieron cargar tus datos.');
      })
      .finally(() => setLoading(false));
  }, [userContext]);

  const handleCerrarSesion = () => {
    logout();
    navigate('/login');
  };

  if (error && !profile) {
    return (
      <div className="container my-5" style={{ maxWidth: '850px' }}>
        <div className="alert alert-danger text-center">
          <h4 className="alert-heading">Error</h4>
          <p className="mb-0">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="container my-5" style={{ maxWidth: '850px' }}>
      <div className="reddit-card p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <div className="small text-uppercase fw-bold" style={{ color: 'var(--reddit-muted)', letterSpacing: '0.05em' }}>Perfil del usuario</div>
            <h2 className="fw-bold m-0" style={{ color: 'var(--reddit-orange)' }}>u/{profile.nickName}</h2>
            <span className="badge mt-1" style={{ backgroundColor: 'var(--reddit-card-hover)', color: 'var(--reddit-muted)', border: '1px solid var(--reddit-border)' }}>ID: {profile._id}</span>
          </div>
          <button onClick={handleCerrarSesion} className="btn btn-outline-danger fw-semibold btn-sm px-4">
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="reddit-card p-3 h-100">
            <h6 className="fw-bold mb-2" style={{ color: 'var(--reddit-orange)' }}>Siguiendo ({profile.following.length})</h6>
            {profile.following.length === 0 ? (
              <p className="small mb-0" style={{ color: 'var(--reddit-muted)' }}>No seguís a nadie todavía.</p>
            ) : (
              <div className="d-flex flex-wrap gap-1">
                {profile.following.map((u) => {
                  const nick = typeof u === 'string' ? u : u.nickName;
                  const id = typeof u === 'string' ? u : u._id;
                  return <span key={id} className="badge" style={{ backgroundColor: 'var(--reddit-card-hover)', color: 'var(--reddit-text)', border: '1px solid var(--reddit-border)' }}>{nick}</span>;
                })}
              </div>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="reddit-card p-3 h-100">
            <h6 className="fw-bold mb-2" style={{ color: 'var(--reddit-orange)' }}>Seguidores ({profile.followers.length})</h6>
            {profile.followers.length === 0 ? (
              <p className="small mb-0" style={{ color: 'var(--reddit-muted)' }}>No tenés seguidores todavía.</p>
            ) : (
              <div className="d-flex flex-wrap gap-1">
                {profile.followers.map((u) => {
                  const nick = typeof u === 'string' ? u : u.nickName;
                  const id = typeof u === 'string' ? u : u._id;
                  return <span key={id} className="badge" style={{ backgroundColor: 'var(--reddit-card-hover)', color: 'var(--reddit-text)', border: '1px solid var(--reddit-border)' }}>{nick}</span>;
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <h4 className="fw-bold mb-3" style={{ color: 'var(--reddit-text)' }}>Mis publicaciones realizadas</h4>

      {loading ? (
        <div className="text-center my-4">
          <div className="spinner-border" style={{ color: 'var(--reddit-orange)' }} role="status" />
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : misPosts.length === 0 ? (
        <div className="reddit-card p-5 text-center" style={{ color: 'var(--reddit-muted)' }}>
          <h5>Aún no publicaste nada</h5>
          <p className="small mb-3">¡Compartí tu primer posteo con el resto de la universidad!</p>
          <div>
            <Link to="/create-post" className="btn btn-primary btn-sm px-3 fw-semibold">
              + Crear Nueva Publicación
            </Link>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {misPosts.map((post) => {
            const commentCount = post.comments?.length || 0;
            return (
              <div key={post._id} className="reddit-card p-3">
                <div className="p-0">
                  <p className="mb-2 fs-5" style={{ color: 'var(--reddit-text)', whiteSpace: 'pre-wrap' }}>
                    {post.description}
                  </p>

                  <div className="d-flex justify-content-between align-items-center pt-2 mt-3 small" style={{ borderTop: '1px solid var(--reddit-border)', color: 'var(--reddit-muted)' }}>
                    <span>💬 {commentCount} comentarios visibles</span>

                    <div className="d-flex gap-1">
                      <button
                        onClick={async () => {
                          if (!confirm('¿Eliminar esta publicación?')) return;
                          try {
                            await apiService.deletePost(post._id);
                            setMisPosts((prev) => prev.filter((p) => p._id !== post._id));
                          } catch {
                            alert('Error al eliminar la publicación');
                          }
                        }}
                        className="btn btn-sm border-0 px-2"
                        style={{ color: '#dc3545' }}
                      >
                        🗑️
                      </button>
                      <Link to={`/post/${post._id}`} className="btn btn-sm btn-outline-primary px-3">
                        Ver más
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
