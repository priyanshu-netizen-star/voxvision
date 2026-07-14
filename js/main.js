/* ============================================================
   VOXVISION — Ultra Crazy Main JS
   Next-Level Interactions & Animations
   ============================================================ */

'use strict';

/* ── Loading Screen ───────────────────────────────────────────── */
function hideLoader() {
  const loader = document.querySelector('.loading-screen');
  if (loader && !loader.classList.contains('hidden')) {
    loader.classList.add('hidden');
  }
}
window.addEventListener('load', () => {
  setTimeout(hideLoader, 1500);
});
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(hideLoader, 4000);
});

/* ── Progressive Enhancement & Custom Cursor Mode ───────────── */
document.documentElement.classList.add('js-active');

const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

if (cursorDot && cursorRing) {
  document.body.classList.add('has-custom-cursor');
}

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursorDot) {
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  }
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  if (cursorRing) {
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover effect on interactive elements
document.querySelectorAll('a, button, .industry-card, .service-card, .why-card, .portfolio-item, .faq-question').forEach(el => {
  el.addEventListener('mouseenter', () => { if (cursorRing) cursorRing.classList.add('hovered'); });
  el.addEventListener('mouseleave', () => { if (cursorRing) cursorRing.classList.remove('hovered'); });
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
  if (cursorDot) cursorDot.style.opacity = '0';
  if (cursorRing) cursorRing.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  if (cursorDot) cursorDot.style.opacity = '1';
  if (cursorRing) cursorRing.style.opacity = '1';
});

/* ── Navbar ──────────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

let lastScrollY = 0;
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      if (scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      lastScrollY = scrollY;
      ticking = false;
      updateActiveNavLink();
    });
    ticking = true;
  }
});

// Hamburger
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', !isOpen);
    hamburger.classList.toggle('open', !isOpen);
    hamburger.setAttribute('aria-expanded', !isOpen);
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// Active nav link based on scroll
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let current = '';

  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) current = s.getAttribute('id');
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-section') === current) link.classList.add('active');
  });
}

/* ── Hero Canvas Particles ───────────────────────────────────── */
const canvas = document.getElementById('hero-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrameId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.size = Math.random() * 1.5 + 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.6 ? '#9b59ff' : Math.random() > 0.5 ? '#9B59FF' : '#00D4FF';
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      if (this.life > this.maxLife) this.reset();
      // Wrap around edges
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }
    draw() {
      const fadeIn = Math.min(this.life / 60, 1);
      const fadeOut = Math.min((this.maxLife - this.life) / 60, 1);
      const alpha = this.opacity * Math.min(fadeIn, fadeOut);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Create connection lines between nearby particles
  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.12;
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = '#9b59ff';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function initParticles() {
    const count = Math.min(120, Math.floor(canvas.width * canvas.height / 9000));
    particles = Array.from({ length: count }, () => new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    ctx.globalAlpha = 1;
    animFrameId = requestAnimationFrame(animate);
  }

  initParticles();
  animate();
}

/* ── Hero Word Reveal ─────────────────────────────────────────── */
function initHeroWordReveal() {
  const title = document.querySelector('.hero-title');
  if (!title) return;
  // Already handled by CSS animations on .hero-word elements
}

/* ── Intersection Observer (Scroll Reveal) ───────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      // Stagger children if [data-stagger]
      if (entry.target.hasAttribute('data-stagger')) {
        entry.target.querySelectorAll(':scope > *').forEach((child, i) => {
          child.style.transitionDelay = `${i * 0.08}s`;
          child.classList.add('animated');
        });
      }
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.fade-in, .fade-up, .slide-left, .slide-right').forEach(el => {
  revealObserver.observe(el);
});

document.querySelectorAll('[data-stagger]').forEach(el => {
  revealObserver.observe(el);
  el.querySelectorAll(':scope > *').forEach(child => child.classList.add('fade-up'));
});

/* ── Counter Animation ───────────────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 2000;
  const start = performance.now();

  function update(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    const current = Math.round(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));

/* ── Services Tabs ───────────────────────────────────────────── */
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-tab');
    tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    tabContents.forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    const targetEl = document.getElementById(target);
    if (targetEl) {
      targetEl.classList.add('active');
      // Re-animate cards in tab
      targetEl.querySelectorAll('.service-card').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
          card.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 60);
      });
    }
  });
});

/* ── Portfolio Filter ────────────────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');

    portfolioItems.forEach((item, i) => {
      const category = item.getAttribute('data-category');
      const show = filter === 'all' || category === filter;

      if (show) {
        item.style.display = '';
        item.style.opacity = '0';
        item.style.transform = 'scale(0.85) translateY(20px)';
        setTimeout(() => {
          item.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
          item.style.opacity = '1';
          item.style.transform = 'scale(1) translateY(0)';
        }, i * 50);
      } else {
        item.style.transition = 'all 0.3s ease';
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        setTimeout(() => { item.style.display = 'none'; }, 300);
      }
    });
  });
});

/* ── Pricing Toggle ──────────────────────────────────────────── */
const pricingBtns = document.querySelectorAll('.pricing-toggle-btn');
const pricingPlans = document.querySelectorAll('.pricing-plans');

pricingBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-pricing');
    pricingBtns.forEach(b => b.classList.remove('active'));
    pricingPlans.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const targetEl = document.getElementById(target);
    if (targetEl) {
      targetEl.classList.add('active');
      targetEl.querySelectorAll('.pricing-card').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
          card.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
          card.style.opacity = '1';
          card.style.transform = card.classList.contains('featured') ? 'scale(1.03) translateY(0)' : 'translateY(0)';
        }, i * 100);
      });
    }
  });
});

/* ── FAQ Accordion ───────────────────────────────────────────── */
document.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    // Open clicked (if it wasn't open)
    if (!isOpen) {
      item.classList.add('open');
      q.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ── Swiper Testimonials ─────────────────────────────────────── */
if (typeof Swiper !== 'undefined') {
  new Swiper('.swiper-testimonials', {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
    pagination: { el: '.swiper-pagination', clickable: true },
    effect: 'slide',
    grabCursor: true,
    breakpoints: {
      640: { slidesPerView: 1.5 },
      900: { slidesPerView: 2 },
      1200: { slidesPerView: 2.5 }
    }
  });
}

/* ── 3D Card Tilt ────────────────────────────────────────────── */
function initTilt() {
  document.querySelectorAll('.industry-card, .service-card, .why-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const tiltX = -y * 8;
      const tiltY = x * 8;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
initTilt();

/* ── Smooth Anchor Scroll ────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 20;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── Marquee Track Duplication ───────────────────────────────── */
const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
  const clone = marqueeTrack.cloneNode(true);
  marqueeTrack.parentElement.appendChild(clone);
}

/* ── Typewriter for Hero Subtitle ───────────────────────────── */
function initTypewriter(el, texts, speed = 60, pause = 2500) {
  if (!el) return;
  let textIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = texts[textIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, pause);
        return;
      }
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        textIdx = (textIdx + 1) % texts.length;
      }
    }
    setTimeout(type, deleting ? speed / 2 : speed);
  }
  type();
}

const typewriterEl = document.querySelector('.hero-typewriter');
if (typewriterEl) {
  initTypewriter(typewriterEl, [
    'Dominate Online.',
    'Scale Revenue.',
    'Win Digitally.',
    'Grow Faster.'
  ]);
}

/* ── Ripple Effect on Buttons ────────────────────────────────── */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', e => {
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = `
      width: ${Math.max(rect.width, rect.height) * 2}px;
      height: ${Math.max(rect.width, rect.height) * 2}px;
      left: ${e.clientX - rect.left - Math.max(rect.width, rect.height)}px;
      top: ${e.clientY - rect.top - Math.max(rect.width, rect.height)}px;
    `;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

/* ── Scroll progress bar ─────────────────────────────────────── */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed; top: 0; left: 0; height: 2px;
  background: linear-gradient(90deg, #9b59ff, #9B59FF, #00D4FF);
  z-index: 10000; width: 0%; transition: width 0.1s ease;
  box-shadow: 0 0 8px rgba(155,89,255,0.6);
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = Math.min((scrollTop / docHeight) * 100, 100);
  progressBar.style.width = progress + '%';
});

/* ── Stats row section observer ──────────────────────────────── */
const statsSection = document.querySelector('.stats-section, .stats-row');
if (statsSection) revealObserver.observe(statsSection);

/* ── Interactive Quote Calculator Logic ── */
document.addEventListener('DOMContentLoaded', () => {
  const indBtns = document.querySelectorAll('.ind-pill-btn');
  const pkgCards = document.querySelectorAll('.pkg-card');
  const addonChecks = document.querySelectorAll('.addon-checkbox');
  const otPriceEl = document.getElementById('ot-price');
  const moPriceEl = document.getElementById('mo-price');
  const summaryEl = document.getElementById('calc-summary-items');
  const bookBtn = document.getElementById('calc-book-btn');

  if (!otPriceEl || !summaryEl || !bookBtn) return;

  let selectedIndustry = "Gym & Fitness";
  
  function updateCalculator() {
    let oneTimeTotal = 0;
    let monthlyTotal = 0;
    let itemsHTML = '';
    
    // 1. Industry
    itemsHTML += `<div class="summary-item"><span class="item-name">Industry:</span><span class="item-val">${selectedIndustry}</span></div>`;

    // 2. Web Package
    let selectedWeb = null;
    pkgCards.forEach(card => {
      if (card.getAttribute('data-type') === 'web' && card.classList.contains('active')) {
        selectedWeb = card;
      }
    });
    if (selectedWeb) {
      const price = parseInt(selectedWeb.getAttribute('data-price'));
      const name = selectedWeb.getAttribute('data-name');
      oneTimeTotal += price;
      itemsHTML += `<div class="summary-item"><span class="item-name">${name.split(' (')[0]}:</span><span class="item-val">Rs. ${price.toLocaleString()}</span></div>`;
    }

    // 3. Social Package
    let selectedSocial = null;
    pkgCards.forEach(card => {
      if (card.getAttribute('data-type') === 'social' && card.classList.contains('active')) {
        selectedSocial = card;
      }
    });
    if (selectedSocial) {
      const price = parseInt(selectedSocial.getAttribute('data-price'));
      const name = selectedSocial.getAttribute('data-name');
      monthlyTotal += price;
      itemsHTML += `<div class="summary-item"><span class="item-name">${name.split(' (')[0]}:</span><span class="item-val">Rs. ${price.toLocaleString()}/mo</span></div>`;
    }

    // 4. Add-ons
    addonChecks.forEach(check => {
      if (check.checked) {
        const price = parseInt(check.getAttribute('data-price'));
        const name = check.getAttribute('data-name');
        oneTimeTotal += price;
        itemsHTML += `<div class="summary-item"><span class="item-name">${name.split(' Add-on')[0]}:</span><span class="item-val">Rs. ${price.toLocaleString()}</span></div>`;
      }
    });

    // Update prices
    otPriceEl.textContent = `Rs. ${oneTimeTotal.toLocaleString()}`;
    moPriceEl.textContent = `Rs. ${monthlyTotal.toLocaleString()}`;
    summaryEl.innerHTML = itemsHTML;

    // Compile WhatsApp message
    let messageText = `Hi VOXVISION! I want a custom service quote for my startup. Here are my selected options:\n\n`;
    messageText += `• Industry: ${selectedIndustry}\n`;
    if (selectedWeb && selectedWeb.getAttribute('data-price') !== "0") messageText += `• Website: ${selectedWeb.getAttribute('data-name')}\n`;
    if (selectedSocial && selectedSocial.getAttribute('data-price') !== "0") messageText += `• Social Media: ${selectedSocial.getAttribute('data-name')}\n`;
    
    let addonsList = [];
    addonChecks.forEach(check => {
      if (check.checked) addonsList.push(check.getAttribute('data-name').split(' Add-on')[0]);
    });
    if (addonsList.length > 0) {
      messageText += `• Add-ons: ${addonsList.join(', ')}\n`;
    }
    messageText += `\nEstimated Price:\nOne-time Cost: Rs. ${oneTimeTotal.toLocaleString()}\nMonthly Cost: Rs. ${monthlyTotal.toLocaleString()}/mo.\nPlease check availability and contact me.`;

    bookBtn.onclick = () => {
      const waUrl = `https://wa.me/917975882681?text=${encodeURIComponent(messageText)}`;
      window.open(waUrl, '_blank');
    };
  }

  // Event Listeners
  indBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      indBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedIndustry = btn.getAttribute('data-industry');
      updateCalculator();
    });
  });

  pkgCards.forEach(card => {
    card.addEventListener('click', () => {
      const type = card.getAttribute('data-type');
      pkgCards.forEach(c => {
        if (c.getAttribute('data-type') === type) c.classList.remove('active');
      });
      card.classList.add('active');
      updateCalculator();
    });
  });

  addonChecks.forEach(check => {
    check.addEventListener('change', () => {
      updateCalculator();
    });
  });

  // Initial update
  updateCalculator();
});
