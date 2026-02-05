"use client";

import React, { useState, useEffect } from 'react';
import { useBranding } from './BrandingProvider';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const config = useBranding();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const logoUrl = config?.branding?.logoUrl;
    const displayName = config?.displayName || 'Artifact';

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`} id="header">
            <div className="container">
                <nav className="nav">
                    <a href="#" className="logo" onClick={scrollToTop}>
                        {logoUrl ? (
                            <img src={logoUrl} alt={displayName} className="logo-icon h-8 w-auto" />
                        ) : (
                            <svg className="logo-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                        <span className="logo-text">{displayName}</span>
                    </a>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                        <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }} className="hidden md:flex">
                            <a href="/nosotros" style={{ fontSize: '0.9rem', fontWeight: 500, color: '#e5e5e5', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-brand">
                                Nosotros
                            </a>
                            <a href="#servicios" style={{ fontSize: '0.9rem', fontWeight: 500, color: '#e5e5e5', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-brand">
                                Servicios
                            </a>
                            <a href="#precios" style={{ fontSize: '0.9rem', fontWeight: 500, color: '#e5e5e5', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-brand">
                                Precios
                            </a>
                            <a href="#contacto" style={{ fontSize: '0.9rem', fontWeight: 500, color: '#e5e5e5', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-brand">
                                Contacto
                            </a>
                            <a
                                href={process.env.NEXT_PUBLIC_STORE_URL || "http://localhost:3001"}
                                style={{ fontSize: '0.9rem', fontWeight: 500, color: '#e5e5e5', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', transition: 'color 0.2s' }}
                                className="hover:text-brand"
                            >
                                Tienda
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                            </a>
                        </nav>
                        <div style={{ height: '20px', width: '1px', backgroundColor: 'rgba(255,255,255,0.1)', display: 'block' }} className="hidden md:block"></div>
                        <a
                            href={process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3002"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cta-button"
                            style={{ padding: '8px 24px', fontSize: '0.9rem', color: '#00ff7f', borderColor: '#00ff7f', fontWeight: 600, display: 'inline-block', textDecoration: 'none', border: '1px solid #00ff7f', borderRadius: '6px' }}
                        >
                            Ingresar
                        </a>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
