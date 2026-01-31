"use client";

import React, { useState } from 'react';

const Contact = () => {
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());
        const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

        if (webhookUrl) {
            try {
                // Determine origin (Landing vs Other)
                const payload = {
                    ...data,
                    source: 'artifact.cl',
                    timestamp: new Date().toISOString()
                };

                // Send to n8n (no-cors mode might be needed if n8n not configured for CORS, but standard POST is better for data)
                // Assuming n8n returns 200 OK.
                await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            } catch (err) {
                console.error("Error sending lead to n8n", err);
            }
        } else {
            console.warn("NEXT_PUBLIC_N8N_WEBHOOK_URL not configured");
        }

        // Always show success to user
        setSubmitStatus('success');

        // @ts-ignore
        if (typeof trackFormSubmit !== 'undefined') trackFormSubmit();

        setTimeout(() => {
            (e.target as HTMLFormElement).reset();
            setSubmitStatus('idle');
        }, 4000);
    };

    return (
        <section className="contact" id="contacto">
            <div className="container">
                <h2 className="section-title">¿Listo para digitalizar tu MicroPyME?</h2>
                <div className="contact-content">
                    <div>
                        <h3 style={{ fontSize: '1.8rem', marginBottom: '20px', color: '#00ff7f' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-inline"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg> Diagnóstico gratuito de 45 minutos
                        </h3>
                        <p className="section-subtitle" style={{ textAlign: 'left', margin: '0 0 30px 0' }}>
                            Analizamos tu negocio actual y te mostramos el plan exacto para
                            convertirte en líder digital de tu rubro. Sin compromisos.
                        </p>

                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg>
                            </div>
                            <div>
                                <strong>Análisis de competencia digital</strong><br />
                                <span>Vemos qué están haciendo mal tus competidores y cómo superarlos</span>
                            </div>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg>
                            </div>
                            <div>
                                <strong>Hoja de ruta personalizada</strong><br />
                                <span>Plan paso a paso adaptado a tu presupuesto y objetivos específicos</span>
                            </div>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg>
                            </div>
                            <div>
                                <strong>Proyección de crecimiento</strong><br />
                                <span>Te calculamos cuántos clientes nuevos puedes ganar en 90 días</span>
                            </div>
                        </div>

                        <div className="highlight-box" style={{ textAlign: 'left', marginTop: '25px' }}>
                            <strong>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-inline"><path d="M5 12h14M12 5l7 7-7 7" /></svg> Si decides avanzar, comenzamos esta misma semana
                            </strong><br />
                            <span>
                                No esperamos meses. Tu transformación digital empieza YA.
                            </span>
                        </div>
                    </div>

                    <form className="contact-form" id="contactForm" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre completo *</label>
                            <input type="text" id="nombre" name="nombre" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email *</label>
                            <input type="email" id="email" name="email" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="telefono">WhatsApp *</label>
                            <input type="tel" id="telefono" name="telefono" placeholder="+56 9 XXXX XXXX" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="negocio">Tipo de negocio</label>
                            <select id="negocio" name="negocio">
                                <option value="">Selecciona tu rubro</option>
                                <option value="retail">Retail / Tienda</option>
                                <option value="servicios">Servicios profesionales</option>
                                <option value="restaurante">Restaurante / Comida</option>
                                <option value="belleza">Peluquería / Estética</option>
                                <option value="textil">Ropa / Textil</option>
                                <option value="ferreteria">Ferretería / Construcción</option>
                                <option value="otro">Otro</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="objetivo">¿Cuál es tu principal objetivo?</label>
                            <textarea id="objetivo" name="objetivo" rows={3} placeholder="Ej: Necesito más clientes, quiero vender online, no tengo tiempo para las redes sociales..."></textarea>
                        </div>
                        <button type="submit" className="submit-btn" disabled={submitStatus === 'success'}>
                            {submitStatus === 'success' ? '✅ ¡Enviado con éxito!' :
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                    Solicitar Diagnóstico GRATUITO
                                </>
                            }
                        </button>
                        <p style={{ fontSize: '0.9rem', color: '#999', textAlign: 'center', marginTop: '15px' }}>
                            ✅ Te contactaremos en menos de 2 horas para agendar
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
