import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../estilos/Home.css";

function Home() {
  return (
    <div className="home-container">
      {/* Navbar */}
      <Navbar />

      {/* CONTENIDO PRINCIPAL (crece) */}
      <main className="main-content">
        <section className="hero-section">
          <div className="hero-content">
            <h1>Bienvenido a <span className="highlight">Centauri</span></h1>
            <p>
              La plataforma que impulsa tu productividad y organización.  
              Accede a tu cuenta para explorar todas las herramientas.
            </p>
            <a href="/login" className="btn-primary">
              Iniciar sesión
            </a>
          </div>
        </section>

        <section className="cards-section">
          <div className="card">
            <h3>Gestión Inteligente</h3>
            <p>Organiza tus tareas y proyectos de manera eficiente.</p>
          </div>
          <div className="card">
            <h3>Colaboración</h3>
            <p>Conecta con tu equipo en tiempo real y mejora la comunicación.</p>
          </div>
          <div className="card">
            <h3>Rendimiento</h3>
            <p>Visualiza tu progreso y mejora tus resultados día a día.</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;