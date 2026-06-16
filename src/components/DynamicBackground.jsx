import React, { useEffect, useRef } from 'react';

export default function DynamicBackground({ theme }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationId;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let tick = 0;
    const gridOffset = { x: 0, y: 0 };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Characters list (letters, caps, numbers, and symbols only - no word keys)
    const charsList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
    const symbolsList = '!@#$%^&*()-_=+[{]};:\'",.<>/?`~'.split('');
    const allSymbols = [...charsList, ...symbolsList];

    // Generate floating elements (increased font size from 12px-24px to 20px-45px)
    const elementsCount = Math.floor((width * height) / 24000); // adjust density since keys are larger
    const elements = [];
    for (let i = 0; i < elementsCount; i++) {
      elements.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        text: allSymbols[Math.floor(Math.random() * allSymbols.length)],
        fontSize: Math.floor(Math.random() * 25) + 20, // 20px to 45px
        alpha: Math.random() * 0.12 + 0.03, // ambient
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.002,
      });
    }

    // Generate glittering sparkles in the middle
    const sparklesCount = 50;
    const sparkles = [];
    for (let i = 0; i < sparklesCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 120;
      sparkles.push({
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        angle: angle,
        distance: radius,
        speed: Math.random() * 0.5 + 0.15,
        size: Math.random() * 2.5 + 1.2,
        alpha: Math.random(),
        alphaSpeed: Math.random() * 0.012 + 0.004,
        colorType: Math.random() > 0.45 ? 'accent' : 'white',
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      tick += 0.004;

      // 1. Draw subtle scrolling grid lines
      ctx.save();
      if (theme === 'dark') {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'; // white grid lines with 0.2 opacity
      } else {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)'; // black grid lines with 0.2 opacity
      }
      ctx.lineWidth = 1;

      const spacing = 80; // grid spacing
      // scroll grid diagonally
      gridOffset.x = (gridOffset.x + 0.15) % spacing;
      gridOffset.y = (gridOffset.y + 0.15) % spacing;

      // Vertical lines
      for (let x = gridOffset.x; x < width; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      // Horizontal lines
      for (let y = gridOffset.y; y < height; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      // 2. Draw glowing nebula/aura in the middle (with slow breathing pulse)
      const centerX = width / 2;
      const centerY = height / 2;
      
      // breathing scale multiplier
      const breatheScale = 1 + Math.sin(tick * 1.5) * 0.08;
      const radius = Math.min(width, height) * 0.38 * breatheScale;
      
      const glowGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      if (theme === 'dark') {
        glowGrad.addColorStop(0, 'rgba(34, 211, 238, 0.18)'); // soft neon teal/cyan glow
        glowGrad.addColorStop(0.5, 'rgba(139, 92, 246, 0.05)'); // space purple glow
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        glowGrad.addColorStop(0, 'rgba(6, 182, 212, 0.09)');
        glowGrad.addColorStop(0.5, 'rgba(139, 92, 246, 0.025)');
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // 3. Draw floating keys and letters (enlarged)
      elements.forEach((el) => {
        // Update position
        el.x += el.vx;
        el.y += el.vy;
        el.rotation += el.rotationSpeed;

        // Wrap around screen boundaries
        if (el.x < -80) el.x = width + 80;
        if (el.x > width + 80) el.x = -80;
        if (el.y < -80) el.y = height + 80;
        if (el.y > height + 80) el.y = -80;

        ctx.save();
        ctx.translate(el.x, el.y);
        ctx.rotate(el.rotation);
        
        // Setup font
        ctx.font = `600 ${el.fontSize}px 'Jost', sans-serif`;
        
        if (theme === 'dark') {
          // White keys with 0.2 opacity in dark mode
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'; 
        } else {
          // Black keys with 0.2 opacity in light mode
          ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; 
        }

        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText(el.text, 0, 0);
        ctx.restore();
      });

      // 4. Draw glittering sparkles in the center
      sparkles.forEach((s) => {
        s.angle += s.speed * 0.004;
        s.alpha -= s.alphaSpeed;
        
        // Reset sparkle
        if (s.alpha <= 0) {
          s.alpha = Math.random() * 0.85 + 0.15;
          s.angle = Math.random() * Math.PI * 2;
          s.distance = Math.random() * 130;
          s.speed = Math.random() * 0.5 + 0.15;
        }

        const sparkleX = centerX + Math.cos(s.angle) * s.distance;
        const sparkleY = centerY + Math.sin(s.angle) * s.distance;

        ctx.save();
        ctx.beginPath();
        
        if (theme === 'dark') {
          // Extra bright white and neon cyan sparkles in dark mode
          ctx.shadowColor = 'rgba(34, 211, 238, 0.4)';
          ctx.shadowBlur = 4;
          ctx.fillStyle = s.colorType === 'accent' ? `rgba(167, 139, 250, ${s.alpha})` : `rgba(255, 255, 255, ${s.alpha})`;
        } else {
          ctx.shadowBlur = 0;
          ctx.fillStyle = s.colorType === 'accent' ? `rgba(6, 182, 212, ${s.alpha})` : `rgba(24, 24, 27, ${s.alpha})`;
        }
        
        // Draw star diamond sparkle shape
        const r = s.size;
        ctx.moveTo(sparkleX, sparkleY - r);
        ctx.lineTo(sparkleX + r / 2, sparkleY - r / 2);
        ctx.lineTo(sparkleX + r, sparkleY);
        ctx.lineTo(sparkleX + r / 2, sparkleY + r / 2);
        ctx.lineTo(sparkleX, sparkleY + r);
        ctx.lineTo(sparkleX - r / 2, sparkleY + r / 2);
        ctx.lineTo(sparkleX - r, sparkleY);
        ctx.lineTo(sparkleX - r / 2, sparkleY - r / 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [theme]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
}
