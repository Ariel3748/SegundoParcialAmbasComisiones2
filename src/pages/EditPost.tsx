import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../api/api';
import { useAuth } from '../hooks/useAuth';

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    apiService.getPostById(id)
      .then((post) => {
        if (typeof post.author === 'object' && post.author._id !== user?._id) {
          setError('No tenés permiso para editar esta publicación');
          return;
        }
        setDescription(post.description || '');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !description.trim()) return;

    setSaving(true);
    try {
      await apiService.updatePost(id, description.trim(), user?._id);
      navigate(`/post/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-warning" />
      </div>
    );
  }

  if (error && !description) {
    return (
      <div className="container my-5" style={{ maxWidth: '700px' }}>
        <div className="alert alert-danger text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="container my-5" style={{ maxWidth: '700px' }}>
      <div className="reddit-card p-4">
        <h2 className="mb-4 fw-bold" style={{ color: 'var(--reddit-text)' }}>Editar publicación</h2>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="description" className="form-label fw-semibold">Descripción</label>
            <textarea
              id="description"
              rows={6}
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={saving}
            />
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn reddit-btn-secondary" onClick={() => navigate(-1)} disabled={saving}>
              Cancelar
            </button>
            <button type="submit" className="btn reddit-btn-orange px-4" disabled={!description.trim() || saving}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
