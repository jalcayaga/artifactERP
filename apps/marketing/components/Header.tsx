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

                    <a
                        href="http://localhost:3001"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cta-button"
                        style={{ padding: '8px 20px', fontSize: '0.9rem' }}
                    >
                        Ingresar
                    </a>
                </nav>
            </div>
        </header>
    );
};

export default Header;
