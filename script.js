/* ============================================================
   Sibulele Mjavu – Portfolio Script
   Author: Sibulele Mjavu
   Description: Minimal, accessible JavaScript for interactivity
   ============================================================ */

'use strict';

/* ============================================================
   1. UTILITY – Wait for DOM ready
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     2. DYNAMIC COPYRIGHT YEAR
  ---------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ----------------------------------------------------------
     3. NAVIGATION – Scroll state (add .scrolled class)
  ---------------------------------------------------------- */
  const navbar = document.getElementById('navbar');

  const handleNavScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // Run once on load

  /* ----------------------------------------------------------
     4. NAVIGATION – Active link highlight on scroll
  ---------------------------------------------------------- */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const activateNavLink = () => {
    const scrollPos = window.scrollY + 100; // Offset for navbar height

    sections.forEach((section) => {
      const sectionTop    = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId     = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', activateNavLink, { passive: true });
  activateNavLink(); // Run once on load

  /* ----------------------------------------------------------
     5. HAMBURGER MENU – Toggle mobile navigation
  ---------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navLinks');

  const toggleMenu = () => {
    const isOpen = hamburger.classList.toggle('open');
    navMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));

    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const closeMenu = () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', toggleMenu);

  // Close menu when a nav link is clicked (mobile)
  navMenu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (
      navMenu.classList.contains('open') &&
      !navMenu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMenu();
    }
  });

  /* ----------------------------------------------------------
     6. SCROLL REVEAL – Intersection Observer
  ---------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Unobserve after reveal to save resources
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,       // Trigger when 12% of element is visible
        rootMargin: '0px 0px -40px 0px', // Slight offset from bottom
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: show all elements immediately if IntersectionObserver not supported
    revealElements.forEach((el) => el.classList.add('visible'));
  }

  /* ----------------------------------------------------------
     7. SMOOTH SCROLL – Enhanced for anchor links
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = navbar ? navbar.offsetHeight : 72;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth',
      });
    });
  });

  /* ----------------------------------------------------------
     8. SKILL PILLS – Subtle hover ripple effect
  ---------------------------------------------------------- */
  document.querySelectorAll('.skill-pill').forEach((pill) => {
    pill.addEventListener('mouseenter', () => {
      pill.style.transition = 'transform 150ms ease, box-shadow 150ms ease';
    });
  });

  /* ----------------------------------------------------------
     9. PROJECT CARDS – Tilt effect on hover (subtle)
  ---------------------------------------------------------- */
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect    = card.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;
      const deltaX  = (e.clientX - centerX) / (rect.width  / 2);
      const deltaY  = (e.clientY - centerY) / (rect.height / 2);

      // Limit tilt to ±4 degrees
      const tiltX = deltaY * -4;
      const tiltY = deltaX *  4;

      card.style.transform = `translateY(-6px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      card.style.transition = 'transform 80ms linear';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 400ms ease, border-color 250ms ease, box-shadow 250ms ease';
    });
  });

  /* ----------------------------------------------------------
     10. HERO STATS – Count-up animation
  ---------------------------------------------------------- */
  const statValues = document.querySelectorAll('.stat-value');

  const animateCountUp = (el) => {
    const rawText = el.textContent.trim();
    // Extract numeric part and suffix (e.g. "80%" → 80, "%")
    const match   = rawText.match(/^(\d+)(.*)$/);
    if (!match) return;

    const target  = parseInt(match[1], 10);
    const suffix  = match[2];
    const duration = 1200; // ms
    const start    = performance.now();

    const step = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(eased * target);

      el.textContent = current + suffix;

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  // Trigger count-up when hero stats enter viewport
  if ('IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCountUp(entry.target);
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statValues.forEach((el) => statsObserver.observe(el));
  }

});
