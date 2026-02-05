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
        const invaderSize = 20; // Size of each pixel/block (scaled)
        const gap = 20;

        // Pixel art definition (5x8 grid approx)
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

        // Classic Space Invader (Crab)
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
                ctx.fillStyle = "rgba(0, 224, 116, 0.15)"; // Low opacity brand green

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

        let direction = 1;
        let stepX = 0.5;
        let stepY = 0;

        const initInvaders = () => {
            invaders = [];
            const cols = Math.floor(canvas.width / 60);
            const rows = Math.floor(canvas.height / 60);

            // Create a sparse grid
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    if (Math.random() > 0.85) { // Only fill 15% of grid for subtle effect
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

            // Move block logic
            // We'll just make them drift slowly for a background effect
            // "Space Invaders" usually move in a block, but for a BG, drift is nicer

            invaders.forEach(invader => {
                invader.y += 0.2; // Fall down slowly like a matrix/invader hybrid
                if (invader.y > canvas.height) {
                    invader.y = -50;
                    invader.x = Math.random() * canvas.width;
                }
                invader.draw();
            });

            // Optional: Draw a "laser" occasionally
            if (Math.random() > 0.98) {
                ctx.fillStyle = "rgba(0, 224, 116, 0.1)";
                const x = Math.random() * canvas.width;
                ctx.fillRect(x, 0, 2, canvas.height);
            }

            tick++;
            if (tick % 30 === 0) {
                // Animation frame for invader movement (arms up/down) could go here
            }

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
            {/* Scanline effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_4px,3px_100%] pointer-events-none opacity-20"></div>
        </div>
    );
};

export default SpaceInvadersBackground;
