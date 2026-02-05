"use client";

import React, { useEffect, useRef } from 'react';

const SpaceInvadersBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let invaders: Invader[] = [];

        // Pixel art definition
        // 5x3 Grid concept scaled up
        const invaderShape1 = [
            [0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 0, 1, 1, 1, 0],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 1, 1, 1, 1, 1, 1],
            [1, 0, 1, 0, 0, 0, 0, 1],
            [0, 0, 0, 1, 1, 0, 1, 1]
        ];

        const crabShape = [
            [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
            [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0]
        ];

        const squidShape = [
            [0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 1, 1, 1, 1, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 0],
            [1, 1, 0, 1, 1, 0, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 1, 0, 0, 1, 0, 0],
            [0, 1, 0, 1, 1, 0, 1, 0],
            [1, 0, 1, 0, 0, 1, 0, 1]
        ];

        const shapes = [crabShape, squidShape];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initInvaders();
        };

        class Invader {
            x: number;
            y: number;
            shape: number[][];
            type: number;
            scale: number;

            constructor(x: number, y: number, type: number) {
                this.x = x;
                this.y = y;
                this.type = type;
                this.shape = shapes[type % shapes.length];
                this.scale = 2; // Pixel scale
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = "rgba(0, 224, 116, 0.15)";

                for (let r = 0; r < this.shape.length; r++) {
                    for (let c = 0; c < this.shape[r].length; c++) {
                        if (this.shape[r][c] === 1) {
                            ctx.fillRect(
                                this.x + c * this.scale * 2,
                                this.y + r * this.scale * 2,
                                this.scale * 1.5,
                                this.scale * 1.5
                            );
                        }
                    }
                }
            }
        }

        const initInvaders = () => {
            invaders = [];
            const cols = Math.floor(canvas.width / 60);
            const rows = Math.floor(canvas.height / 60);

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    if (Math.random() > 0.85) {
                        invaders.push(new Invader(c * 60, r * 60, Math.floor(Math.random() * 2)));
                    }
                }
            }
        };

        let animationFrameId: number;
        let tick = 0;

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            invaders.forEach(invader => {
                invader.y += 0.2;
                if (invader.y > canvas.height) {
                    invader.y = -50;
                    invader.x = Math.random() * canvas.width;
                }
                invader.draw();
            });

            if (Math.random() > 0.98) {
                ctx.fillStyle = "rgba(0, 224, 116, 0.1)";
                const x = Math.random() * canvas.width;
                ctx.fillRect(x, 0, 2, canvas.height);
            }

            tick++;
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            resizeCanvas();
        };

        window.addEventListener('resize', handleResize);

        resizeCanvas();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none bg-black">
            <canvas ref={canvasRef} className="w-full h-full opacity-60"></canvas>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_4px,3px_100%] pointer-events-none opacity-20"></div>
        </div>
    );
};

export default SpaceInvadersBackground;
