import React from 'react';

const HowItWorks = () => {
    return (
        <section className="how-it-works" id="proceso">
            <div className="container">
                <h2 className="section-title">¿Cómo lo Hacemos?</h2>
                <p className="section-subtitle">
                    Un proceso transparente y colaborativo para garantizar tu éxito.
                </p>
                <div className="process-timeline">
                    <div className="process-step">
                        <div className="step-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line></svg>
                        </div>
                        <h3>1. Diagnóstico y Estrategia</h3>
                        <p>Comenzamos con una inmersión profunda en tu negocio. Analizamos tu mercado, competencia y objetivos para crear una hoja de ruta 100% personalizada.</p>
                    </div>
                    <div className="process-step">
                        <div className="step-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                        </div>
                        <h3>2. Implementación Ágil</h3>
                        <p>En sprints semanales, construimos tu presencia digital: desde el logo y la web hasta tus primeras campañas. Te mantenemos informado y partícipe en cada paso.</p>
                    </div>
                    <div className="process-step">
                        <div className="step-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                        </div>
                        <h3>3. Crecimiento y Optimización</h3>
                        <p>Una vez lanzado, nuestro trabajo es hacerte crecer. Gestionamos, medimos y optimizamos constantemente para asegurar un retorno de inversión real y sostenible.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
