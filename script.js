/* ===== NAV scroll effect ===== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

/* ===== Mobile burger ===== */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ===== Scroll reveal ===== */
const revealEls = document.querySelectorAll(
  '.step, .feature-card, .stat-item, .testimonial-card, .section__header'
);
revealEls.forEach((el, i) => {
  el.classList.add('reveal');
  const delay = (i % 4) * 0.1;
  el.style.transitionDelay = delay + 's';
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach(el => observer.observe(el));

/* ===== Counter animation ===== */
function animateCounter(el, target, suffix = '') {
  const duration = 1800;
  const start = performance.now();
  const isLarge = target >= 1000;

  const tick = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(ease * target);

    if (isLarge) {
      el.textContent = current.toLocaleString('pt-BR') + suffix;
    } else {
      el.textContent = current + suffix;
    }

    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.stat-item__num[data-target]').forEach(el => {
  counterObserver.observe(el);
});

/* ===== Smooth scroll for anchor links ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  if (a.hasAttribute('data-modal')) return;
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 76;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ===== Toast ===== */
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ===== Waitlist Modal ===== */
const modalOverlay  = document.getElementById('modalOverlay');
const modalClose    = document.getElementById('modalClose');
const modalFormView = document.getElementById('modalFormView');
const modalSuccessView = document.getElementById('modalSuccessView');
const waitlistForm  = document.getElementById('waitlistForm');
const waitlistSubmit = document.getElementById('waitlistSubmit');
const modalDone     = document.getElementById('modalDone');

function openModal() {
  modalFormView.hidden = false;
  modalSuccessView.hidden = true;
  waitlistForm.reset();
  waitlistForm.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));
  waitlistSubmit.disabled = false;
  waitlistSubmit.innerHTML = 'Garantir minha vaga <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
  modalOverlay.classList.add('open');
  modalOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('wName').focus(), 320);
}

function closeModal() {
  modalOverlay.classList.remove('open');
  modalOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-modal]').forEach(el => {
  el.addEventListener('click', e => { e.preventDefault(); openModal(); });
});

modalClose.addEventListener('click', closeModal);
modalDone.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

waitlistForm.addEventListener('submit', e => {
  e.preventDefault();
  const name  = document.getElementById('wName');
  const email = document.getElementById('wEmail');
  let valid = true;

  [name, email].forEach(f => f.classList.remove('field-error'));

  if (!name.value.trim()) { name.classList.add('field-error'); valid = false; }
  if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    email.classList.add('field-error'); valid = false;
  }
  if (!valid) return;

  waitlistSubmit.disabled = true;
  waitlistSubmit.textContent = 'Enviando...';

  setTimeout(() => {
    modalFormView.hidden = true;
    modalSuccessView.hidden = false;
    showToast('✅ Você entrou na lista de espera!');
  }, 900);
});
