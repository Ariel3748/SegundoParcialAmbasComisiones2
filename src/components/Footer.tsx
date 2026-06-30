import { Link } from 'react-router-dom';
import logo from '../assets/image__1_-removebg-preview.png';

const Footer = () => {
  return (
    <footer className="reddit-footer mt-5">
      <div className="container">
        <div className="row g-3">
          <div className="col-md-6">
            <h6 className="fw-bold text-uppercase mb-2 d-flex align-items-center gap-1" style={{ fontSize: '12px', color: 'var(--reddit-muted)' }}><img src={logo} alt="" style={{ height: '20px', width: 'auto' }} />BuzzU</h6>
            <p className="small mb-0" style={{ maxWidth: '400px', color: 'var(--reddit-muted)' }}>
              La red social universitaria de hilos y debate libre orientada a estudiantes, apuntes y comunidad.
            </p>
          </div>
          <div className="col-md-3">
            <h6 className="fw-bold text-uppercase mb-2" style={{ fontSize: '12px', color: 'var(--reddit-muted)' }}>Enlaces</h6>
            <ul className="list-unstyled small d-flex flex-column gap-1">
              <li><Link to="/" className="text-decoration-none" style={{ color: 'var(--reddit-muted)' }}>Inicio</Link></li>
              <li><Link to="/contacto" className="text-decoration-none" style={{ color: 'var(--reddit-muted)' }}>Contacto</Link></li>
              <li><Link to="/nosotros" className="text-decoration-none" style={{ color: 'var(--reddit-muted)' }}>Nosotros</Link></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6 className="fw-bold text-uppercase mb-2" style={{ fontSize: '12px', color: 'var(--reddit-muted)' }}>Más</h6>
            <ul className="list-unstyled small d-flex flex-column gap-1">
              <li><Link to="/desarrolladores" className="text-decoration-none" style={{ color: 'var(--reddit-muted)' }}>Desarrolladores</Link></li>
              <li><Link to="/register" className="text-decoration-none" style={{ color: 'var(--reddit-muted)' }}>Registrarse</Link></li>
            </ul>
          </div>
        </div>
        <hr className="my-3" style={{ borderColor: 'var(--reddit-border)' }} />
        <p className="text-center small mb-0" style={{ color: 'var(--reddit-muted)' }}>
          &copy; {new Date().getFullYear()} BuzzU Net. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;