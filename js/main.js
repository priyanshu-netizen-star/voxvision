/* ============================================================
   VOXVISION — Main Interactive JS
   ============================================================ */

(function () {
  'use strict';

  // ── Navbar scroll effect ───────────────────────────────────
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }, { passive: true });
  }

  // ── Mobile Menu ────────────────────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && mobileMenu.classList.contains('open')) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ── Services Tabs ──────────────────────────────────────────
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const targetContent = document.getElementById(target);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  // ── Portfolio Filter ───────────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      portfolioItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = 'block';
          setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // ── FAQ Accordion ──────────────────────────────────────────
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(fi => {
        fi.classList.remove('open');
        fi.querySelector('.faq-answer').style.maxHeight = '0';
      });

      // Open clicked
      if (!isOpen) {
        item.classList.add('open');
        const inner = answer.querySelector('.faq-answer-inner');
        answer.style.maxHeight = inner.scrollHeight + 'px';
      }
    });
  });

  // ── Pricing Toggle ─────────────────────────────────────────
  const pricingToggleBtns = document.querySelectorAll('.pricing-toggle-btn');
  const pricingPlans = document.querySelectorAll('.pricing-plans');

  pricingToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-pricing');
      pricingToggleBtns.forEach(b => b.classList.remove('active'));
      pricingPlans.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const targetPlan = document.getElementById(target);
      if (targetPlan) targetPlan.classList.add('active');
    });
  });

  // ── Smooth Scroll for anchor links ────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // nav height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── Active Nav link highlight on scroll ───────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-section') === entry.target.id);
          });
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(s => sectionObserver.observe(s));
  }

  // ── Hero typing effect ─────────────────────────────────────
  const typingEl = document.querySelector('[data-typing]');
  if (typingEl) {
    const words = JSON.parse(typingEl.getAttribute('data-words') || '[]');
    if (words.length > 0) {
      let wordIndex = 0, charIndex = 0, isDeleting = false;

      function type() {
        const currentWord = words[wordIndex];
        if (isDeleting) {
          typingEl.textContent = currentWord.substring(0, charIndex - 1);
          charIndex--;
        } else {
          typingEl.textContent = currentWord.substring(0, charIndex + 1);
          charIndex++;
        }

        if (!isDeleting && charIndex === currentWord.length) {
          isDeleting = true;
          setTimeout(type, 1800);
          return;
        }
        if (isDeleting && charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }

        setTimeout(type, isDeleting ? 60 : 110);
      }
      type();
    }
  }

  // ── Swiper Testimonials ────────────────────────────────────
  if (typeof Swiper !== 'undefined') {
    new Swiper('.swiper-testimonials', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      breakpoints: {
        640:  { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    });
  }

  // ── Tilt on hover (industry cards) ────────────────────────
  document.querySelectorAll('.industry-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltX = -(y / rect.height) * 6;
      const tiltY = (x / rect.width) * 6;
      card.style.transform = `translateY(-6px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

})();
