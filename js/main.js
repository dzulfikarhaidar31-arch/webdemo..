/* =============================================
   IMA SC TELKOM UNIVERSITY — MAIN JS
   ============================================= */

// ---- CUSTOM CURSOR REMOVED ----

// ---- NAVBAR SCROLL ----
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// ---- HAMBURGER MENU ----
const hamburger = document.querySelector('.hamburger');
const navMobile = document.querySelector('.nav-mobile');

if (hamburger && navMobile) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMobile.classList.toggle('open');
  });
}

// ---- ACTIVE NAV LINK ----
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ---- SCROLL REVEAL ----
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ---- COUNTER ANIMATION ----
function animateCounter(el, target, suffix = '', duration = 2000) {
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(start + (target - start) * eased);
    el.textContent = value + suffix;

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const counters = document.querySelectorAll('[data-counter]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = 'true';
      const target  = parseInt(entry.target.dataset.counter);
      const suffix  = entry.target.dataset.suffix || '';
      animateCounter(entry.target, target, suffix);
    }
  });
}, { threshold: 0.5 });

counters.forEach(el => counterObserver.observe(el));

// ---- HERO PARTICLE CANVAS ----
const canvas = document.getElementById('hero-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resizeCanvas() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() { this.reset(); }

    reset() {
      this.x     = Math.random() * canvas.width;
      this.y     = Math.random() * canvas.height;
      this.size  = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      const colors = ['rgba(232,119,34,', 'rgba(192,57,43,', 'rgba(255,180,80,'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width ||
          this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.opacity + ')';
      ctx.fill();
    }
  }

  // Initialize particles
  for (let i = 0; i < 120; i++) {
    particles.push(new Particle());
  }

  function drawConnections() {
    particles.forEach((p1, i) => {
      particles.slice(i + 1, i + 6).forEach(p2 => {
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(232,119,34,${0.05 * (1 - dist/100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animId = requestAnimationFrame(animate);
  }
  animate();
}

// ---- TYPEWRITER EFFECT ----
function typewriter(el, texts, speed = 80, pause = 2000) {
  if (!el) return;
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentText = texts[textIndex];

    if (isDeleting) {
      el.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = speed;

    if (!isDeleting && charIndex === currentText.length) {
      delay = pause;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
}

const typeEl = document.querySelector('.typewriter-text');
if (typeEl) {
  typewriter(typeEl, [
    '#LongLiveIMA',
    'Where Leaders Are Made',
    'Ignite Your Potential',
    'Indonesia Marketing Association'
  ]);
}

// ---- PROGRAM FILTER ----
const filterBtns = document.querySelectorAll('.filter-btn');
const programCards = document.querySelectorAll('.program-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    programCards.forEach(card => {
      const divisions = card.dataset.division || 'all';

      if (filter === 'all' || divisions.includes(filter)) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeInCard 0.4s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ---- SMOOTH SCROLL TO SECTIONS ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Close mobile nav if open
      if (navMobile) navMobile.classList.remove('open');
      if (hamburger) hamburger.classList.remove('open');
    }
  });
});

// ---- TICKER DUPLICATE ----
const tickerTrack = document.querySelector('.ticker-track');
if (tickerTrack) {
  const clone = tickerTrack.innerHTML;
  tickerTrack.innerHTML += clone;
}

// ---- SCROLL TO TOP (scroll indicator) ----
const scrollIndicator = document.querySelector('.hero-scroll-indicator');
if (scrollIndicator) {
  scrollIndicator.addEventListener('click', () => {
    const nextSection = document.querySelector('.about-ima, .story-section, .socials-section, .programs-section');
    if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth' });
  });
}

// ---- EASTER EGG: Click logo 5 times ----
const logoEl = document.querySelector('.nav-logo');
if (logoEl) {
  let logoClicks = 0;
  let logoTimer;

  logoEl.addEventListener('click', (e) => {
    e.preventDefault();
    logoClicks++;
    clearTimeout(logoTimer);

    if (logoClicks >= 5) {
      logoClicks = 0;
      showEasterEgg();
    }

    logoTimer = setTimeout(() => { logoClicks = 0; }, 3000);
  });
}

function showEasterEgg() {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    background: rgba(0,0,0,0.9);
    backdrop-filter: blur(10px);
    animation: fadeIn 0.3s ease;
    cursor: pointer;
  `;
  overlay.innerHTML = `
    <div style="text-align:center; animation: scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1);">
      <div style="font-size:5rem; margin-bottom:16px;">🔥</div>
      <div style="font-family:'Outfit',sans-serif; font-size:2.5rem; font-weight:900;
                  background:linear-gradient(90deg,#E87722,#C0392B);
                  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
                  background-clip:text;">
        #LongLiveIMA
      </div>
      <div style="font-family:'Inter',sans-serif; color:#888; margin-top:12px; font-size:1rem;">
        Kamu menemukan easter egg rahasia! 🎉
      </div>
      <div style="font-family:'Space Grotesk',sans-serif; color:#F5F0EB; margin-top:8px; font-size:0.9rem; opacity:0.7;">
        Klik di mana saja untuk menutup
      </div>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
    @keyframes scaleIn { from { transform:scale(0.5); opacity:0 } to { transform:scale(1); opacity:1 } }
  `;
  document.head.appendChild(style);
  document.body.appendChild(overlay);
  overlay.addEventListener('click', () => overlay.remove());
}
