import { CheckCircleFill, XCircleFill, InfoCircleFill, X } from 'react-bootstrap-icons';
import type { ToastItem } from '../context/ToastContext';

interface Props {
  toasts: ToastItem[];
  onClose: (id: number) => void;
}

const COLORES: Record<ToastItem['type'], string> = {
  success: 'var(--reddit-orange)',
  error: '#dc3545',
  info: '#0079d3',
};

// Componente que devuelve el ícono correcto según el tipo de toast
const Icono = ({ type }: { type: ToastItem['type'] }) => {
  const color = COLORES[type];
  if (type === 'success') return <CheckCircleFill color={color} size={16} />;
  if (type === 'error') return <XCircleFill color={color} size={16} />;
  return <InfoCircleFill color={color} size={16} />;
};

export default function ToastContainer({ toasts, onClose }: Props) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="d-flex flex-column gap-2"
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: 1080,
        maxWidth: '320px',
        width: '90vw',
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="reddit-card d-flex align-items-start gap-2 p-3 toast-enter"
          style={{
            borderLeft: `4px solid ${COLORES[toast.type]}`,
          }}
          role="status"
          aria-live="polite"
        >
          <span className="d-flex align-items-center" style={{ marginTop: '1px' }}>
            <Icono type={toast.type} />
          </span>

          <span className="small flex-grow-1" style={{ color: 'var(--reddit-text)' }}>
            {toast.message}
          </span>

          <button
            onClick={() => onClose(toast.id)}
            className="btn btn-sm border-0 p-0 d-flex align-items-center justify-content-center"
            style={{
              color: 'var(--reddit-muted)',
              width: '20px',
              height: '20px',
              flexShrink: 0,
            }}
            aria-label="Cerrar notificación"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}