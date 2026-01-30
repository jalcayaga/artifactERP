import React from 'react';

const Services = () => {
    return (
        <section className="services" id="servicios">
            <div className="container">
                <h2 className="section-title">El camino completo hacia el éxito digital</h2>
                <p className="section-subtitle">
                    No solo te damos herramientas. Te acompañamos desde que tienes solo
                    una idea hasta que eres el referente digital de tu rubro.
                </p>

                <div className="services-grid">
                    <div className="service-card">
                        <div className="service-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
                        </div>
                        <h3>Fase 1: Identidad & Presencia</h3>
                        <p>
                            Creamos tu marca desde cero: logo, colores, tipografía y página
                            web profesional que refleje la esencia de tu negocio.
                        </p>
                        <ul className="feature-list">
                            <li>Diseño de logo e identidad visual</li>
                            <li>Página web responsive optimizada</li>
                            <li>Dominio y hosting incluidos</li>
                            <li>Manual de marca completo</li>
                        </ul>
                    </div>

                    <div className="service-card">
                        <div className="service-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                        </div>
                        <h3>Fase 2: Redes & Community</h3>
                        <p>
                            Construimos y administramos tu presencia en redes sociales.
                            Creamos contenido que conecta y convierte seguidores en clientes.
                        </p>
                        <ul className="feature-list">
                            <li>Creación de perfiles optimizados</li>
                            <li>Gestión integral como Community Manager</li>
                            <li>Contenido visual y copywriting</li>
                            <li>Reportes de crecimiento mensual</li>
                        </ul>
                    </div>

                    <div className="service-card">
                        <div className="service-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                        </div>
                        <h3>Fase 3: CRM & Gestión de Clientes</h3>
                        <p>
                            Con Chatwoot centralizamos todas las conversaciones. Cada mensaje
                            de Instagram, Facebook o WhatsApp se gestiona profesionalmente.
                        </p>
                        <ul className="feature-list">
                            <li>Bandeja unificada de mensajes</li>
                            <li>Historial completo de cada cliente</li>
                            <li>Respuestas automáticas inteligentes</li>
                            <li>Métricas de atención al cliente</li>
                        </ul>
                    </div>

                    <div className="service-card">
                        <div className="service-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
                        </div>
                        <h3>Fase 4: Marketing & Crecimiento</h3>
                        <p>
                            Campañas publicitarias estratégicas en Google y Meta que generan
                            clientes reales. No gastes plata a ciegas.
                        </p>
                        <ul className="feature-list">
                            <li>Campañas de Facebook e Instagram Ads</li>
                            <li>Google Ads para búsquedas locales</li>
                            <li>Email marketing automatizado</li>
                            <li>Análisis de ROI y optimización</li>
                        </ul>
                    </div>

                    <div className="service-card">
                        <div className="service-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
                        </div>
                        <h3>Fase 5: E-commerce & POS</h3>
                        <p>
                            Tu tienda online que también funciona como POS en tu local. Vendes
                            online y presencial desde la misma plataforma.
                        </p>
                        <ul className="feature-list">
                            <li>E-commerce integrado al SII</li>
                            <li>POS para ventas en local</li>
                            <li>Inventario sincronizado</li>
                            <li>Facturación electrónica automática</li>
                        </ul>
                    </div>

                    <div className="service-card">
                        <div className="service-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                        </div>
                        <h3>Fase 6: Automatización & Escalamiento</h3>
                        <p>
                            Automatizamos todo lo repetitivo para que te enfoques en crecer.
                            Dashboard único para controlar todo tu negocio.
                        </p>
                        <ul className="feature-list">
                            <li>Workflows de marketing automatizados</li>
                            <li>Dashboard unificado de negocio</li>
                            <li>Reportes predictivos de ventas</li>
                            <li>Escalamiento sin contratar personal</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Services;
