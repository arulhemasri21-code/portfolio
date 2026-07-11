/* =============================================
   CUSTOM CURSOR WITH GLOW, TRAIL, MAGNETIC HOVER
   ============================================= */

'use strict';

(function initCustomCursor() {
  const outer = document.getElementById('cursorOuter');
  const inner = document.getElementById('cursorInner');
  const trail = document.getElementById('cursorTrail');

  if (!outer || !inner || !trail) return;

  let mouseX = 0, mouseY = 0;
  let outerX = 0, outerY = 0;
  let isHovering = false;

  // Initialize canvas trail
  const ctx = trail.getContext('2d');
  let trailParticles = [];
  let animFrameId = null;

  function resizeCanvas() {
    trail.width = window.innerWidth;
    trail.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Trail particle
  class TrailParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 4 + 2;
      this.alpha = 0.5;
      this.decay = 0.02 + Math.random() * 0.02;
      this.color = `rgba(0, 245, 255, ${this.alpha})`;
    }

    update() {
      this.alpha -= this.decay;
      this.size *= 0.98;
      this.color = `rgba(0, 245, 255, ${Math.max(this.alpha, 0)})`;
    }

    draw() {
      if (this.alpha <= 0 || this.size <= 0.1) return;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  function addTrailParticle(x, y) {
    if (isHovering) return;
    trailParticles.push(new TrailParticle(x, y));
    if (trailParticles.length > 30) trailParticles.shift();
  }

  function animateTrail() {
    ctx.clearRect(0, 0, trail.width, trail.height);

    trailParticles.forEach((p, i) => {
      p.update();
      p.draw();
      if (p.alpha <= 0 || p.size <= 0.1) {
        trailParticles.splice(i, 1);
      }
    });

    animFrameId = requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Track mouse
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Inner dot follows instantly
    inner.style.left = mouseX + 'px';
    inner.style.top = mouseY + 'px';

    // Add trail particle
    addTrailParticle(mouseX, mouseY);
  }, { passive: true });

  // Smooth follow for outer ring
  function updateOuter() {
    outerX += (mouseX - outerX) * 0.08;
    outerY += (mouseY - outerY) * 0.08;

    outer.style.left = outerX + 'px';
    outer.style.top = outerY + 'px';

    requestAnimationFrame(updateOuter);
  }
  updateOuter();

  // Hover effects on interactive elements
  const hoverTargets = 'a, button, .btn, .social-icon, .nav-link, .project-card, .skill-card, .cert-card, input, textarea, .filter-btn, .cert-view, .project-link';

  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest(hoverTargets);
    if (target) {
      isHovering = true;
      outer.classList.add('cursor-hover');
      inner.classList.add('cursor-hover');
    }
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest(hoverTargets);
    if (target) {
      isHovering = false;
      outer.classList.remove('cursor-hover');
      inner.classList.remove('cursor-hover');
    }
  }, { passive: true });

  // Magnetic hover effect on buttons
  const magneticTargets = document.querySelectorAll('.btn, .social-icon, .nav-link');
  magneticTargets.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const strength = 8;
      el.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    outer.style.opacity = '0';
    inner.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    outer.style.opacity = '1';
    inner.style.opacity = '1';
  });

  // Remove default cursor
  document.body.style.cursor = 'none';

  // Add cursor styles dynamically
  const style = document.createElement('style');
  style.textContent = `
    .cursor-outer, .cursor-inner { pointer-events: none; position: fixed; z-index: 9999; transform: translate(-50%, -50%); transition: width 0.3s, height 0.3s, border-color 0.3s, background 0.3s; }
    .cursor-outer { width: 36px; height: 36px; border-radius: 50%; border: 2px solid rgba(0, 245, 255, 0.6); background: rgba(0, 245, 255, 0.05); box-shadow: 0 0 20px rgba(0, 245, 255, 0.2), inset 0 0 20px rgba(0, 245, 255, 0.05); }
    .cursor-inner { width: 8px; height: 8px; border-radius: 50%; background: #00F5FF; box-shadow: 0 0 15px rgba(0, 245, 255, 0.8), 0 0 40px rgba(0, 245, 255, 0.4); }
    .cursor-outer.cursor-hover { width: 56px; height: 56px; border-color: rgba(0, 245, 255, 0.9); background: rgba(0, 245, 255, 0.1); box-shadow: 0 0 40px rgba(0, 245, 255, 0.4), inset 0 0 30px rgba(0, 245, 255, 0.1); }
    .cursor-inner.cursor-hover { width: 4px; height: 4px; opacity: 0.5; }
    .cursor-trail { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9998; pointer-events: none; }

    @media (max-width: 768px), (hover: none) and (pointer: coarse) {
      .cursor-outer, .cursor-inner, .cursor-trail { display: none !important; }
      body { cursor: auto !important; }
      a, button, .btn, .social-icon, .nav-link, input, textarea { cursor: pointer !important; }
    }
  `;
  document.head.appendChild(style);
})();
