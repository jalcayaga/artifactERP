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
        const invaderScale = 2; // Pixel scale
        const invaderWidth = 11 * invaderScale * 2; // Approx width
        const invaderHeight = 8 * invaderScale * 2; // Approx height
        const hGap = 40;
        const vGap = 40;

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
                this.scale = invaderScale;
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

        let direction = 1; // 1 = right, -1 = left
        let speed = 1.5;   // Horizontal speed

        const initInvaders = () => {
            invaders = [];
            const cols = Math.floor(canvas.width / (invaderWidth + hGap));
            const rows = Math.min(6, Math.floor(canvas.height / 3 / (invaderHeight + vGap))); // Limit rows to not overfill

            // Create a structured fleet
            const startX = (canvas.width - (cols * (invaderWidth + hGap))) / 2;

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    // 80% chance to exist, gaps make it look 'damaged' or interesting
                    if (Math.random() > 0.2) {
                        const type = r % 2; // Alternating rows
                        const x = startX + c * (invaderWidth + hGap);
                        const y = 50 + r * (invaderHeight + vGap);
                        invaders.push(new Invader(x, y, type));
                    }
                }
            }
        };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initInvaders();
        };

        let animationFrameId: number;

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            let hitEdge = false;

            // Update positions
            invaders.forEach(invader => {
                invader.x += speed * direction;
            });

            // Check boundaries
            for (const invader of invaders) {
                if ((direction === 1 && invader.x + invaderWidth > canvas.width) ||
                    (direction === -1 && invader.x < 0)) {
                    hitEdge = true;
                    break;
                }
            }

            if (hitEdge) {
                direction *= -1;
                invaders.forEach(invader => {
                    invader.y += 20; // Drop down
                });
            }

            // Draw
            invaders.forEach(invader => {
                // Reset if they fall too far (infinite loop effect)
                if (invader.y > canvas.height + 50) {
                    invader.y = -50;
                }
                invader.draw();
            });

            // Occasional "Laser" effect (Alien shooting down)
            if (Math.random() > 0.97 && invaders.length > 0) {
                const shooter = invaders[Math.floor(Math.random() * invaders.length)];
                ctx.fillStyle = "rgba(0, 224, 116, 0.1)";
                ctx.fillRect(shooter.x + invaderWidth / 2, shooter.y + invaderHeight, 2, canvas.height);
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', handleResize);
        function handleResize() { resizeCanvas(); }

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
