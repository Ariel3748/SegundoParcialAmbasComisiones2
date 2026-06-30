import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from '../hooks/useForm';
import { apiService } from '../api/api';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const navigate = useNavigate();
  const [errorSubmit, setErrorSubmit] = useState<string | null>(null);
  const [successSubmit, setSuccessSubmit] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const { datos, errores, handleChange, handleBlur, validarFormularioCompleto } = useForm({
    initialValues: {
      nickName: '',
      email: '',
      password: '',
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      if (!values.nickName.trim()) {
        errors.nickName = 'El nombre de usuario es obligatorio.';
      } else if (values.nickName.trim().length < 3) {
        errors.nickName = 'Debe tener al menos 3 caracteres.';
      }
      if (!values.email.trim()) {
        errors.email = 'El correo electrónico es obligatorio.';
      } else if (!EMAIL_REGEX.test(values.email.trim())) {
        errors.email = 'Ingresá un correo electrónico válido.';
      }
      if (!values.password) {
        errors.password = 'La contraseña es obligatoria.';
      } else if (values.password.length < 4) {
        errors.password = 'Debe tener al menos 4 caracteres.';
      }
      return errors;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorSubmit(null);

    if (!validarFormularioCompleto()) return;

    setLoading(true);
    try {
      await apiService.createUser({
        nickName: datos.nickName.trim(),
        email: datos.email.trim(),
        password: datos.password,
      });

      setSuccessSubmit(true);
      timerRef.current = setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'No se pudo crear el usuario.';
      setErrorSubmit(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: '450px' }}>
      <div className="reddit-card p-4">
        <div className="text-center mb-4">
          <h2 className="fw-bold m-0" style={{ color: 'var(--reddit-orange)' }}>Registrarse</h2>
          <p className="small" style={{ color: 'var(--reddit-muted)' }}>Creá tu cuenta de comunidad BuzzU</p>
        </div>

        {errorSubmit && (
          <div className="alert alert-danger small" role="alert">
            {errorSubmit}
          </div>
        )}

        {successSubmit && (
          <div className="alert alert-success small text-center" role="alert">
            🎉 ¡Usuario creado con éxito! Redirigiendo al login...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Nickname */}
          <div className="mb-3">
            <label htmlFor="nickName" className="form-label small fw-semibold">Nickname deseado</label>
            <input
              type="text"
              id="nickName"
              name="nickName"
              className={`form-control ${errores.nickName ? 'is-invalid' : ''}`}
              placeholder="Ej: lucas99"
              value={datos.nickName}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading || successSubmit}
            />
            {errores.nickName && <div className="invalid-feedback">{errores.nickName}</div>}
          </div>

          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label small fw-semibold">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-control ${errores.email ? 'is-invalid' : ''}`}
              placeholder="estudiante@unahur.edu.ar"
              value={datos.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading || successSubmit}
            />
            {errores.email && <div className="invalid-feedback">{errores.email}</div>}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="form-label small fw-semibold">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-control ${errores.password ? 'is-invalid' : ''}`}
              placeholder="Elegí una contraseña"
              value={datos.password}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading || successSubmit}
            />
            {errores.password && <div className="invalid-feedback">{errores.password}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 fw-semibold py-2 mb-3"
            disabled={loading || successSubmit}
          >
            {loading ? 'Creando cuenta...' : 'Registrar Cuenta'}
          </button>

          <div className="text-center small mt-2">
            ¿Ya tenés un usuario registrado?{' '}
            <Link to="/login" className="fw-bold text-decoration-none">
              Iniciá sesión acá
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}