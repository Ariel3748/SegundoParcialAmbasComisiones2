import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../api/api';
import { useAuth } from '../hooks/useAuth';
import type { Post, Comment, PostImage } from '../types';

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [images, setImages] = useState<PostImage[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [siguiendo, setSiguiendo] = useState(false);
  const [siguiendoLoading, setSiguiendoLoading] = useState(false);
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());
  const [nuevoComentario, setNuevoComentario] = useState<string>('');
  const [enviandoComentario, setEnviandoComentario] = useState<boolean>(false);
  const [errorComentario, setErrorComentario] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const cargarDatosPublicacion = async () => {
      setLoading(true);
      setError(null);
      try {
        const [postData, commentsData, imagesData] = await Promise.all([
          apiService.getPostById(id),
          apiService.getCommentsByPost(id),
          apiService.getPostImages(id),
        ]);

        setPost(postData);
        setComments(commentsData);
        setImages(imagesData);
      } catch (err) {
        setError('No se pudo cargar la publicación. Es posible que no exista.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatosPublicacion();
  }, [id]);

  useEffect(() => {
    if (!user || !post || post.author == null || typeof post.author !== 'object') return;
    setSiguiendo(
      user.following.some(
        (u) => (typeof u === 'string' ? u : u._id) === post.author._id
      )
    );
  }, [user, post]);

  const handleFollow = async () => {
    if (!user || siguiendoLoading) return;
    const targetNick = typeof post?.author === 'object' ? post.author?.nickName : '';
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

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorComentario(null);

    if (!nuevoComentario.trim()) {
      setErrorComentario('El contenido del comentario no puede estar vacío.');
      return;
    }

    if (!user) {
      setErrorComentario('Debés iniciar sesión para dejar un comentario.');
      return;
    }

    if (!id) return;

    setEnviandoComentario(true);
    try {
      const comentarioCreado = await apiService.createComment({
        postId: id,
        text: nuevoComentario.trim(),
        author: user._id,
      });

      const comentarioEstructurado: Comment = {
        ...comentarioCreado,
        author: comentarioCreado.author && typeof comentarioCreado.author === 'object'
          ? comentarioCreado.author
          : { _id: user._id, nickName: user.nickName },
      };

      setComments((prev) => [...prev, comentarioEstructurado]);
      setNuevoComentario('');
    } catch (err) {
      setErrorComentario(err instanceof Error ? err.message : 'Error al enviar el comentario.');
    } finally {
      setEnviandoComentario(false);
    }
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border" style={{ color: 'var(--reddit-orange)' }} role="status">
          <span className="visually-hidden">Cargando publicación...</span>
        </div>
        <p className="mt-2" style={{ color: 'var(--reddit-muted)' }}>Buscando en BuzzU...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container my-5" style={{ maxWidth: '700px' }}>
        <div className="alert alert-danger text-center shadow-sm">
          <h4 className="alert-heading">¡Ups!</h4>
          <p>{error || 'Publicación no encontrada.'}</p>
          <hr />
          <Link to="/" className="btn btn-outline-danger btn-sm">Volver al Inicio</Link>
        </div>
      </div>
    );
  }

  const autorName = post.author?.nickName || 'Usuario desconocido';

  return (
    <div className="container my-4" style={{ maxWidth: '800px' }}>
      <Link to="/" className="btn btn-sm btn-link text-decoration-none mb-3 p-0 d-inline-flex align-items-center gap-1" style={{ color: 'var(--reddit-muted)' }}>
        ← Volver al feed principal
      </Link>

      <div className="reddit-card p-4 mb-4">
        <div className="mb-2 small d-flex align-items-center gap-2 flex-wrap" style={{ color: 'var(--reddit-muted)' }}>
          <span>Publicado por <span className="fw-semibold" style={{ color: 'var(--reddit-text)' }}>u/{autorName}</span></span>
          {post.createdAt && <span>• {new Date(post.createdAt).toLocaleDateString('es-AR')}</span>}
          {user && autorName !== user.nickName && (
            <button
              onClick={handleFollow}
              disabled={siguiendoLoading}
              className="btn btn-sm border-0 px-2 py-0 fw-semibold ms-1"
              style={{
                fontSize: '11px',
                color: siguiendo ? 'var(--reddit-muted)' : 'var(--reddit-orange)',
                backgroundColor: 'transparent',
              }}
            >
              {siguiendoLoading ? '...' : siguiendo ? '✓ Siguiendo' : '+ Seguir'}
            </button>
          )}
          {user && typeof post.author === 'object' && post.author._id === user._id && (
            <div className="d-flex gap-1 ms-auto">
              <Link to={`/edit-post/${post._id}`} className="btn btn-sm border-0 px-2" style={{ color: 'var(--reddit-muted)', fontSize: '13px' }}>
                ✏️
              </Link>
              <button
                onClick={async () => {
                  if (!confirm('¿Eliminar esta publicación? Esta acción no se puede deshacer.')) return;
                  try {
                    await apiService.deletePost(post._id);
                    navigate('/');
                  } catch {
                    alert('Error al eliminar la publicación');
                  }
                }}
                className="btn btn-sm border-0 px-2"
                style={{ color: '#dc3545', fontSize: '13px' }}
              >
                🗑️
              </button>
            </div>
          )}
        </div>

        {post.description?.includes('\n') && (
          <h2 className="fw-bold mb-3 fs-3" style={{ color: 'var(--reddit-text)' }}>
            {post.description?.split('\n')[0] || 'Publicación'}
          </h2>
        )}

        <p className="fs-5" style={{ color: 'var(--reddit-text)', whiteSpace: 'pre-wrap' }}>
          {post.description}
        </p>

        {images.length > 0 && (
          <div className="my-3 d-flex flex-column gap-3 rounded p-2" style={{ backgroundColor: 'var(--reddit-card-hover)' }}>
            {images.map((img) => (
              !imgErrors.has(img._id) && (
                <img
                  key={img._id}
                  src={img.imageUrl}
                  alt="Contenido adjunto"
                  className="img-fluid rounded mx-auto"
                  style={{ maxHeight: '500px', objectFit: 'contain' }}
                  onError={() => setImgErrors(prev => new Set(prev).add(img._id))}
                />
              )
            ))}
          </div>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="d-flex flex-wrap gap-1 mt-3">
            {post.tags.map((tag) => (
              <span key={tag._id} className="badge" style={{ backgroundColor: 'var(--reddit-card-hover)', color: 'var(--reddit-muted)', border: '1px solid var(--reddit-border)' }}>
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="reddit-card p-4">
        <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
          Comentarios
          <span className="badge rounded-pill" style={{ backgroundColor: 'var(--reddit-orange)', color: '#fff' }}>{comments.length}</span>
        </h4>

        <div className="mb-4">
          {user ? (
            <form onSubmit={handleCommentSubmit}>
              <div className="mb-2">
                <label htmlFor="comentarioInput" className="form-label small fw-semibold" style={{ color: 'var(--reddit-muted)' }}>
                  Comentar como <span style={{ color: 'var(--reddit-orange)' }}>u/{user.nickName}</span>
                </label>
                <textarea
                  id="comentarioInput"
                  rows={3}
                  className={`form-control ${errorComentario ? 'is-invalid' : ''}`}
                  placeholder="¿Qué opinás sobre esto? Dejá tu comentario..."
                  value={nuevoComentario}
                  onChange={(e) => setNuevoComentario(e.target.value)}
                  disabled={enviandoComentario}
                />
                {errorComentario && (
                  <div className="invalid-feedback">{errorComentario}</div>
                )}
              </div>
              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn btn-primary btn-sm px-4 fw-semibold"
                  disabled={enviandoComentario}
                >
                  {enviandoComentario ? 'Enviando...' : 'Comentar'}
                </button>
              </div>
            </form>
          ) : (
            <div className="alert alert-warning small text-center mb-0" role="alert">
              Para unirte a la conversación, por favor <Link to="/login" className="fw-bold text-decoration-none">Iniciá sesión</Link>.
            </div>
          )}
        </div>

        <hr style={{ borderColor: 'var(--reddit-border)' }} />

        <div className="d-flex flex-column gap-3">
          {comments.map((comment) => {
            const commentAuthor = typeof comment.author === 'object' && comment.author !== null
              ? comment.author.nickName
              : 'Usuario';
            return (
              <div key={comment._id} className="p-3 rounded" style={{ backgroundColor: 'var(--reddit-card-hover)', border: '1px solid var(--reddit-border)' }}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-bold small" style={{ color: 'var(--reddit-orange)' }}>u/{commentAuthor}</span>
                  {comment.createdAt && (
                    <span style={{ color: 'var(--reddit-muted)', fontSize: '0.75rem' }}>
                      {new Date(comment.createdAt).toLocaleDateString('es-AR')}
                    </span>
                  )}
                </div>
                <p className="mb-0 small" style={{ color: 'var(--reddit-text)', whiteSpace: 'pre-wrap' }}>
                  {comment.text}
                </p>
              </div>
            );
          })}

          {comments.length === 0 && (
            <div className="text-center py-4" style={{ color: 'var(--reddit-muted)' }}>
              No hay comentarios todavía. ¡Sé el primero en romper el hielo!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
