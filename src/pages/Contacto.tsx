import { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useForm } from '../hooks/useForm';

const initialValues = {
  nombre: '',
  email: '',
  telefono: '',
  tipo: 'Consulta General',
  mensaje: '',
};

const validate = (values: Record<string, string>) => {
  const errors: Record<string, string> = {};
  if (!values.nombre.trim()) errors.nombre = 'El nombre es obligatorio.';
  if (!values.email.trim()) {
    errors.email = 'El correo es obligatorio.';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'El formato de correo no es válido.';
  }
  if (!values.mensaje.trim()) {
    errors.mensaje = 'Por favor, escribí un mensaje.';
  } else if (values.mensaje.length < 10) {
    errors.mensaje = 'El mensaje debe tener al menos 10 caracteres.';
  }
  return errors;
};

function Contacto() {
  const {
    datos,
    errores,
    tocado,
    handleChange,
    handleBlur,
    validarFormularioCompleto,
    reset,
  } = useForm({ initialValues, validate });

  const [mostrarModal, setMostrarModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const esValido = validarFormularioCompleto();
    if (esValido) {
      setMostrarModal(true);
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    reset();
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="mb-4 pb-3" style={{ borderBottom: '1px solid var(--reddit-border)' }}>
          <h2 className="fw-bold" style={{ color: 'var(--reddit-text)' }}>Contacto</h2>
          <p className="mb-0" style={{ color: 'var(--reddit-muted)' }}>
            Escribinos tu consulta y un asesor te responderá a la brevedad.
          </p>
        </div>

        <Form
          onSubmit={handleSubmit}
          className="reddit-card p-4"
        >
          <h5 className="fw-bold mb-3 pb-2" style={{ color: 'var(--reddit-text)', borderBottom: '1px solid var(--reddit-border)' }}>Dejanos tu Mensaje</h5>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold">Nombre Completo</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={datos.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={tocado.nombre && !!errores.nombre}
              placeholder="Ej: María Luz"
            />
            <Form.Control.Feedback type="invalid">
              {errores.nombre}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold">Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={datos.email}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={tocado.email && !!errores.email}
              placeholder="maria@ejemplo.com"
            />
            <Form.Control.Feedback type="invalid">
              {errores.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold">Teléfono (opcional)</Form.Label>
            <Form.Control
              type="text"
              name="telefono"
              value={datos.telefono}
              onChange={handleChange}
              placeholder="+54 11 1234-5678"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold">Motivo del contacto</Form.Label>
            <Form.Select name="tipo" value={datos.tipo} onChange={handleChange}>
              <option value="Consulta General">Consulta General</option>
              <option value="Soporte Técnico">Soporte Técnico</option>
              <option value="Sugerencia / Reclamo">Sugerencia / Reclamo</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold">Mensaje</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="mensaje"
              value={datos.mensaje}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={tocado.mensaje && !!errores.mensaje}
              placeholder="Escribí detalladamente tu consulta..."
            />
            <Form.Control.Feedback type="invalid">
              {errores.mensaje}
            </Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" className="btn btn-primary w-100 fw-bold py-2 text-uppercase">
            Enviar Mensaje ✉️
          </Button>
        </Form>

        <Modal show={mostrarModal} onHide={cerrarModal} centered>
          <Modal.Header closeButton className="text-white" style={{ backgroundColor: 'var(--reddit-orange)' }}>
            <Modal.Title className="fw-bold fs-5">✉️ ¡Mensaje Enviado!</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center py-4">
            <span className="display-4 d-block mb-3">📬✨</span>
            <h4 style={{ color: 'var(--reddit-text)' }}>¡Muchas gracias, <strong>{datos.nombre}</strong>!</h4>
            <p className="px-2 mt-2" style={{ color: 'var(--reddit-muted)' }}>
              Tu mensaje fue registrado correctamente. Te responderemos a la brevedad.
            </p>
            <div className="p-3 rounded text-start my-3 mx-2 small" style={{ backgroundColor: 'var(--reddit-card-hover)', border: '1px solid var(--reddit-border)' }}>
              <div className="mb-1" style={{ color: 'var(--reddit-text)' }}><strong>Nombre:</strong> {datos.nombre}</div>
              <div className="mb-1" style={{ color: 'var(--reddit-text)' }}><strong>Email:</strong> {datos.email}</div>
              {datos.telefono && <div className="mb-1" style={{ color: 'var(--reddit-text)' }}><strong>Teléfono:</strong> {datos.telefono}</div>}
              <div className="mb-1" style={{ color: 'var(--reddit-text)' }}><strong>Motivo:</strong> {datos.tipo}</div>
              <div className="mt-2 pt-2 border-top" style={{ borderTopColor: 'var(--reddit-border)', color: 'var(--reddit-muted)' }}>
                <strong>Mensaje:</strong> "{datos.mensaje}"
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="primary" onClick={cerrarModal} className="w-100 fw-bold py-2">
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default Contacto;
