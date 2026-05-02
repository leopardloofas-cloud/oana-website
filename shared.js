/* ============================================
   OANA RUXANDA — Shared JS
   ============================================ */

// --- Custom Cursor ---
(function() {
  if (window.matchMedia('(hover: none)').matches) return;
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!cursor || !ring) return;

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, [data-hover]').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); ring.classList.add('hover'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); ring.classList.remove('hover'); });
  });
})();

// --- Nav hide/show on scroll ---
(function() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  let lastY = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y > lastY && y > 120) {
          nav.classList.add('hidden');
        } else {
          nav.classList.remove('hidden');
        }
        // Solid bg after scrolling past hero
        if (y > 80) {
          nav.classList.add('solid');
          nav.classList.remove('light-links', 'light-logo', 'logo-hidden');
        } else {
          nav.classList.remove('solid');
          if (nav.dataset.lightOnTop === 'true') {
            nav.classList.add('light-links', 'light-logo');
          }
          if (nav.dataset.hideLogoOnTop === 'true') {
            nav.classList.add('logo-hidden');
          }
        }

        lastY = y;
        ticking = false;
      });
      ticking = true;
    }
  });
})();

// --- Scroll Reveal ---
(function() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
})();

// --- Page Transitions ---
(function() {
  const overlay = document.getElementById('page-transition');
  if (!overlay) return;

  // Exit animation on page load
  overlay.classList.add('exit');
  overlay.addEventListener('animationend', () => {
    overlay.classList.remove('exit');
  }, { once: true });

  // Reset overlay when restored from bfcache (browser back/forward button)
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      overlay.classList.remove('enter');
      overlay.classList.add('exit');
      overlay.addEventListener('animationend', () => {
        overlay.classList.remove('exit');
      }, { once: true });
    }
  });

  // Enter animation on link click
  document.querySelectorAll('a[href]').forEach(link => {
    const staticHref = link.getAttribute('href');
    if (!staticHref || staticHref.startsWith('#') || staticHref.startsWith('http') || staticHref.startsWith('mailto') || staticHref.startsWith('tel')) return;

    link.addEventListener('click', e => {
      e.preventDefault();
      const href = link.href;
      overlay.classList.add('enter');
      overlay.addEventListener('animationend', () => {
        window.location.href = href;
      }, { once: true });
    });
  });
})();

// --- Active nav link ---
(function() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

// --- Marquee Loop ---
(function() {
  const track = document.querySelector('.disciplines-track');
  const inner = document.querySelector('.disciplines-inner');
  if (!track || !inner) return;

  function init() {
    track.style.animation = 'none';
    track.querySelectorAll('[aria-hidden="true"]').forEach(el => el.remove());

    // Measure one copy's width (items + padding-right gap)
    const w = inner.getBoundingClientRect().width;

    // Clone enough times so the track always overfills the viewport.
    // At the animation end (offset = -w) we show pixels w…w+vw, so we need
    // total track width >= w + vw, i.e. at least ceil(vw/w) extra copies.
    const n = Math.ceil(window.innerWidth / w) + 1;
    for (let i = 0; i < n; i++) {
      const clone = inner.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    }

    track.style.setProperty('--marquee-offset', '-' + w + 'px');
    track.getBoundingClientRect(); // force reflow before re-enabling animation
    track.style.animation = 'marquee 18s linear infinite';
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(init);
  } else {
    window.addEventListener('load', init);
  }
})();

// --- Mobile Hamburger ---
(function() {
  const btn = document.getElementById('nav-hamburger');
  const menu = document.getElementById('nav-mobile');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.classList.toggle('open');
    menu.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();
