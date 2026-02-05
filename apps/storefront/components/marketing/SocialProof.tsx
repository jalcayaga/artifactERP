import React from 'react';

const SocialProof = () => {
    return (
        <section className="social-proof">
            <div className="container">
                <h2 className="section-title">Resultados reales de nuestros clientes</h2>
                <div className="proof-grid">
                    <div className="proof-card">
                        <div className="proof-number">+200%</div>
                        <h4>Aumento en Reservas</h4>
                        <blockquote className="testimonial-quote">
                            "Pasamos de agendar todo por teléfono a tener la agenda online siempre llena. ¡Nos ahorraron horas de gestión!"
                        </blockquote>
                        <cite className="testimonial-author">
                            <strong>Peluquería Mary</strong>
                            <span className="location">⭐⭐⭐⭐⭐ Reñaca, Viña del Mar</span>
                        </cite>
                    </div>
                    <div className="proof-card">
                        <div className="proof-number">1 semana</div>
                        <h4>Para Estar Online</h4>
                        <blockquote className="testimonial-quote">
                            "En 7 días ya teníamos logo, página web y redes sociales funcionando. Ahora nuestros clientes compran directo por la web."
                        </blockquote>
                        <cite className="testimonial-author">
                            <strong>Ferretería Los Aromos</strong>
                            <span className="location">⭐⭐⭐⭐⭐ Centro, Concepción</span>
                        </cite>
                    </div>
                    <div className="proof-card">
                        <div className="proof-number">500%</div>
                        <h4>Más Visibilidad</h4>
                        <blockquote className="testimonial-quote">
                            "Nos llevaron de 0 a 15.000 seguidores en redes. Ahora el restaurante se llena todos los días gracias a su trabajo."
                        </blockquote>
                        <cite className="testimonial-author">
                            <strong>Restaurante El Guatón</strong>
                            <span className="location">⭐⭐⭐⭐⭐ Centro, Puerto Montt</span>
                        </cite>
                    </div>
                </div>

                <div className="highlight-box">
                    <h4>
                        🏆 Mejor que la competencia
                    </h4>
                    <p>
                        Mientras otros cobran $300K+ solo por una página web, nosotros te
                        damos el paquete completo desde $150K/mes
                    </p>
                </div>
            </div>
        </section>
    );
};

export default SocialProof;
