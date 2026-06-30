import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../api/api';
import type { Post } from '../types';

interface Props {
  post: Post;
}

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = ((h << 5) - h) + id.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export default function PostCard({ post }: Props) {
  const { user, refreshUser } = useAuth();
  const [vote, setVote] = useState<'up' | 'down' | null>(null);
  const [score, setScore] = useState(() => (hashId(post._id || '1') % 200) + 1);
  const [siguiendo, setSiguiendo] = useState(
    () => user !== null && post.author != null && typeof post.author === 'object' && user.following.some(
      (u) => (typeof u === 'string' ? u : u._id) === post.author._id
    )
  );
  const [siguiendoLoading, setSiguiendoLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleVote = (type: 'up' | 'down') => {
    if (vote === type) {
      setVote(null);
      setScore((s) => s + (type === 'up' ? -1 : 1));
    } else if (vote === null) {
      setVote(type);
      setScore((s) => s + (type === 'up' ? 1 : -1));
    } else {
      setScore((s) => s + (vote === 'up' ? -1 : 1) + (type === 'up' ? 1 : -1));
      setVote(type);
    }
  };

  const handleFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || siguiendoLoading) return;
    const targetNick = typeof post.author === 'object' ? post.author?.nickName : '';
    if (!targetNick || targetNick === user.nickName) return;
    setSiguiendoLoading(true);
    try {
      await apiService.followUser(user.nickName, targetNick);
      setSiguiendo(true);
      await refreshUser();
    } catch (err) {
      console.error('Error al seguir:', err);
    } finally {
      setSiguiendoLoading(false);
    }
  };

  const authorName = post.author?.nickName || 'Usuario';
  const commentCount = post.comments?.length || 0;

  return (
    <div className="reddit-card d-flex mb-2 overflow-hidden">
      
      {/* Barra lateral de Votación clásica de Reddit */}
      <div className="d-flex flex-column align-items-center p-2" style={{ backgroundColor: 'var(--reddit-card-hover)', width: '44px' }}>
        <button
          className={`btn p-0 border-0 fs-5 lh-1 ${vote === 'up' ? 'text-danger' : 'text-secondary'}`}
          onClick={() => handleVote('up')}
          style={{ transition: 'color 0.1s' }}
        >
          ▲
        </button>
        <span className={`small fw-bold my-1 ${vote === 'up' ? 'text-danger' : vote === 'down' ? 'text-primary' : ''}`}>
          {score}
        </span>
        <button
          className={`btn p-0 border-0 fs-5 lh-1 ${vote === 'down' ? 'text-primary' : 'text-secondary'}`}
          onClick={() => handleVote('down')}
          style={{ transition: 'color 0.1s' }}
        >
          ▼
        </button>
      </div>

      {/* Contenido Principal */}
      <div className="p-2 flex-grow-1 d-flex flex-column justify-content-between">
        <div>
          {/* Header del post */}
          <div className="d-flex align-items-center gap-1 mb-1" style={{ fontSize: '12px', color: 'var(--reddit-muted)' }}>
            <span className="fw-bold text-wrap" style={{ color: 'var(--reddit-text)' }}>u/{authorName}</span>
            {user && authorName !== user.nickName && (
              <button
                onClick={handleFollow}
                disabled={siguiendoLoading}
                className="btn btn-sm border-0 px-2 py-0 fw-semibold"
                style={{
                  fontSize: '11px',
                  color: siguiendo ? 'var(--reddit-muted)' : 'var(--reddit-orange)',
                  backgroundColor: 'transparent',
                }}
              >
                {siguiendoLoading ? '...' : siguiendo ? '✓ Siguiendo' : '+ Seguir'}
              </button>
            )}
          </div>

          {/* Descripción completa */}
          <Link to={`/post/${post._id}`} className="text-decoration-none" style={{ color: 'var(--reddit-text)' }}>
            <h5 className="fw-semibold m-0 mb-2 fs-5">{post.description}</h5>
          </Link>

          {/* Renderizado de imagen optimizada estilo Feed de Reddit */}
          {post.images && post.images.length > 0 && !imgError && (
            <div className="my-2 border rounded overflow-hidden text-center bg-black d-flex align-items-center justify-content-center" style={{ maxHeight: '512px' }}>
              <img
                src={post.images[0].imageUrl}
                alt="Post content"
                className="img-fluid"
                style={{ maxHeight: '512px', objectFit: 'contain' }}
                onError={() => setImgError(true)}
              />
            </div>
          )}

          {/* Tags con estilo de Flairs de Reddit */}
          {post.tags && post.tags.length > 0 && (
            <div className="d-flex gap-1 flex-wrap my-2">
              {post.tags.map(tag => (
                <span key={tag._id} className="badge rounded-pill px-2 py-1 border text-secondary" style={{ backgroundColor: 'var(--reddit-card-hover)', fontSize: '11px' }}>
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer del post: Acciones en cápsulas sutiles */}
        <div className="d-flex align-items-center gap-2 mt-2 pt-1">
          <Link to={`/post/${post._id}`} className="btn btn-sm border-0 d-flex align-items-center gap-1 px-2 py-1 text-decoration-none fw-bold" style={{ color: 'var(--reddit-muted)', backgroundColor: 'var(--reddit-card-hover)', fontSize: '12px', borderRadius: '4px' }}>
            💬 {commentCount} Comments
          </Link>
          
          <Link to={`/post/${post._id}`} className="btn btn-sm reddit-btn-orange ms-auto px-3 py-1" style={{ fontSize: '12px' }}>
            Ver más
          </Link>
        </div>

      </div>
    </div>
  );
}
