import { useState } from 'react';

type ValidationErrors = Record<string, string>;

interface UseFormProps<T extends Record<string, unknown>> {
  initialValues: T;
  validate?: (values: T) => ValidationErrors;
}

export function useForm<T extends Record<string, unknown>>({ initialValues, validate }: UseFormProps<T>) {
  const [datos, setDatos] = useState<T>(initialValues);
  const [errores, setErrores] = useState<ValidationErrors>({});
  const [tocado, setTocado] = useState<Record<string, boolean>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setDatos((prev) => {
      const next = { ...prev, [name]: value };
      if (validate && tocado[name]) {
        const nuevosErrores = validate(next);
        setErrores((prevErr) => {
          const cleaned = { ...prevErr };
          if (nuevosErrores[name]) cleaned[name] = nuevosErrores[name];
          else delete cleaned[name];
          return cleaned;
        });
      }
      return next;
    });
  };

  const setFieldValue = (name: string, value: unknown) => {
    setDatos((prev) => {
      const next = { ...prev, [name]: value };
      if (validate && tocado[name]) {
        const nuevosErrores = validate(next);
        setErrores((prevErr) => {
          const cleaned = { ...prevErr };
          if (nuevosErrores[name]) cleaned[name] = nuevosErrores[name];
          else delete cleaned[name];
          return cleaned;
        });
      }
      return next;
    });
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name } = e.target;
    setTocado((prev) => ({ ...prev, [name]: true }));

    if (validate) {
      const nuevosErrores = validate(datos);
      setErrores((prev) => {
        const cleaned = { ...prev };
        if (nuevosErrores[name]) cleaned[name] = nuevosErrores[name];
        else delete cleaned[name];
        return cleaned;
      });
    }
  };

  const validarFormularioCompleto = (): boolean => {
    if (!validate) return true;
    const nuevosErrores = validate(datos);
    setErrores(nuevosErrores);

    const allTouched: Record<string, boolean> = {};
    Object.keys(initialValues).forEach((key) => { allTouched[key] = true; });
    setTocado(allTouched);

    return Object.keys(nuevosErrores).length === 0;
  };

  const reset = (nuevosValores?: T) => {
    setDatos(nuevosValores ?? initialValues);
    setErrores({});
    setTocado({});
  };

  return {
    datos,
    errores,
    tocado,
    handleChange,
    handleBlur,
    setFieldValue,
    validarFormularioCompleto,
    reset,
    setDatos,
  } as const;
}
