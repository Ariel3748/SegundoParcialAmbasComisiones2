




// src/context/ToastContext.tsx
import { createContext, useState, useRef, useCallback, type ReactNode } from 'react';
import ToastContainer from '../components/ToastContainer';

// Forma de cada notificación individual
export interface ToastItem {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

// Lo que el resto de la app va a poder pedirle al Context
interface ToastContextType {
  showToast: (message: string, type?: ToastItem['type']) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const DURACION_MS = 3000;

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  // Acá vive la lista de toasts activos en pantalla
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Guardamos los timers por id, para poder limpiarlos si el toast
  // se cierra manualmente antes de que termine su tiempo
  const timers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  // Saca un toast del array (lo llama tanto el botón "cerrar" como el auto-dismiss)
  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));

    // Si todavía existe un timer pendiente para este id, lo cancelamos
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  // Esta es la función que vas a llamar desde cualquier página: showToast('Tag creada', 'success')
  const showToast = useCallback((message: string, type: ToastItem['type'] = 'info') => {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, message, type }]);

    // Programamos el cierre automático a los 3 segundos
    timers.current[id] = setTimeout(() => {
      removeToast(id);
    }, DURACION_MS);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};

export { ToastContext };