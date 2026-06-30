import { useEffect, useState, useRef } from 'react';
import { apiService } from '../api/api';
import type { Tag } from '../types';

export default function ManageTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const errorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (errorTimer.current) clearTimeout(errorTimer.current);
      if (exitoTimer.current) clearTimeout(exitoTimer.current);
    };
  }, []);

  const cargarTags = () => {
    setLoading(true);
    apiService.getTags()
      .then(setTags)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(cargarTags, []);

  const mostrarError = (msg: string) => {
    setError(msg);
    if (errorTimer.current) clearTimeout(errorTimer.current);
    errorTimer.current = setTimeout(() => setError(null), 3000);
  };

  const mostrarExito = (msg: string) => {
    setExito(msg);
    if (exitoTimer.current) clearTimeout(exitoTimer.current);
    exitoTimer.current = setTimeout(() => setExito(null), 3000);
  };

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = nuevoNombre.trim();
    if (!name) return;
    try {
      await apiService.createTag(name);
      setNuevoNombre('');
      mostrarExito(`Tag "#${name}" creada`);
      cargarTags();
    } catch (err) {
      mostrarError(err instanceof Error ? err.message : 'Error al crear');
    }
  };

  const handleEditar = async (id: string) => {
    const name = editNombre.trim();
    if (!name) return;
    try {
      await apiService.updateTag(id, name);
      setEditandoId(null);
      setEditNombre('');
      mostrarExito('Tag actualizada');
      cargarTags();
    } catch (err) {
      mostrarError(err instanceof Error ? err.message : 'Error al editar');
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Eliminar esta etiqueta?\nLos posts que la usen dejarán de mostrarla.')) return;
    try {
      await apiService.deleteTag(id);
      mostrarExito('Tag eliminada');
      cargarTags();
    } catch (err) {
      mostrarError(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  return (
    <div className="container my-4" style={{ maxWidth: '700px' }}>
      <div className="reddit-card p-4 mb-4">
        <h2 className="fw-bold mb-3" style={{ color: 'var(--reddit-text)' }}>Gestionar Etiquetas</h2>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}
        {exito && <div className="alert alert-success py-2 small">{exito}</div>}

        <form onSubmit={handleCrear} className="d-flex gap-2 mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre de la nueva etiqueta"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
          />
          <button type="submit" className="btn reddit-btn-orange px-3" disabled={!nuevoNombre.trim()}>
            Crear
          </button>
        </form>

        {loading ? (
          <div className="text-center py-4"><div className="spinner-border text-warning" /></div>
        ) : tags.length === 0 ? (
          <p className="text-center small" style={{ color: 'var(--reddit-muted)' }}>No hay etiquetas todavía.</p>
        ) : (
          <ul className="list-unstyled m-0 d-flex flex-column gap-2">
            {tags.map(tag => (
              <li key={tag._id} className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: 'var(--reddit-card-hover)' }}>
                {editandoId === tag._id ? (
                  <div className="d-flex gap-2 flex-grow-1">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={editNombre}
                      onChange={(e) => setEditNombre(e.target.value)}
                      autoFocus
                    />
                    <button className="btn btn-sm btn-success" onClick={() => handleEditar(tag._id)}>Guardar</button>
                    <button className="btn btn-sm reddit-btn-secondary" onClick={() => { setEditandoId(null); setEditNombre(''); }}>Cancelar</button>
                  </div>
                ) : (
                  <>
                    <span className="fw-semibold small" style={{ color: 'var(--reddit-text)' }}>#{tag.name}</span>
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-sm border-0 px-2"
                        style={{ color: 'var(--reddit-muted)' }}
                        onClick={() => { setEditandoId(tag._id); setEditNombre(tag.name); }}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-sm border-0 px-2"
                        style={{ color: '#dc3545' }}
                        onClick={() => handleEliminar(tag._id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
