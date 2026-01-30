import React from 'react';

const handleCTAClick = (e: React.MouseEvent<HTMLAnchorElement>, label: string) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href')?.substring(1);
    if (targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const offset = 80;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = targetElement.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    }
    // @ts-ignore
    if (typeof trackCTAClick !== 'undefined') trackCTAClick(label);
};

const Hero = () => {
    return (
        <section className="hero">
            <div className="container">
                <div className="hero-content">
                    <h1>Digitalizamos tu <span className="highlight">MicroPyME</span> paso a paso</h1>
                    <p className="hero-subtitle">
                        Desde la creación de tu marca hasta convertirte en líder digital.
                        <br />
                        Te acompañamos en cada etapa del crecimiento de tu negocio.
                    </p>

                    <div className="hero-terminal">
                        <div className="terminal-header">
                            <div className="terminal-dot red"></div>
                            <div className="terminal-dot yellow"></div>
                            <div className="terminal-dot green"></div>
                        </div>
                        <div className="hero-stats">
                            <div className="stat">
                                <div className="stat-number">1 semana</div>
                                <div className="stat-label">Primera fase</div>
                            </div>
                            <div className="stat">
                                <div className="stat-number">500%</div>
                                <div className="stat-label">Más visibilidad</div>
                            </div>
                            <div className="stat">
                                <div className="stat-number">90 días</div>
                                <div className="stat-label">Líder digital</div>
                            </div>
                        </div>
                    </div>

                    <a href="#contacto" className="cta-button" onClick={(e) => handleCTAClick(e, 'hero_button')}>
                        Solicitar Diagnóstico Gratuito
                    </a>

                </div>

                <div className="floating-card">
                    <h3><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-inline"><path d="M5 12h14M12 5l7 7-7 7"/></svg> Lista en 1 semana</h3>
                    <p>
                        Tu identidad visual, página web profesional y primeras redes sociales
                        funcionando desde el día 7.
                    </p>
                    <div className="card-feature">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-check"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg>
                        <div>
                            <span className="price-main">Desde $150.000</span>
                            <span className="price-sub">mensuales</span>
                        </div>
                    </div>
                    <a href="#planes" className="card-link" onClick={(e) => handleCTAClick(e, 'floating_card')}>
                        Ver planes →
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hero;