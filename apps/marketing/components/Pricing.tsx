import React from 'react';

const Pricing = () => {
    return (
        <section className="pricing" id="planes">
            <div className="container">
                <h2 className="section-title">Planes diseñados para cada etapa</h2>
                <p className="section-subtitle">
                    Elige el plan que se adapte a tu MicroPyME. Todos incluyen acompañamiento experto.
                </p>

                <div className="pricing-grid">
                    <div className="plan-card">
                        <h3 className="plan-title">Plan Despega</h3>
                        <div className="plan-price">$150.000 <span className="price-period">/ mes</span></div>
                        <p className="plan-description">La base para lanzar tu marca al mundo digital con una imagen profesional.</p>
                        <ul className="plan-features">
                            <li><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><path d="M20 6 9 17l-5-5" /></svg>Identidad de Marca Completa</li>
                            <li><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><path d="M20 6 9 17l-5-5" /></svg>Página Web Profesional</li>
                            <li><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><path d="M20 6 9 17l-5-5" /></svg>Creación de Redes Sociales</li>
                            <li><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><path d="M20 6 9 17l-5-5" /></svg>Hosting y Dominio .CL</li>
                        </ul>
                        <a href="/registro?plan=despega" className="plan-button">Comenzar Ahora</a>
                    </div>

                    <div className="plan-card popular">
                        <div className="popular-badge">Más Popular</div>
                        <h3 className="plan-title">Plan Consolida</h3>
                        <div className="plan-price">$350.000 <span className="price-period">/ mes</span></div>
                        <p className="plan-description">Para negocios que buscan crecer, atraer clientes y gestionar su comunidad.</p>
                        <ul className="plan-features">
                            <li><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><path d="M20 6 9 17l-5-5" /></svg>Todo lo del Plan Despega</li>
                            <li><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><path d="M20 6 9 17l-5-5" /></svg>Community Manager Dedicado</li>
                            <li><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><path d="M20 6 9 17l-5-5" /></svg>Gestión de Clientes (CRM)</li>
                            <li><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><path d="M20 6 9 17l-5-5" /></svg>Campañas en Google y Meta</li>
                        </ul>
                        <a href="/registro?plan=consolida" className="plan-button">Elegir Plan</a>
                    </div>

                    <div className="plan-card">
                        <h3 className="plan-title">Plan Lidera</h3>
                        <div className="plan-price">Personalizado</div>
                        <p className="plan-description">La solución completa para ser líder digital con e-commerce y automatización.</p>
                        <ul className="plan-features">
                            <li><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><path d="M20 6 9 17l-5-5" /></svg>Todo lo del Plan Consolida</li>
                            <li><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><path d="M20 6 9 17l-5-5" /></svg>E-commerce y POS Integrado</li>
                            <li><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><path d="M20 6 9 17l-5-5" /></svg>Automatización de Marketing</li>
                            <li><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><path d="M20 6 9 17l-5-5" /></svg>Soporte y Estrategia Prioritaria</li>
                        </ul>
                        <a href="/registro?plan=lidera" className="plan-button">Solicitar Cotización</a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
