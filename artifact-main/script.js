/**
 * @file Main script for Artifact landing page.
 * @author Artifact AI Assistant
 * @version 3.0.0 FINAL & STABLE
 * @description This script handles all client-side interactivity, including header effects,
 * form submissions, smooth scrolling, chatbot functionality, and a dynamic particle background.
 * This version has been completely rewritten for maximum stability and robustness.
 */

// --- Main Execution ---
document.addEventListener("DOMContentLoaded", () => {
    // Each function is wrapped in a try-catch block to prevent one error from stopping others.
    try {
        setupHeaderScroll();
    } catch (e) {
        console.error("Failed to initialize Header:", e);
    }
    try {
        setupSmoothScrolling();
    } catch (e) {
        console.error("Failed to initialize Smooth Scrolling:", e);
    }
    try {
        setupContactForm();
    } catch (e) {
        console.error("Failed to initialize Contact Form:", e);
    }
    try {
        setupChatbot();
    } catch (e) {
        console.error("Failed to initialize Chatbot:", e);
    }
    try {
        setupParticleBackground();
    } catch (e) {
        console.error("Failed to initialize Particle Background:", e);
    }
});

// --- MODULE: Header Scroll Effect ---
function setupHeaderScroll() {
    const header = document.getElementById("header");
    if (!header) return;
    window.addEventListener("scroll", () => {
        header.classList.toggle("scrolled", window.scrollY > 50);
    }, { passive: true });
}

// --- MODULE: Smooth Scrolling ---
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offset = 80; // Offset for fixed header
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = targetElement.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
}

// --- MODULE: Contact Form Handler ---
function setupContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        // Basic validation and submission logic here
        const submitBtn = form.querySelector(".submit-btn");
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = "✅ ¡Enviado con éxito!";
        submitBtn.disabled = true;
        setTimeout(() => {
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 4000);
        console.log("Form submitted (simulation).");
    });
}

// --- MODULE: Chatbot ---
function setupChatbot() {
    const trigger = document.getElementById('chatbot-trigger');
    const windowEl = document.getElementById('chatbot-window');
    const closeBtn = document.getElementById('chatbot-close');
    const optionsContainer = document.getElementById('chatbot-options');
    const messagesContainer = document.getElementById('chatbot-messages');
    const input = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send');

    if (!trigger || !windowEl || !closeBtn) {
        console.error("Essential chatbot elements are missing.");
        return;
    }

    const responses = {
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
            message: '👨‍💼 Claro, contáctanos: <br>📞 +56 9 1234 5678 <br>📧 contacto@artifact.cl',
        }
    };

    const addMessage = (text, type) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${type}`;
        msgDiv.innerHTML = text;
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    trigger.addEventListener('click', () => windowEl.classList.add('active'));
    closeBtn.addEventListener('click', () => windowEl.classList.remove('active'));

    optionsContainer.addEventListener('click', (e) => {
        const option = e.target.closest('.chatbot-option');
        if (!option) return;
        
        const responseKey = option.dataset.response;
        const userMessage = option.querySelector('span').textContent;
        addMessage(userMessage, 'user');
        
        setTimeout(() => {
            const botResponse = responses[responseKey];
            if (botResponse) {
                addMessage(botResponse.message, 'bot');
            }
        }, 500);
    });

    const handleSendMessage = () => {
        const text = input.value.trim();
        if (text) {
            addMessage(text, 'user');
            input.value = '';
            setTimeout(() => addMessage("Gracias por tu mensaje. Un especialista lo revisará pronto.", 'bot'), 600);
        }
    };
    
    sendBtn.addEventListener('click', handleSendMessage);
    input.addEventListener('keypress', (e) => e.key === 'Enter' && handleSendMessage());
}

// --- MODULE: Particle Background ---
function setupParticleBackground() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleConfig = {
        amount: 50,
        color: "rgba(0, 255, 127, 0.5)",
        lineColor: "rgba(0, 255, 127, 0.1)",
        linkRadius: 200,
    };

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.radius = Math.random() * 2 + 1;
            this.speed = Math.random() * 0.5 + 0.2;
            this.angle = Math.random() * 2 * Math.PI;
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;
        }
        draw() {
            ctx.fillStyle = particleConfig.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
    }

    const createParticles = () => {
        particles = [];
        for (let i = 0; i < particleConfig.amount; i++) {
            particles.push(new Particle());
        }
    };

    const drawLinks = () => {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                if (dist < particleConfig.linkRadius) {
                    ctx.strokeStyle = particleConfig.lineColor;
                    ctx.lineWidth = 1 - dist / particleConfig.linkRadius;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    };

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawLinks();
        requestAnimationFrame(animate);
    };

    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });

    resizeCanvas();
    createParticles();
    animate();
}
