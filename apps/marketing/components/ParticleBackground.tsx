"use client";

import React, { useEffect, useRef } from 'react';

const ParticleBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particles: Particle[] = [];
        const particleConfig = {
            amount: 40,
            color: "rgba(0, 255, 127, 0.4)",
            lineColor: "rgba(0, 255, 127, 0.08)",
            linkRadius: 160,
        };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Particle {
            x: number;
            y: number;
            radius: number;
            speed: number;
            angle: number;
            vx: number;
            vy: number;

            constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                this.radius = Math.random() * 1.5 + 0.5;
                this.speed = Math.random() * 0.4 + 0.1;
                this.angle = Math.random() * 2 * Math.PI;
                this.vx = Math.cos(this.angle) * this.speed;
                this.vy = Math.sin(this.angle) * this.speed;
            }
            draw() {
                if (!ctx) return;
                ctx.fillStyle = particleConfig.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;
            }
        }

        const createParticles = () => {
            particles = [];
            for (let i = 0; i < particleConfig.amount; i++) {
                particles.push(new Particle());
            }
        };

        const drawLinks = () => {
            if (!ctx) return;
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

        let animationFrameId: number;
        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            drawLinks();
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            resizeCanvas();
            createParticles();
        };

        window.addEventListener('resize', handleResize);

        resizeCanvas();
        createParticles();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="animated-background">
            <canvas ref={canvasRef} id="particle-canvas"></canvas>
        </div>
    );
};

export default ParticleBackground;
