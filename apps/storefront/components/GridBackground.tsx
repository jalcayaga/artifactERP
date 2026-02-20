"use client";

import React, { useEffect, useRef } from 'react';

const GridBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let offset = 0;
        const gridSize = 40;

        const drawGrid = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Subtle sky blue grid
            ctx.strokeStyle = "rgba(14, 165, 233, 0.2)";
            ctx.lineWidth = 1.5;

            ctx.beginPath();

            // Vertical lines
            for (let x = offset % gridSize; x < canvas.width; x += gridSize) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
            }

            // Horizontal lines
            for (let y = offset % gridSize; y < canvas.height; y += gridSize) {
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
            }

            ctx.stroke();

            // Subtle green crosshairs/dots at intersections for tech feel
            ctx.fillStyle = "rgba(0, 224, 116, 0.8)";
            for (let x = offset % gridSize; x < canvas.width; x += gridSize) {
                for (let y = offset % gridSize; y < canvas.height; y += gridSize) {
                    if ((x + y) % (gridSize * 3) === 0) {
                        ctx.beginPath();
                        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
        };

        const init = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            drawGrid();
        };

        const animate = () => {
            offset -= 0.15; // Very slow, elegant movement
            drawGrid();
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
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full opacity-100"></canvas>
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/80 pointer-events-none" />
        </div>
    );
};

export default GridBackground;
