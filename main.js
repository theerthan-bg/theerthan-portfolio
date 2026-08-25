/**
 * Main Application Logic & Interactive Engine for Theerthan B G
 * Features: Web Audio Synth, Typewriter, GSAP Transitions, 3D Tilt, Lightbox & Contact Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // 2. Web Audio API Cyber Synthesizer
  class CyberSoundManager {
    constructor() {
      this.ctx = null;
      this.muted = localStorage.getItem('soundMuted') === 'true';
      this.initButton();
    }

    initCtx() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    initButton() {
      const btn = document.getElementById('sound-toggle-btn');
      const text = document.getElementById('sound-toggle-text');
      if (!btn) return;

      this.updateUI(btn, text);

      btn.addEventListener('click', () => {
        this.initCtx();
        this.muted = !this.muted;
        localStorage.setItem('soundMuted', this.muted);
        this.updateUI(btn, text);
        if (!this.muted) this.playSuccess();
      });
    }

    updateUI(btn, text) {
      if (this.muted) {
        btn.classList.add('sound-muted');
        if (text) text.textContent = 'SFX: OFF';
      } else {
        btn.classList.remove('sound-muted');
        if (text) text.textContent = 'SFX: ON';
      }
    }

    playTone(freq, type, duration, gainVal = 0.05) {
      if (this.muted) return;
      this.initCtx();
      if (!this.ctx) return;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        console.warn('Audio play error:', e);
      }
    }

    playHover() {
      this.playTone(880, 'sine', 0.08, 0.03);
    }

    playClick() {
      this.playTone(1200, 'triangle', 0.12, 0.06);
    }

    playScan() {
      this.playTone(520, 'sine', 0.15, 0.04);
    }

    playSuccess() {
      if (this.muted) return;
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 'sine', 0.25, 0.05);
        }, idx * 70);
      });
    }
  }

  const soundManager = new CyberSoundManager();
  window.soundManager = soundManager;

  // Add sound listeners to interactive elements
  document.querySelectorAll('a, button, .interactive-hover').forEach((el) => {
    el.addEventListener('mouseenter', () => soundManager.playHover());
    el.addEventListener('click', () => soundManager.playClick());
  });

  // 3. Dynamic Typewriter Effect
  const typewriterEl = document.getElementById('typewriter-text');
  if (typewriterEl) {
    const roles = [
      'BCA Scholar & Tech Innovator',
      'SDM Jhenkar & Confluence Hackathon Winner',
      'AI Tools & Prompt Specialist (Intellipaat & be10x)',
      'Creative UI/UX & Web Designer',
      'Creator of "THEERTHAN UPDATES" Tech Blog',
      'Building the Future from Hassan, Karnataka'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 70;

    function typeRole() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typewriterEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 35;
      } else {
        typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 70;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2200; // Pause at end of text
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400; // Pause before new word
      }

      setTimeout(typeRole, typingSpeed);
    }

    typeRole();
  }

  // 4. Live IST Clock (Hassan, Karnataka)
  function updateTime() {
    const clockEl = document.getElementById('live-clock');
    if (!clockEl) return;
    const now = new Date();
    const options = {
      timeZone: 'Asia/Kolkata',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    clockEl.textContent = now.toLocaleTimeString('en-US', options) + ' IST';
  }
  updateTime();
  setInterval(updateTime, 1000);

  // 5. Initialize Vanilla Tilt on 3D Perspective Cards
  if (window.VanillaTilt) {
    VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
      max: 12,
      speed: 400,
      glare: true,
      'max-glare': 0.25,
      scale: 1.02
    });
  }

  // 6. GSAP & ScrollTrigger Animations
  if (window.gsap) {
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    // Navbar Entrance
    gsap.from('#main-navbar', {
      y: -60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    // Hero Stagger Animation
    gsap.from('.hero-stagger', {
      y: 30,
      opacity: 0,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.2
    });

    // Staggered reveal for cards across sections
    document.querySelectorAll('.section-fade-in').forEach((section) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 40,
        opacity: 0,
        duration: 0.85,
        ease: 'power2.out'
      });
    });

    // Metrics Counter Animation
    const counters = document.querySelectorAll('.stat-counter');
    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-target') || '0', 10);
      if (!target) return;

      ScrollTrigger.create({
        trigger: counter,
        start: 'top 90%',
        onEnter: () => {
          gsap.to(counter, {
            innerHTML: target,
            duration: 1.8,
            snap: { innerHTML: 1 },
            ease: 'power2.out'
          });
        }
      });
    });
  }

  // 7. Project Category Filters
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      soundManager.playClick();
      filterBtns.forEach((b) => {
        b.classList.remove('bg-cyan-500/20', 'border-cyan-400', 'text-cyan-300');
        b.classList.add('bg-slate-900/60', 'border-slate-700', 'text-slate-400');
      });

      btn.classList.add('bg-cyan-500/20', 'border-cyan-400', 'text-cyan-300');
      btn.classList.remove('bg-slate-900/60', 'border-slate-700', 'text-slate-400');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 8. Certificate & Image Lightbox Modal
  const certModal = document.getElementById('certModal');
  const modalImg = document.getElementById('modalCertImg');
  const modalTitle = document.getElementById('modalCertTitle');
  const modalDesc = document.getElementById('modalCertDesc');
  const modalIssuer = document.getElementById('modalCertIssuer');
  const closeModalBtn = document.getElementById('closeModalBtn');

  window.openCertModal = function (imgSrc, title, issuer, desc) {
    if (!certModal) return;
    soundManager.playScan();
    modalImg.src = imgSrc;
    modalTitle.textContent = title;
    modalIssuer.textContent = issuer;
    modalDesc.textContent = desc;

    certModal.classList.remove('hidden');
    certModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  function closeCertModal() {
    if (!certModal) return;
    soundManager.playClick();
    certModal.classList.add('hidden');
    certModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeCertModal);
  if (certModal) {
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal || e.target.classList.contains('modal-backdrop')) {
        closeCertModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal && certModal.classList.contains('active')) {
      closeCertModal();
    }
  });

  // 9. Toast Notification System
  window.showToast = function (message, type = 'success') {
    const toast = document.getElementById('cyber-toast');
    const toastMsg = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');

    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    if (type === 'success') {
      toast.className =
        'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border border-cyan-500/40 bg-slate-900/95 backdrop-blur-md shadow-2xl shadow-cyan-500/20 text-white font-mono text-sm toast-slide-in';
      if (toastIcon) toastIcon.setAttribute('data-lucide', 'check-circle-2');
    } else {
      toast.className =
        'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border border-amber-500/40 bg-slate-900/95 backdrop-blur-md shadow-2xl shadow-amber-500/20 text-white font-mono text-sm toast-slide-in';
      if (toastIcon) toastIcon.setAttribute('data-lucide', 'alert-triangle');
    }

    if (window.lucide) lucide.createIcons();
    toast.classList.remove('hidden');

    setTimeout(() => {
      toast.classList.add('hidden');
    }, 4000);
  };

  // 10. Copy Email to Clipboard
  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
  copyEmailBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const email = 'theerthangowda724@gmail.com';
      navigator.clipboard
        .writeText(email)
        .then(() => {
          soundManager.playSuccess();
          showToast(`Copied ${email} to clipboard!`);
        })
        .catch(() => {
          showToast(`Email: ${email}`);
        });
    });
  });

  // 11. Interactive Contact Form Handler
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      soundManager.playSuccess();

      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const message = document.getElementById('contact-message').value;

      // Confetti burst
      if (window.confetti) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#8b5cf6', '#10b981', '#ffffff']
        });
      }

      showToast(`Thank you, ${name}! Your transmission has been initialized.`);

      // Also generate mailto link for direct sending
      const mailtoLink = `mailto:theerthangowda724@gmail.com?subject=Message from ${encodeURIComponent(name)} (${encodeURIComponent(email)})&body=${encodeURIComponent(message)}`;
      
      setTimeout(() => {
        window.location.href = mailtoLink;
      }, 1200);

      contactForm.reset();
    });
  }

  // 12. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      soundManager.playClick();
      mobileMenu.classList.toggle('hidden');
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }
});
