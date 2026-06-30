import { Link } from "react-router-dom";

function Error404() {
  return (
    <section className="d-flex align-items-center py-5">
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6 order-md-2">
            <div className="lc-block mb-4 mb-md-0">
              <lottie-player
                src="https://assets9.lottiefiles.com/packages/lf20_kcsr6fcp.json"
                background="transparent"
                speed="1"
                loop
                autoplay
                style={{ width: "100%", maxHeight: "400px" }}
              ></lottie-player>
            </div>
          </div>

          <div className="col-md-6 text-center text-md-start">
            <div className="lc-block mb-3"></div>

            <div className="lc-block mb-3">
              <div>
                <h1 className="display-1 fw-bold" style={{ color: 'var(--reddit-text)' }}>Error 404</h1>
              </div>
            </div>

            <div className="lc-block mb-5">
              <div>
                <p className="fs-5 fw-light" style={{ color: 'var(--reddit-muted)' }}>
                  La página o el perfil que estás buscando fue movido,
                  removido o nunca existió en nuestra red social.
                </p>
              </div>
            </div>

            <div className="lc-block">
              <Link
                className="btn btn-primary fw-bold px-4 btn-lg"
                to="/"
                role="button"
              >
                Volver al Inicio 🏠
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Error404;
