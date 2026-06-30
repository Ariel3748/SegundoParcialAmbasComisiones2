function Desarrolladores() {
  const integrantes = [
    { iniciales: "PP", nombre: "Pablo Perugini", color: "av-a" },
    { iniciales: "AO", nombre: "Ariel Oliva", color: "av-b" },
    { iniciales: "LL", nombre: "Luca Lafuente", color: "av-c" },
  ];

  const detalles = [
    { label: "Universidad", valor: "UNAHUR" },
    { label: "Trabajo práctico", valor: "Construcción de Interfaces de Usuario" },
    { label: "Tecnologías", valor: "React + TypeScript + Bootstrap" },
    { label: "Año", valor: "2026" },
  ];

  return (
    <div className="min-vh-100">
      <div className="container py-5">

        <div className="text-center mb-5">
          <p className="text-uppercase fw-semibold mb-2"
            style={{ fontSize: "12px", letterSpacing: "0.08em", color: 'var(--reddit-muted)' }}>
            El equipo
          </p>
          <h1 className="fw-semibold mb-3" style={{ fontSize: "28px", color: 'var(--reddit-text)' }}>
            Estudiantes de la UNAHUR y amantes del código.
          </h1>
          <p className="mx-auto"
            style={{ maxWidth: "600px", lineHeight: "1.8", fontSize: "15px", color: 'var(--reddit-muted)' }}>
            Somos un grupo de estudiantes de la Universidad Nacional de Hurlingham (UNAHUR)
            y creamos BuzzU como nuestro trabajo práctico integrador de la materia
            Construcción de Interfaces de Usuario. Una red social inspirada en Reddit,
            desarrollada con React, TypeScript y Bootstrap.
          </p>
        </div>

        <hr style={{ borderColor: 'var(--reddit-border)' }} />

        <div className="row g-4 mb-5 justify-content-center">
          {integrantes.map((i) => (
            <div className="col-6 col-md-4 col-lg-3" key={i.iniciales}>
              <div className="reddit-card text-center p-4 h-100">
                <div className={`avatar-circle mx-auto mb-3 ${i.color}`}>
                  {i.iniciales}
                </div>
                <p className="fw-semibold mb-1" style={{ fontSize: "15px", color: 'var(--reddit-text)' }}>{i.nombre}</p>
                <p className="small mb-0" style={{ color: 'var(--reddit-muted)' }}>
                  Desarrollo frontend
                </p>
              </div>
            </div>
          ))}
        </div>

        <hr style={{ borderColor: 'var(--reddit-border)' }} />

        <div className="row g-3 my-4 justify-content-center">
          {detalles.map((item) => (
            <div className="col-6 col-md-3" key={item.label}>
              <div className="reddit-card text-center p-3">
                <p className="fw-bold mb-1" style={{ fontSize: "16px", color: 'var(--reddit-orange)' }}>
                  {item.valor}
                </p>
                <p className="text-uppercase fw-semibold mb-0" style={{ fontSize: "11px", letterSpacing: "0.06em", color: 'var(--reddit-muted)' }}>
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Desarrolladores;