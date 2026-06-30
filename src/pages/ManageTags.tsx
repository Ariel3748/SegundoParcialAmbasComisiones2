import { useEffect, useState, useRef } from 'react';
import { apiService } from '../api/api';
import type { Tag } from '../types';
import { useToast } from '../hooks/useToast';
import {Pencil, Trash3} from 'react-bootstrap-icons'




{/*

// adentro del componente:


// donde antes tenías mostrarExito('Tag creada') en ManageTags.tsx:


// donde tenías el alert('Error al eliminar...') en Profile.tsx:
showToast('Error al eliminar la publicación', 'error');*/}

export default function ManageTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const errorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { showToast } = useToast();

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
      .catch(err => showToast(err,'error'))
      .finally(() => setLoading(false));
  };

  useEffect(cargarTags, []);




  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = nuevoNombre.trim();
    if (!name) return;
    try {
      await apiService.createTag(name);
      setNuevoNombre('');
      showToast(`Tag "#${name}" creada`, 'success');
      cargarTags();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al crear', 'error')
    }
  };

  const handleEditar = async (id: string) => {
    const name = editNombre.trim();
    if (!name) return;
    try {
      await apiService.updateTag(id, name);
      setEditandoId(null);
      setEditNombre('');
      showToast('Tag actualizado', 'success')
      cargarTags();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al editar', 'error')
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Eliminar esta etiqueta?\nLos posts que la usen dejarán de mostrarla.')) return;
    try {
      await apiService.deleteTag(id);
      showToast('Tag eliminado','success')
      cargarTags();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al eliminar', 'error')
    }
  };

  return (
    <div className="container my-4" style={{ maxWidth: '700px' }}>
      <div className="reddit-card p-4 mb-4">
        <h2 className="fw-bold mb-3" style={{ color: 'var(--reddit-text)' }}>Gestionar Etiquetas</h2>

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
                        <Pencil size={16} color='var(--reddit-orange)'/>
                      </button>
                      <button
                        className="btn btn-sm border-0 px-2"
                        style={{ color: '#dc3545' }}
                        onClick={() => handleEliminar(tag._id)}
                      >
                        <Trash3 size={16} color='grey'/>
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
