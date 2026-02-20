"use client";

import React, { useEffect, useRef } from 'react';

const SpaceInvadersBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        let invaders: any[] = [];
        const invaderScale = 2;
        const invaderWidth = 11 * invaderScale * 2;
        const invaderHeight = 8 * invaderScale * 2;
        const hGap = 40;
        const vGap = 40;

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

        class Invader {
            x: number; y: number; shape: number[][]; scale: number;
            constructor(x: number, y: number) {
                this.x = x; this.y = y; this.shape = crabShape; this.scale = invaderScale;
            }
            draw() {
                if (!ctx) return;
                ctx.fillStyle = "rgba(0, 224, 116, 0.12)";
                for (let r = 0; r < this.shape.length; r++) {
                    for (let c = 0; c < this.shape[r].length; c++) {
                        if (this.shape[r][c] === 1) {
                            ctx.fillRect(this.x + c * this.scale * 2, this.y + r * this.scale * 2, this.scale * 1.5, this.scale * 1.5);
                        }
                    }
                }
            }
        }

        let direction = 1; let speed = 1.3;

        const init = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            invaders = [];
            const cols = Math.floor(canvas.width / (invaderWidth + hGap));
            const startX = (canvas.width - (cols * (invaderWidth + hGap))) / 2;
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < cols; c++) {
                    if (Math.random() > 0.2) {
                        invaders.push(new Invader(startX + c * (invaderWidth + hGap), 50 + r * (invaderHeight + vGap)));
                    }
                }
            }
        };

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            let hitEdge = false;
            invaders.forEach(invader => { invader.x += speed * direction; });
            for (const invader of invaders) {
                if ((direction === 1 && invader.x + invaderWidth > canvas.width) || (direction === -1 && invader.x < 0)) { hitEdge = true; break; }
            }
            if (hitEdge) {
                direction *= -1;
                invaders.forEach(invader => { invader.y += 20; if (invader.y > canvas.height) invader.y = -50; });
            }
            invaders.forEach(invader => invader.draw());

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => { init(); };
        window.addEventListener('resize', handleResize);
        init();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none bg-black">
            <canvas ref={canvasRef} className="w-full h-full opacity-50"></canvas>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_4px,3px_100%] pointer-events-none opacity-20"></div>
        </div>
    );
};

export default SpaceInvadersBackground;
