import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorSubmit, setErrorSubmit] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { datos, errores, handleChange, handleBlur, validarFormularioCompleto } = useForm({
    initialValues: {
      nickName: '',
      password: '',
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      if (!values.nickName.trim()) {
        errors.nickName = 'El nombre de usuario es obligatorio.';
      }
      if (!values.password) {
        errors.password = 'La contraseña es obligatoria.';
      }
      return errors;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorSubmit(null);

    // Validar campos vacíos en el frontend
    if (!validarFormularioCompleto()) return;

    setLoading(true);
    try {
      // Intentar login mediante el contexto global
      await login(datos.nickName.trim(), datos.password);
      // Redireccionar al Home tras un inicio exitoso
      navigate('/');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al intentar iniciar sesión.';
      setErrorSubmit(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: '450px' }}>
      <div className="reddit-card p-4">
        <div className="text-center mb-4">
          <h2 className="fw-bold m-0" style={{ color: 'var(--reddit-orange)' }}>Ingresar</h2>
          <p className="small" style={{ color: 'var(--reddit-muted)' }}>BuzzU</p>
        </div>

        {errorSubmit && (
          <div className="alert alert-danger small" role="alert">
            {errorSubmit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Nickname */}
          <div className="mb-3">
            <label htmlFor="nickName" className="form-label small fw-semibold">Nickname de Estudiante</label>
            <input
              type="text"
              id="nickName"
              name="nickName"
              className={`form-control ${errores.nickName ? 'is-invalid' : ''}`}
              placeholder="Ej: lucas99"
              value={datos.nickName}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
            />
            {errores.nickName && <div className="invalid-feedback">{errores.nickName}</div>}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="form-label small fw-semibold">Contraseña Simbólica</label>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-control ${errores.password ? 'is-invalid' : ''}`}
              placeholder="Ingresá la contraseña fija"
              value={datos.password}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
            />
            {errores.password && <div className="invalid-feedback">{errores.password}</div>}
            <div className="form-text small" style={{ color: 'var(--reddit-muted)' }}>
              Usá la contraseña que elegiste al registrarte.
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-semibold py-2 mb-3"
            disabled={loading}
          >
            {loading ? 'Verificando usuario...' : 'Iniciar Sesión'}
          </button>

          <div className="text-center small mt-2">
            ¿No tenés cuenta todavía?{' '}
            <Link to="/register" className="fw-bold text-decoration-none">
              Registrate acá
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}