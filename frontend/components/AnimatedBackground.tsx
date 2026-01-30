'use client'
// frontend/components/AnimatedBackground.tsx
import React, { useRef, useEffect } from 'react'

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()

    // Get colors from CSS variables
    const style = getComputedStyle(document.documentElement)
    const primaryColor = `hsl(${style.getPropertyValue('--primary').trim()})`
    const whiteColor = '#FFFFFF' // Explicitly white
    const cyanColor = `hsl(${style.getPropertyValue('--cyan').trim()})`

    class Shape {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      color: string
      type: 'square' | 'circle' | 'spiral'
      angle: number
      rotationSpeed: number
      canvas: HTMLCanvasElement // Add canvas property

      constructor(
        x: number,
        y: number,
        vx: number,
        vy: number,
        size: number,
        color: string,
        type: 'square' | 'circle' | 'spiral',
        canvas: HTMLCanvasElement // Accept canvas in constructor
      ) {
        this.x = x
        this.y = y
        this.vx = vx
        this.vy = vy
        this.size = size
        this.color = color
        this.type = type
        this.angle = 0
        this.rotationSpeed = (Math.random() - 0.5) * 0.02
        this.canvas = canvas // Assign canvas
      }

      draw() {
        if (!ctx) return
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)

        if (this.type === 'spiral') {
          ctx.strokeStyle = this.color
          ctx.lineWidth = 2
          ctx.beginPath()
          const a = 0
          const b = this.size / (2 * Math.PI * 4) // 4 turns
          for (let i = 0; i < 1440; i++) { // 360 * 4 = 1440
            const angleRad = (i * Math.PI) / 180 // Correctly convert to radians
            const xPos = (a + b * angleRad) * Math.cos(angleRad)
            const yPos = (a + b * angleRad) * Math.sin(angleRad)
            if (i === 0) {
              ctx.moveTo(xPos, yPos)
            } else {
              ctx.lineTo(xPos, yPos)
            }
          }
          ctx.stroke()
        } else {
          ctx.fillStyle = this.color
          ctx.beginPath()
          if (this.type === 'circle') {
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2)
          } else {
            ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size)
          }
          ctx.closePath()
          ctx.fill()
        }
        ctx.restore()
      }

      update() {
        this.x += this.vx
        this.y += this.vy
        this.angle += this.rotationSpeed

        // Wall collision
        const radius = this.size / 2
        if (this.x - radius < 0 || this.x + radius > this.canvas.width) {
          this.vx *= -1
        }
        if (this.y - radius < 0 || this.y + radius > this.canvas.height) {
          this.vy *= -1
        }
      }
    }

    const shapes: Shape[] = []

    const initShapes = () => {
      shapes.push(
        new Shape(100, 100, 0.5, 0.8, 50, primaryColor, 'square', canvas),
        new Shape(300, 200, -0.7, 0.6, 60, whiteColor, 'circle', canvas),
        new Shape(500, 400, 0.8, -0.5, 35, cyanColor, 'spiral', canvas),
        new Shape(700, 150, -0.6, -0.7, 35, whiteColor, 'spiral', canvas),
        new Shape(200, 500, 0.4, 0.9, 45, primaryColor, 'square', canvas),
        new Shape(400, 300, -0.5, -0.8, 55, cyanColor, 'circle', canvas)
      )
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < shapes.length; i++) {
        shapes[i].update()
        shapes[i].draw()

        for (let j = i + 1; j < shapes.length; j++) {
          const dx = shapes[i].x - shapes[j].x
          const dy = shapes[i].y - shapes[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const minDistance = (shapes[i].size / 2) + (shapes[j].size / 2)

          if (distance < minDistance) {
            // Resolve overlap
            const overlap = minDistance - distance
            const angle = Math.atan2(dy, dx)
            const moveX = (overlap / 2) * Math.cos(angle)
            const moveY = (overlap / 2) * Math.sin(angle)
            shapes[i].x += moveX
            shapes[i].y += moveY
            shapes[j].x -= moveX
            shapes[j].y -= moveY

            // Elastic collision response
            const sin = Math.sin(angle)
            const cos = Math.cos(angle)

            // Rotate velocities
            const vx1 = shapes[i].vx * cos + shapes[i].vy * sin
            const vy1 = shapes[i].vy * cos - shapes[i].vx * sin
            const vx2 = shapes[j].vx * cos + shapes[j].vy * sin
            const vy2 = shapes[j].vy * cos - shapes[j].vx * sin

            // Swap velocities
            const finalVx1 = vx2
            const finalVx2 = vx1

            // Rotate back
            shapes[i].vx = finalVx1 * cos - vy1 * sin
            shapes[i].vy = vy1 * cos + finalVx1 * sin
            shapes[j].vx = finalVx2 * cos - vy2 * sin
            shapes[j].vy = vy2 * cos + finalVx2 * sin
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    initShapes()
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className='absolute inset-0 z-0 bg-background'
    ></canvas>
  )
}

export default AnimatedBackground