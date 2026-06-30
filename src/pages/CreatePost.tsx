import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../api/api';
import type { Tag } from '../types';

export default function CreatePost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tagsDisponibles, setTagsDisponibles] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorSubmit, setErrorSubmit] = useState<string | null>(null);

  useEffect(() => {
    apiService.getTags()
      .then(setTagsDisponibles)
      .catch((err) => console.error("Error al cargar etiquetas:", err));
  }, []);

  const { datos, errores, handleChange, setFieldValue, validarFormularioCompleto } = useForm({
    initialValues: {
      description: '',
      imageUrl1: '',
      imageUrl2: '',
      tagsSeleccionados: [] as string[]
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      if (!values.description.trim()) {
        errors.description = 'La descripción es obligatoria.';
      } else if (values.description.trim().length < 3) {
        errors.description = 'Debe tener al menos 3 caracteres.';
      }
      return errors;
    }
  });

  const handleTagToggle = (tagId: string) => {
    const actuales: string[] = datos.tagsSeleccionados;
    if (actuales.includes(tagId)) {
      setFieldValue('tagsSeleccionados', actuales.filter(id => id !== tagId));
    } else {
      setFieldValue('tagsSeleccionados', [...actuales, tagId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorSubmit(null);

    if (!validarFormularioCompleto() || !user) {
      return;
    }

    setLoading(true);
    try {
      const nuevoPost = await apiService.createPost({
        description: datos.description,
        author: user._id,
        tags: datos.tagsSeleccionados
      });

      const urlsDeImagenes = [datos.imageUrl1, datos.imageUrl2].filter(url => url.trim() !== '');

      if (urlsDeImagenes.length > 0) {
        const promesasImagenes = urlsDeImagenes.map(url =>
          apiService.createPostImage({
            url: url.trim(),
            postId: nuevoPost._id,
          })
        );
        await Promise.all(promesasImagenes);
      }

      navigate('/profile');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Ocurrió un error al guardar la publicación.';
      setErrorSubmit(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: '700px' }}>
      <div className="reddit-card p-4">
        <h2 className="mb-4 fw-bold" style={{ color: 'var(--reddit-text)' }}>Crear nueva publicación</h2>

        {errorSubmit && (
          <div className="alert alert-danger" role="alert">
            {errorSubmit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="description" className="form-label fw-semibold">
              ¿Qué estás pensando? <span className="text-danger">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className={`form-control ${errores.description ? 'is-invalid' : ''}`}
              placeholder="Escribí el contenido de tu posteo acá..."
              value={datos.description}
              onChange={handleChange}
            />
            {errores.description && (
              <div className="invalid-feedback">{errores.description}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">URLs de Imágenes (Opcional)</label>
            <input
              type="url"
              name="imageUrl1"
              className="form-control mb-2"
              placeholder="https://ejemplo.com/imagen1.jpg"
              value={datos.imageUrl1}
              onChange={handleChange}
            />
            <input
              type="url"
              name="imageUrl2"
              className="form-control"
              placeholder="https://ejemplo.com/imagen2.jpg"
              value={datos.imageUrl2}
              onChange={handleChange}
            />
            <div className="form-text">Podés ingresar enlaces directos a imágenes de internet.</div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold d-block">Seleccionar Etiquetas</label>
            <div className="d-flex flex-wrap gap-2">
              {tagsDisponibles.map((tag) => {
                const seleccionado = datos.tagsSeleccionados.includes(tag._id);
                return (
                  <button
                    key={tag._id}
                    type="button"
                    onClick={() => handleTagToggle(tag._id)}
                    className={`btn btn-sm ${seleccionado ? 'btn-primary' : 'reddit-btn-secondary'}`}
                  >
                    #{tag.name}
                  </button>
                );
              })}
              {tagsDisponibles.length === 0 && (
                <span className="small" style={{ color: 'var(--reddit-muted)' }}>Cargando etiquetas disponibles...</span>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 border-top pt-3" style={{ borderTopColor: 'var(--reddit-border)' }}>
            <button
              type="button"
              className="btn reddit-btn-secondary"
              disabled={loading}
              onClick={() => navigate('/')}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary px-4"
              disabled={loading}
            >
              {loading ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
