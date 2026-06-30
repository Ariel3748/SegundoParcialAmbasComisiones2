import logoImg from '../assets/image__1_-removebg-preview.png';
import misionImg from '../assets/mision.png';
import visionImg from '../assets/vision.png';

function Nosotros() {
  const stats = [
    { label: "Estudiantes", valor: "+8.000" },
    { label: "Carreras", valor: "15" },
    { label: "Publicaciones", valor: "+500" },
    { label: "Comunidad", valor: "Activa" },
  ];

  return (
    <div className="min-vh-100">
      <div className="container py-5">

        <div className="text-center mb-5">
          <img src={logoImg} alt="BuzzU Logo" className="mb-3" style={{ width: '96px', height: '96px', objectFit: 'contain' }} />
          <h1 className="fw-semibold mb-3" style={{ fontSize: "28px", color: 'var(--reddit-text)' }}>
            BuzzU
          </h1>
          <p className="mx-auto"
            style={{ maxWidth: "650px", lineHeight: "1.8", fontSize: "15px", color: 'var(--reddit-muted)' }}>
            Somos un grupo de estudiantes de la Universidad Nacional de Hurlingham y creamos BuzzU como nuestro
            trabajo práctico integrador de la materia Construcción de Interfaces de Usuario. BuzzU nació con la idea
            de construir un espacio de debate e intercambio para la comunidad universitaria, inspirado en el formato
            de Reddit. Una red social desarrollada con React, TypeScript y Bootstrap, aplicando todo lo aprendido
            durante la cursada.
          </p>
        </div>

        <hr style={{ borderColor: 'var(--reddit-border)' }} />

        <div className="row g-4 my-4 align-items-stretch">
          <div className="col-md-6">
            <div className="reddit-card p-4 h-100">
              <img src={misionImg} alt="Misión" className="mb-2" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
              <h5 className="fw-semibold mb-2" style={{ fontSize: "16px", color: 'var(--reddit-text)' }}>Nuestra misión</h5>
              <p className="mb-0" style={{ fontSize: "14px", lineHeight: "1.7", color: 'var(--reddit-muted)' }}>
                Fomentar un espacio de debate e intercambio de información académica entre
                los estudiantes de la UNAHUR, facilitando la comunicación y el aprendizaje colaborativo.
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="reddit-card p-4 h-100">
              <img src={visionImg} alt="Visión" className="mb-2" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
              <h5 className="fw-semibold mb-2" style={{ fontSize: "16px", color: 'var(--reddit-text)' }}>Nuestra visión</h5>
              <p className="mb-0" style={{ fontSize: "14px", lineHeight: "1.7", color: 'var(--reddit-muted)' }}>
                Ser el espacio digital de referencia para la comunidad Unahur, donde
                estudiantes y docentes puedan conectarse más allá del aula.
              </p>
            </div>
          </div>
        </div>

        <hr style={{ borderColor: 'var(--reddit-border)' }} />

        <div className="row g-3 my-4 justify-content-center text-center">
          {stats.map((item) => (
            <div className="col-6 col-md-3" key={item.label}>
              <div className="reddit-card p-3">
                <div className="fw-bold mb-1" style={{ fontSize: "28px", color: 'var(--reddit-orange)' }}>
                  {item.valor}
                </div>
                <div className="small" style={{ color: 'var(--reddit-muted)' }}>
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Nosotros;
