/**
 * High-Performance Particle Confetti Engine
 * Zero-dependency physics-based celebratory confetti explosion.
 */

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  aspectRatio: number;
}

const PALETTE = [
  '#6366f1', // Indigo
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#f43f5e', // Rose
];

export function triggerConfetti(originX?: number, originY?: number, particleCount = 85): void {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';

  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;

  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    document.body.removeChild(canvas);
    return;
  }
  ctx.scale(dpr, dpr);

  const startX = originX !== undefined ? originX : window.innerWidth / 2;
  const startY = originY !== undefined ? originY : window.innerHeight * 0.4;

  const particles: ConfettiParticle[] = [];

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 9;
    particles.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3.5, // Initial upward bias
      size: 6 + Math.random() * 6,
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      opacity: 1,
      aspectRatio: 0.4 + Math.random() * 0.6,
    });
  }

  let animId: number;
  const gravity = 0.28;
  const drag = 0.982;

  const updateAndDraw = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    let activeCount = 0;

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += gravity;
      p.vx *= drag;
      p.vy *= drag;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.009;

      if (p.opacity > 0 && p.y < window.innerHeight + 50) {
        activeCount++;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;

        // Draw tumbling rectangle/ribbon
        const w = p.size;
        const h = p.size * p.aspectRatio;
        ctx.fillRect(-w / 2, -h / 2, w, h);
        ctx.restore();
      }
    }

    if (activeCount > 0) {
      animId = requestAnimationFrame(updateAndDraw);
    } else {
      cancelAnimationFrame(animId);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  };

  animId = requestAnimationFrame(updateAndDraw);
}
