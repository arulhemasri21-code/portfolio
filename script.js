/* =============================================
   MAIN APPLICATION SCRIPT
   ============================================= */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  /* =============================================
     LOADING SCREEN
     ============================================= */
  (function initLoader() {
    const loader = document.getElementById('loader');
    const loaderBar = document.getElementById('loaderBar');
    if (!loader || !loaderBar) return;
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          loader.classList.add('hidden');
          document.body.style.overflow = '';
        }, 500);
      }
      loaderBar.style.width = progress + '%';
    }, 200);
  })();

  /* =============================================
     NAVIGATION
     ============================================= */
  (function initNav() {
    const header = document.getElementById('header');
    const hamburger = document.getElementById('navHamburger');
    const navLinks = document.getElementById('navLinks');
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      overlay.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', navLinks.classList.contains('active'));
    });

    overlay.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      overlay.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  })();

  /* =============================================
     SCROLL PROGRESS
     ============================================= */
  (function initScrollProgress() {
    const bar = document.getElementById('scrollProgressBar');
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = progress + '%';
    }, { passive: true });
  })();

  /* =============================================
     ACTIVE NAV LINK (Intersection Observer)
     ============================================= */
  (function initActiveNav() {
    const sections = document.querySelectorAll('.section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length === 0 || navLinks.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { rootMargin: '-50% 0px -50% 0px' });

    sections.forEach(s => observer.observe(s));
  })();

  /* =============================================
     SCROLL REVEAL (Intersection Observer)
     ============================================= */
  (function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach(el => observer.observe(el));
  })();

  /* =============================================
     COUNTER ANIMATION
     ============================================= */
  (function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-target'));
          const isDecimal = el.getAttribute('data-decimal') === 'true';
          const duration = 2000;
          const start = performance.now();

          function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * target;

            if (isDecimal) {
              el.textContent = current.toFixed(2);
            } else {
              el.textContent = Math.round(current);
            }

            if (progress < 1) {
              requestAnimationFrame(update);
            } else {
              el.textContent = isDecimal ? target.toFixed(2) : Math.round(target);
            }
          }

          requestAnimationFrame(update);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  })();

  /* =============================================
     SKILL BARS ANIMATION
     ============================================= */
  (function initSkillBars() {
    const fills = document.querySelectorAll('.skill-fill');
    if (fills.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const width = el.getAttribute('data-width') || '0';
          el.style.width = width + '%';
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    fills.forEach(f => observer.observe(f));
  })();

  /* =============================================
     TILT EFFECT ON CARDS
     ============================================= */
  (function initTilt() {
    const cards = document.querySelectorAll('[data-tilt]');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        card.style.transform =
          `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  })();

  /* =============================================
     BUTTON RIPPLE EFFECT
     ============================================= */
  (function initRipple() {
    document.querySelectorAll('.btn-ripple').forEach(btn => {
      btn.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const ripple = document.createElement('span');
        ripple.style.cssText = `left:${x}px;top:${y}px;width:${rect.width}px;height:${rect.width}px;`;
        ripple.classList.add('ripple-effect');
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
  })();

  /* =============================================
     THEME TOGGLE (Dark/Light)
     ============================================= */
  (function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    const icon = document.getElementById('themeIcon');

    if (!toggle || !icon) return;

    const html = document.documentElement;
    const saved = localStorage.getItem('portfolio-theme');

    if (saved) {
      html.setAttribute('data-theme', saved);
      icon.className = saved === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }

    toggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      icon.className = next === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
      localStorage.setItem('portfolio-theme', next);
    });
  })();

  /* =============================================
     PROJECT FILTERING & SEARCH
     ============================================= */
  (function initProjectFilter() {
    const searchInput = document.getElementById('projectSearch');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');

    if (!searchInput || filterBtns.length === 0) return;

    function filterProjects() {
      const search = (searchInput.value || '').toLowerCase();
      const activeFilter = document.querySelector('.filter-btn.active');
      const filter = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';

      cards.forEach(card => {
        const title = (card.querySelector('.project-title')?.textContent || '').toLowerCase();
        const desc = (card.querySelector('.project-desc')?.textContent || '').toLowerCase();
        const tags = Array.from(card.querySelectorAll('.project-tag')).map(t => t.textContent.toLowerCase());
        const cat = card.getAttribute('data-category');

        const matchFilter = filter === 'all' || cat === filter;
        const matchSearch = search === '' || title.includes(search) || desc.includes(search) || tags.some(t => t.includes(search));

        card.style.display = matchFilter && matchSearch ? 'block' : 'none';
      });
    }

    searchInput.addEventListener('input', filterProjects);

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterProjects();
      });
    });
  })();

  /* =============================================
     CERTIFICATE MODAL
     ============================================= */
  (function initCertModal() {
    const modal = document.getElementById('certModal');
    const closeBtn = document.getElementById('modalClose');
    const prevBtn = document.getElementById('modalPrev');
    const nextBtn = document.getElementById('modalNext');
    const titleEl = document.getElementById('modalCertTitle');
    const orgEl = document.getElementById('modalCertOrg');
    const imageEl = document.getElementById('modalCertImage');
    const placeholderEl = document.getElementById('modalPlaceholder');
    const viewBtns = document.querySelectorAll('.cert-view');

    if (!modal || viewBtns.length === 0) return;

    const certs = [
      { id: 'aws', title: 'AWS Cloud Foundations', org: 'Amazon Web Services', img: 'certificates/cloud foundation.jpeg' },
      { id: 'ibm', title: 'IBM AI Certification', org: 'IBM', img: 'certificates/Artificial intelligence.jpeg' },
      { id: 'cyber', title: 'Cybersecurity', org: 'Industry Certification', img: 'certificates/cybersecurity.jpeg' },
      { id: 'data-science', title: 'Python Data Science', org: 'Data Science Certification', img: 'certificates/Data science using python.jpeg' },
      { id: 'intel', title: 'Intel AI Sashakt', org: 'Intel', img: 'certificates/AI impact summit.jpeg' }
    ];

    let currentIndex = 0;

    function openModal(index) {
      currentIndex = index;
      const cert = certs[index];
      if (!cert) return;
      titleEl.textContent = cert.title;
      orgEl.textContent = cert.org;
      if (cert.img) {
        imageEl.src = cert.img;
        imageEl.style.display = 'block';
        placeholderEl.style.display = 'none';
      } else {
        imageEl.style.display = 'none';
        placeholderEl.style.display = 'block';
      }
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      imageEl.src = '';
    }

    function navigate(dir) {
      currentIndex = (currentIndex + dir + certs.length) % certs.length;
      const cert = certs[currentIndex];
      titleEl.textContent = cert.title;
      orgEl.textContent = cert.org;
      if (cert.img) {
        imageEl.src = cert.img;
        imageEl.style.display = 'block';
        placeholderEl.style.display = 'none';
      } else {
        imageEl.style.display = 'none';
        placeholderEl.style.display = 'block';
      }
    }

    viewBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-cert');
        const idx = certs.findIndex(c => c.id === id);
        if (idx >= 0) openModal(idx);
      });
    });

    closeBtn.addEventListener('click', closeModal);
    prevBtn.addEventListener('click', () => navigate(-1));
    nextBtn.addEventListener('click', () => navigate(1));

    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('active')) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  })();

  /* =============================================
     CONTACT FORM
     ============================================= */
  (function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const fields = [
      { id: 'formName', error: 'Please enter your name' },
      { id: 'formEmail', error: 'Please enter a valid email', validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
      { id: 'formSubject', error: 'Please enter a subject' },
      { id: 'formMessage', error: 'Please enter your message' }
    ];

    fields.forEach(f => {
      const input = document.getElementById(f.id);
      if (!input) return;
      const errorEl = input.parentElement.querySelector('.form-error');

      input.addEventListener('blur', () => {
        const valid = f.validate ? f.validate(input.value.trim()) : input.value.trim().length > 0;
        input.parentElement.classList.toggle('error', !valid && input.value.trim().length > 0);
        if (errorEl) {
          errorEl.textContent = valid ? '' : f.error;
          errorEl.classList.toggle('visible', !valid && input.value.trim().length > 0);
        }
      });

      input.addEventListener('input', () => {
        const valid = f.validate ? f.validate(input.value.trim()) : input.value.trim().length > 0;
        input.parentElement.classList.remove('error');
        if (errorEl) errorEl.classList.remove('visible');
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      fields.forEach(f => {
        const input = document.getElementById(f.id);
        if (!input) return;
        const errorEl = input.parentElement.querySelector('.form-error');
        const isVal = f.validate ? f.validate(input.value.trim()) : input.value.trim().length > 0;

        if (!isVal) {
          valid = false;
          input.parentElement.classList.add('error');
          if (errorEl) {
            errorEl.textContent = f.error;
            errorEl.classList.add('visible');
          }
        }
      });

      if (valid) {
        const btn = document.getElementById('formSubmit');
        if (btn) {
          const orig = btn.innerHTML;
          btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
          btn.disabled = true;

          setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

            setTimeout(() => {
              btn.innerHTML = orig;
              btn.disabled = false;
              btn.style.background = '';
              form.reset();
            }, 3000);
          }, 1500);
        }
      }
    });
  })();

  /* =============================================
     BACK TO TOP
     ============================================= */
  (function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    btn.addEventListener('click', () => {
      btn.querySelector('i').style.animation = 'rocketLaunch 0.8s ease forwards';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        btn.querySelector('i').style.animation = '';
      }, 800);
    });
  })();

  /* =============================================
     FOOTER YEAR
     ============================================= */
  (function initFooterYear() {
    const el = document.getElementById('footerYear');
    if (el) el.textContent = new Date().getFullYear();
  })();

  /* =============================================
     GITHUB CONTRIBUTION GRID (Simulated)
     ============================================= */
  (function initGitHubGrid() {
    const grid = document.getElementById('githubGrid');
    if (!grid) return;

    const fragment = document.createDocumentFragment();
    const levels = [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 4];

    for (let i = 0; i < 350; i++) {
      const cell = document.createElement('div');
      cell.className = 'github-cell level-' + levels[Math.floor(Math.random() * levels.length)];
      fragment.appendChild(cell);
    }

    grid.appendChild(fragment);
  })();

  /* =============================================
     CODING TERMINAL INTERACTIVE BIO
     ============================================= */
  (function initTerminal() {
    const output = document.getElementById('terminalOutput');
    if (!output) return;

    const aboutData = {
      name: 'Hemasri Arul',
      title: 'Full Stack Developer & AI Enthusiast',
      college: 'Mailam Engineering College',
      department: 'Computer Science and Engineering',
      cgpa: '9.11 / 10.0',
      graduation: '2028',
      skills: ['HTML', 'CSS', 'JavaScript', 'Python', 'Java', 'C', 'Node.js', 'MongoDB', 'MySQL'],
      certifications: ['AWS Cloud Foundations', 'IBM AI', 'Cybersecurity', 'Data Science', 'Intel AI Sashakt'],
      email: 'arulhemasri21@gmail.com',
      github: 'arulhemasri21-code',
      linkedin: 'hemasri-a-61a139381'
    };

    const json = JSON.stringify(aboutData, null, 2);
    let index = 0;

    function typeText() {
      if (index < json.length) {
        const char = json[index];
        output.textContent += char;
        index++;

        if (char === '\n' && index < json.length) {
          output.scrollTop = output.scrollHeight;
        }

        const delay = char === '\n' ? 30 : char === ' ' ? 15 : Math.random() * 20 + 5;
        setTimeout(typeText, delay);
      }
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setTimeout(typeText, 800);
        observer.unobserve(output);
      }
    }, { threshold: 0.3 });

    observer.observe(output);
  })();

  /* =============================================
     MOUSE SPOTLIGHT
     ============================================= */
  (function initMouseSpotlight() {
    const spotlight = document.createElement('div');
    spotlight.className = 'mouse-spotlight';
    document.body.appendChild(spotlight);

    let rafId = null;
    window.addEventListener('mousemove', (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        spotlight.style.setProperty('--mouse-x', e.clientX + 'px');
        spotlight.style.setProperty('--mouse-y', e.clientY + 'px');
        rafId = null;
      });
    }, { passive: true });
  })();

  /* =============================================
     VISITOR COUNTER
     ============================================= */
  (function initVisitorCounter() {
    const counter = document.createElement('div');
    counter.className = 'visitor-counter';
    counter.innerHTML = '<i class="fas fa-eye"></i> <span>Visitors: ' + (Math.floor(Math.random() * 900) + 100) + '</span>';
    document.body.appendChild(counter);
  })();

  /* =============================================
     DOWNLOAD RESUME
     ============================================= */
  (function initResumeDownload() {
    const btns = [
      'downloadResume',
      'resumeDownload',
      'resumeAtsDownload'
    ];

    btns.forEach(id => {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener('click', (e) => {
        if (btn.getAttribute('href') === 'resume/Hemasri_Arul_Resume.pdf') return;

        e.preventDefault();
        const a = document.createElement('a');
        a.href = 'resume/Hemasri_Arul_Resume.pdf';
        a.download = 'Hemasri_Arul_Resume.pdf';
        a.click();
      });
    });
  })();

  /* =============================================
     PARALLAX EFFECT ON HERO
     ============================================= */
  (function initParallax() {
    const circles = document.querySelectorAll('.hero-circle');
    if (circles.length === 0) return;

    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      circles.forEach((circle, i) => {
        const speed = (i + 1) * 10;
        circle.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    }, { passive: true });
  })();
});
