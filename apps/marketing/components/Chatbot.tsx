"use client";

import React, { useState, useRef, useEffect } from 'react';

interface Message {
    text: string;
    type: 'user' | 'bot';
}

const TypingIndicator = () => (
    <div className="message bot typing-indicator">
        <span></span>
        <span></span>
        <span></span>
    </div>
);

const Chatbot = () => {
    const chatwootToken = process.env.NEXT_PUBLIC_CHATWOOT_TOKEN;
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Load Chatwoot Script
    useEffect(() => {
        if (chatwootToken && isMounted) {
            // @ts-ignore
            (function (d, t) {
                var BASE_URL = process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL || "https://chat.artifact.cl";
                var g = d.createElement(t) as HTMLScriptElement;
                var s = d.getElementsByTagName(t)[0] as HTMLScriptElement;
                g.src = BASE_URL + "/packs/js/sdk.js";
                g.defer = true;
                g.async = true;
                if (s && s.parentNode) s.parentNode.insertBefore(g, s);
                g.onload = function () {
                    // @ts-ignore
                    window.chatwootSDK.run({
                        websiteToken: chatwootToken,
                        baseUrl: BASE_URL
                    })
                }
            })(document, "script");
        }
    }, [chatwootToken, isMounted]);

    // State for Mock Chatbot
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [showOptions, setShowOptions] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isTyping]);

    // Staggered welcome messages on open (Mock Mode only)
    useEffect(() => {
        if (isOpen && !chatwootToken) {
            setMessages([]); // Clear previous conversation
            setShowOptions(true);
            setIsTyping(true);
            setTimeout(() => {
                setMessages(prev => [...prev, { text: '¡Hola! 👋 Soy el asistente virtual de Artifact.', type: 'bot' }]);
                setIsTyping(false);
            }, 800);
            setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                    setMessages(prev => [...prev, { text: '¿En qué puedo ayudarte hoy?', type: 'bot' }]);
                    setIsTyping(false);
                }, 800);
            }, 1200);
        }
    }, [isOpen, chatwootToken]);

    if (chatwootToken) {
        return null; // Chatwoot renders its own launcher
    }

    const responses: { [key: string]: { message: string } } = {
        'quiero-diagnostico': {
            message: '🎯 ¡Excelente! Nuestro diagnóstico gratuito incluye análisis de competencia, auditoría de tu presencia online y una hoja de ruta estratégica. ¿Cuál es el nombre de tu negocio?',
        },
        'conocer-precios': {
            message: '💰 Nuestros planes son: <br><br>🚀 <strong>DESPEGUE:</strong> $150.000/mes <br>📈 <strong>CONSOLIDA:</strong> $350.000/mes <br>👑 <strong>LIDERA:</strong> Personalizado',
        },
        'como-funciona': {
            message: '⚡ Es simple: <br>1. Diagnosticamos y creamos la estrategia. <br>2. Implementamos tu presencia digital. <br>3. Optimizamos para el crecimiento continuo.',
        },
        'hablar-humano': {
            message: '👨‍💼 Claro, puedes escribirnos a nuestro correo: <br>📧 artifact@artifact.cl',
        }
    };

    const addMessage = (text: string, type: 'user' | 'bot') => {
        setMessages(prev => [...prev, { text, type }]);
    };

    const handleBotResponse = (responseKey: string) => {
        setIsTyping(true);
        setShowOptions(false);
        setTimeout(() => {
            const botResponse = responses[responseKey];
            if (botResponse) {
                addMessage(botResponse.message, 'bot');
            }
            setIsTyping(false);
        }, 1200);
    };

    const handleOptionClick = (responseKey: string, userMessage: string) => {
        addMessage(userMessage, 'user');
        handleBotResponse(responseKey);
    };

    const handleSendMessage = () => {
        if (inputValue.trim()) {
            addMessage(inputValue, 'user');
            setInputValue('');
            setIsTyping(true);
            setShowOptions(false);
            setTimeout(() => {
                addMessage("Gracias por tu mensaje. Un especialista lo revisará pronto.", 'bot');
                setIsTyping(false);
            }, 1200);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="chatbot-container">
            <button className="chatbot-trigger" onClick={() => setIsOpen(!isOpen)} title="Abrir chat de IA">
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                ) : (
                    <svg className="chatbot-icon-open" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>
                )}
            </button>
            <div className={`chatbot-window ${isOpen ? 'active' : ''}`} id="chatbot-window">
                <div className="chatbot-header">
                    <div className="header-content">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path></svg>
                        <div className="header-text">
                            <div className="header-title">ArtifactBot</div>
                            <div className="header-subtitle">Te ayudo a digitalizar tu negocio</div>
                        </div>
                    </div>
                    <button className="chatbot-close" onClick={() => setIsOpen(false)} title="Cerrar chat">✕</button>
                </div>
                <div className="chatbot-messages" id="chatbot-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.type}`} dangerouslySetInnerHTML={{ __html: msg.text }}></div>
                    ))}
                    {isTyping && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                </div>

                {showOptions && (
                    <div className="chatbot-options" id="chatbot-options">
                        <button className="chatbot-option" onClick={() => handleOptionClick('quiero-diagnostico', 'Quiero un diagnóstico gratuito')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                            <span>Quiero un diagnóstico gratuito</span>
                        </button>
                        <button className="chatbot-option" onClick={() => handleOptionClick('conocer-precios', 'Conocer precios y planes')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="m3.3 7 8.7 5 8.7-5"></path><path d="M12 22V12"></path></svg>
                            <span>Conocer precios y planes</span>
                        </button>
                        <button className="chatbot-option" onClick={() => handleOptionClick('como-funciona', '¿Cómo funciona la metodología?')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                            <span>¿Cómo funciona la metodología?</span>
                        </button>
                        <button className="chatbot-option" onClick={() => handleOptionClick('hablar-humano', 'Hablar con un especialista')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            <span>Hablar con un especialista</span>
                        </button>
                    </div>
                )}

                <div className="chatbot-input">
                    <input
                        type="text"
                        id="chatbot-input"
                        placeholder="Escribe tu mensaje..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        aria-label="Entrada de mensaje del chat"
                    />
                    <button id="chatbot-send" aria-label="Enviar mensaje" onClick={handleSendMessage}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
