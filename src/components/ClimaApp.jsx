import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ClimaApp.css";
import fondoclima from "../assets/weatherBG.jpg";

gsap.registerPlugin(ScrollTrigger);

const API_KEY = "3c0231f77c8c3f7866f2f24a24c6dd28";

function ClimaApp() {
  const [pais, setPais] = useState("");
  const [clima, setClima] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const titleRef = useRef(null);
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const resultRef = useRef(null);
  const errorRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(titleRef.current,
      { opacity: 0, x: -100 },
      { opacity: 1, x: 0, duration: 1.5, ease: "power4.out" }
    );

    gsap.fromTo([inputRef.current, buttonRef.current],
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, delay: 0.5, ease: "power2.out" }
    );
  }, []);

  useEffect(() => {
    if (clima && resultRef.current) {
      gsap.fromTo(resultRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }
  }, [clima]);

  useEffect(() => {
    if (error && errorRef.current) {
      gsap.fromTo(errorRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [error]);

  useEffect(() => {
    gsap.from(scrollRef.current, {
      scrollTrigger: {
        trigger: scrollRef.current,
        start: "top 90%",
        end: "bottom 30%",
        scrub: 1
      },
      y: 100,
      opacity: 0,
      duration: 1,
      ease: "power4.out"
    });
  }, []);

  const obtenerClima = async () => {
    if (!pais.trim()) {
      setError("Por favor ingresa un país");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${pais}&appid=${API_KEY}&lang=es&units=metric`
      );
      if (!response.ok) throw new Error("País no encontrado");
      const data = await response.json();
      setClima(data);
      setError("");
    } catch (err) {
      setError(err.message);
      setClima(null);
    } finally {
      setLoading(false);
    }
  };

 return (
    <div
      className="clima-body"
      style={{
        backgroundImage: `url(${fondoclima})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed"
      }}
    >
      <nav className="navbar">
        <ul>
          <li><a href="#">Weather YR</a></li>
          <li><a href="#inicio">Inicio</a></li>
          <li><a href="#nosotros">Nosotros</a></li>
        </ul>
      </nav>

      <div className="contenedor" id="inicio">
        <h1 ref={titleRef} className="titulo">🌤 Clima en Tiempo Real</h1>
        <div className="buscador">
          <input
            ref={inputRef}
            type="text"
            value={pais}
            onChange={(e) => setPais(e.target.value)}
            placeholder="Ej: Bogota , Miami .."
            className="input"
          />
          <button
            ref={buttonRef}
            onClick={obtenerClima}
            className={`boton ${loading ? 'boton-loading' : ''}`}
            disabled={loading}
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>

        {error && <p ref={errorRef} className="error">❌ {error}</p>}

        {clima && (
          <div ref={resultRef} className="resultado">
            <h2 className="ciudad-nombre">📍 {clima.name}, {clima.sys.country}</h2>
            <div className="info-grid">
              <div className="info-card"><span className="emoji">🌡️</span><div><p className="valor">{Math.round(clima.main.temp)}°C</p><p className="etiqueta">Temperatura</p></div></div>
              <div className="info-card"><span className="emoji">💧</span><div><p className="valor">{clima.main.humidity}%</p><p className="etiqueta">Humedad</p></div></div>
              <div className="info-card"><span className="emoji">🌪️</span><div><p className="valor">{clima.wind.speed} m/s</p><p className="etiqueta">Viento</p></div></div>
              <div className="info-card"><span className="emoji">☁️</span><div><p className="valor">{clima.weather[0].description}</p><p className="etiqueta">Condición</p></div></div>
            </div>
            <div className="sensacion-termica">
              Sensación térmica: <strong>{Math.round(clima.main.feels_like)}°C</strong>
            </div>
          </div>
        )}
      </div>

      <section ref={scrollRef} className="scroll-section" id="nosotros">
        <div className="scroll-container">
          <h2 className="scroll-heading">Bienvenidos</h2>
          <p className="scroll-subheading">
            Esta pagina es diseñada con <strong>React+Vite</strong> por <strong>Yessetk Rodríguez</strong><br />
            Estudiante de la <strong>Universidad EAFIT</strong><br />
            Para consultar el clima en cualquier ciudad o país.
          </p>
        </div>
      </section>
        <footer className="footer">
  <p>© {new Date().getFullYear()} Yessetk Rodríguez</p>
  <p>Hecho en React+Vite</p>
</footer>

    </div>
    
  );
}

export default ClimaApp;

