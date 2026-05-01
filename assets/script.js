// ===================================================
// Pravallika Regalla — Portfolio
// Single-page · Light Blue Glassmorphic
// ===================================================

// ============================================================
// Startup loader — counter + min display time, then fade out
// ============================================================
(() => {
  const MIN_TIME = 3000;
  const COUNTER_START = 1500;
  const COUNTER_DURATION = 1500;

  const start = performance.now();
  const counter = document.querySelector('.splash-pct');

  if (counter) {
    setTimeout(() => {
      const cStart = performance.now();
      const tick = () => {
        const t = Math.min(1, (performance.now() - cStart) / COUNTER_DURATION);
        const v = Math.round(t * 100);
        counter.textContent = v + '%';
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, COUNTER_START);
  }

  const dismiss = () => {
    const elapsed = performance.now() - start;
    const wait = Math.max(0, MIN_TIME - elapsed);
    setTimeout(() => document.body.classList.add('loaded'), wait);
  };

  if (document.readyState === 'complete') dismiss();
  else window.addEventListener('load', dismiss);
})();

// Nav scroll state
const nav = document.querySelector('.nav');
if (nav) {
  const onScroll = () => {
    if (window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Mobile menu toggle
const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.textContent = links.classList.contains('open') ? '×' : '☰';
  });
  // Close menu on link click (mobile)
  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.textContent = '☰';
    });
  });
}

// Stagger children inside [data-stagger] containers — assign delays
document.querySelectorAll('[data-stagger]').forEach((container) => {
  Array.from(container.children).forEach((child, i) => {
    if (!child.hasAttribute('data-reveal')) child.setAttribute('data-reveal', '');
    child.style.setProperty('--stagger-delay', `${i * 0.08}s`);
  });
});

// Reveal-on-scroll — replays every time an element enters view
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      e.target.classList.toggle('in', e.isIntersecting);
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -80px 0px' }
);

// Defer reveal animations until after the loader dismisses
// so the entrance plays smoothly on top of the page fade-in.
const startReveals = () => {
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
};

if (document.body.classList.contains('loaded')) {
  startReveals();
} else {
  const mo = new MutationObserver(() => {
    if (document.body.classList.contains('loaded')) {
      mo.disconnect();
      // Wait for the body fade-in to begin showing
      setTimeout(startReveals, 500);
    }
  });
  mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
}

// ============================================================
// Scroll progress bar
// ============================================================
const progressBar = document.querySelector('.scroll-progress');
if (progressBar) {
  const updateProgress = () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    progressBar.style.setProperty('--progress', pct + '%');
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

// ============================================================
// Back-to-top button
// ============================================================
const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
  const toggleBackToTop = () => {
    backToTop.classList.toggle('show', window.scrollY > 600);
  };
  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  toggleBackToTop();
}

// ============================================================
// Subtle background-blob parallax on scroll
// ============================================================
const blobs = document.querySelectorAll('.blob');
if (blobs.length) {
  let ticking = false;
  const parallax = () => {
    const y = window.scrollY;
    blobs.forEach((blob, i) => {
      const speed = 0.04 + (i * 0.025);
      blob.style.translate = `0 ${y * speed}px`;
    });
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(parallax);
      ticking = true;
    }
  }, { passive: true });
}

// ============================================================
// Hero text parallax — gentle upward drift as user scrolls
// ============================================================
const heroText = document.querySelector('.hero-pro-text');
const profileCard = document.querySelector('.profile-card');
if (heroText) {
  let heroTicking = false;
  const heroParallax = () => {
    const y = window.scrollY;
    if (y < 800) {
      heroText.style.transform = `translateY(${y * 0.2}px)`;
      heroText.style.opacity = String(Math.max(0, 1 - y / 600));
      if (profileCard) {
        profileCard.style.transform = `translateY(${y * 0.1}px)`;
        profileCard.style.opacity = String(Math.max(0, 1 - y / 700));
      }
    }
    heroTicking = false;
  };
  window.addEventListener('scroll', () => {
    if (!heroTicking) {
      requestAnimationFrame(heroParallax);
      heroTicking = true;
    }
  }, { passive: true });
}

// ============================================================
// Magnetic hover on profile social buttons (subtle pull)
// ============================================================
document.querySelectorAll('.profile-social, .nav-cta').forEach((el) => {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});

// ============================================================
// Smooth-scroll: scroll up vs down direction tracking
// (adds .scrolling-up / .scrolling-down to <body> for CSS hooks)
// ============================================================
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const cur = window.scrollY;
  if (cur > lastScroll && cur > 100) {
    document.body.classList.add('scrolling-down');
    document.body.classList.remove('scrolling-up');
  } else {
    document.body.classList.add('scrolling-up');
    document.body.classList.remove('scrolling-down');
  }
  lastScroll = cur;
}, { passive: true });

// Year stamp
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============================================================
// Scroll-spy: highlight nav link based on which section is visible
// ============================================================
const sections = Array.from(document.querySelectorAll('section[id], header[id]'));
const navAnchors = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));

if (sections.length && navAnchors.length) {
  const setActive = () => {
    const scrollPos = window.scrollY + 120;
    let current = sections[0]?.id || '';

    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop) current = section.id;
    });

    navAnchors.forEach((a) => {
      const href = a.getAttribute('href');
      a.classList.toggle('active', href === '#' + current);
    });
  };

  window.addEventListener('scroll', setActive, { passive: true });
  window.addEventListener('load', setActive);
  setActive();
}

// Mouse-tilt parallax on profile card
const card = document.querySelector('.profile-card');
const hero = document.querySelector('.hero');
if (card && hero && window.matchMedia('(pointer: fine)').matches) {
  hero.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5);
    const y = ((e.clientY - rect.top) / rect.height - 0.5);
    card.style.transform = `perspective(1200px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateZ(0)`;
  });
  hero.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1200px) rotateY(0) rotateX(0)';
  });
}

// ============================================================
// Documents — Resume / Cover Letter toggle (inside modal)
// ============================================================
const toggleBtns = document.querySelectorAll('.doc-toggle-btn');
const docViews = document.querySelectorAll('.doc-view');
const downloadBtnWrapper = document.getElementById('active-download');

toggleBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;

    toggleBtns.forEach((b) => b.classList.toggle('active', b === btn));
    docViews.forEach((v) => v.classList.toggle('active', v.id === target));

    if (downloadBtnWrapper) {
      if (target === 'view-resume') {
        downloadBtnWrapper.innerHTML =
          '<a href="lrresume.pdf" download class="btn btn-primary">↓ Download (PDF)</a>';
      } else if (target === 'view-cover') {
        downloadBtnWrapper.innerHTML =
          '<a href="lrcv.pdf" download class="btn btn-primary">↓ Download (PDF)</a>';
      }
    }

    // Scroll modal body to top so the new view shows from the start
    const modalBody = document.querySelector('.modal-body');
    if (modalBody) modalBody.scrollTop = 0;
  });
});

// ============================================================
// Documents Modal — open / close
// ============================================================
const modal = document.getElementById('docs-modal');
const modalTriggers = document.querySelectorAll('[data-modal-open]');
const modalCloseBtn = modal ? modal.querySelector('.modal-close') : null;

function openModal() {
  if (!modal) return;
  modal.removeAttribute('hidden');
  // Force reflow so the transition kicks in
  void modal.offsetWidth;
  modal.classList.add('open');
  document.body.classList.add('modal-open');
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  document.body.classList.remove('modal-open');
  setTimeout(() => modal.setAttribute('hidden', ''), 320);
}

modalTriggers.forEach((trigger) => {
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });
});

if (modal) {
  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  // Close button
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closeModal();
  });
}
