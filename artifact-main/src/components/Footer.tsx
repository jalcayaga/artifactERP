import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-column">
                        <a href="#" className="logo">
                            <svg className="logo-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                            <span className="logo-text">Artifact</span>
                        </a>
                        <p className="footer-tagline">Digitalizando tu MicroPyME paso a paso.</p>
                        <div className="social-icons">
                            <a href="#" aria-label="Instagram" title="Instagram">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                            </a>
                            <a href="#" aria-label="Facebook" title="Facebook">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                            </a>
                            <a href="#" aria-label="LinkedIn" title="LinkedIn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                            </a>
                        </div>
                    </div>
                    <div className="footer-column">
                        <h4>Navegación</h4>
                        <ul>
                            <li><a href="#servicios">Servicios</a></li>
                            <li><a href="#proceso">¿Cómo Funciona?</a></li>
                            <li><a href="#planes">Planes</a></li>
                            <li><a href="#contacto">Contacto</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Contacto</h4>
                        <p>Santiago, Chile</p>
                        <p><a href="mailto:artifact@artifact.cl">artifact@artifact.cl</a></p>
                    </div>
                    <div className="footer-column">
                        <h4>Legal</h4>
                        <ul>
                            <li><a href="#">Política de Privacidad</a></li>
                            <li><a href="#">Términos de Servicio</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Artifact. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;