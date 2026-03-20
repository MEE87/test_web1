/* ===== CURSOR GLOW ===== */
const glow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

/* ===== SCROLL REVEAL (IntersectionObserver) ===== */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ===== HERO CANVAS (repulsion particles) ===== */
(function() {
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles;
  let mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); init(); });
  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  function init() {
    particles = Array.from({ length: 180 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.2,
    }));
  }
  init();

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      // Repulsion from mouse
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        p.vx += (dx / dist) * force * 0.8;
        p.vy += (dy / dist) * force * 0.8;
      }

      // Damping
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.x += p.vx;
      p.y += p.vy;

      // Wrap
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,107,74,${p.alpha})`;
      ctx.fill();
    });

    // Connect nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 90) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255,107,74,${(1 - d / 90) * 0.15})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ===== TYPEWRITER ===== */
(function() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const phrases = ['WEB ANIMATIONS', '動態網頁設計', 'CSS @keyframes', 'Canvas API', 'IntersectionObserver'];
  let pi = 0, ci = 0, deleting = false;

  function type() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) {
        deleting = true;
        setTimeout(type, 1600);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 50 : 90);
  }
  setTimeout(type, 800);
})();

/* ===== WAVE TEXT ===== */
(function() {
  const el = document.getElementById('waveText');
  if (!el) return;
  const text = el.textContent;
  el.innerHTML = text.split('').map((ch, i) =>
    ch === ' '
      ? '<span style="display:inline-block;width:0.4em">&nbsp;</span>'
      : `<span style="animation-delay:${i * 0.08}s">${ch}</span>`
  ).join('');
})();

/* ===== PARALLAX ===== */
(function() {
  const back = document.getElementById('layerBack');
  const mid  = document.getElementById('layerMid');

  function onScroll() {
    const section = document.querySelector('.parallax-section');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const progress = -rect.top;
    if (back) back.style.transform = `translateY(${progress * 0.1}px)`;
    if (mid)  mid.style.transform  = `translateY(${progress * 0.25}px)`;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ===== INTERACTIVE PARTICLE CANVAS ===== */
(function() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles;
  let mouse = { x: -9999, y: -9999 };

  function resize() {
    const section = canvas.parentElement;
    W = canvas.width  = section.offsetWidth;
    H = canvas.height = section.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); init(); });

  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  const COLORS = ['#ff6b4a', '#7c4dff', '#00e5ff', '#ffffff'];

  function init() {
    particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      ox: 0, oy: 0,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 3 + 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.6 + 0.3,
    }));
  }
  init();

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const repulse = 140;

      if (dist < repulse) {
        const force = (repulse - dist) / repulse;
        p.vx -= (dx / dist) * force * 1.5;
        p.vy -= (dy / dist) * force * 1.5;
      }

      p.vx *= 0.94;
      p.vy *= 0.94;
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      // Glow
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace(')', `,${p.alpha})`).replace('rgb', 'rgba').replace('#', '');
      // Use hex with alpha approach
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ===== PHOTO GALLERY — lightbox ===== */
(function() {
  const items = document.querySelectorAll('.gallery-item');
  const overlay = document.getElementById('lightboxOverlay');
  const lbImg   = document.getElementById('lightboxImg');
  const lbClose = document.getElementById('lightboxClose');
  const lbPrev  = document.getElementById('lightboxPrev');
  const lbNext  = document.getElementById('lightboxNext');
  if (!overlay) return;

  let current = 0;
  const srcs = Array.from(items).map(el => el.querySelector('img').src);

  function open(idx) {
    current = idx;
    lbImg.src = srcs[current];
    lbImg.style.opacity = '0';
    overlay.classList.add('active');
    setTimeout(() => { lbImg.style.opacity = '1'; }, 50);
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showIdx(idx) {
    current = (idx + srcs.length) % srcs.length;
    lbImg.style.opacity = '0';
    setTimeout(() => {
      lbImg.src = srcs[current];
      lbImg.style.opacity = '1';
    }, 200);
  }

  items.forEach((item, i) => item.addEventListener('click', () => open(i)));
  lbClose.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  lbPrev.addEventListener('click', () => showIdx(current - 1));
  lbNext.addEventListener('click', () => showIdx(current + 1));

  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') showIdx(current - 1);
    if (e.key === 'ArrowRight') showIdx(current + 1);
  });
})();
