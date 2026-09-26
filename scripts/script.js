// Marca como activo el link de navegación en el que se hace click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('is-active'));
    link.classList.add('is-active');
  });
});

// Reproducción de videos en la sección Eventos
document.querySelectorAll('.video-card').forEach(card => {
  const video = card.querySelector('.video-media');
  const btn = card.querySelector('.video-play-btn');

  btn.addEventListener('click', () => {
    video.setAttribute('controls', '');
    video.play();
    card.classList.add('is-playing');
  });

  video.addEventListener('pause', () => {
    card.classList.remove('is-playing');
  });
});

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('.contact-submit');
    const status = document.getElementById('form-status');

    submitBtn.disabled = true;
    status.textContent = 'Enviando...';
    status.className = 'form-status';

    const data = Object.fromEntries(new FormData(contactForm));

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error();

      status.textContent = '¡Mensaje enviado! Te contactaremos pronto.';
      status.className = 'form-status success';
      contactForm.reset();
    } catch {
      status.textContent = 'Hubo un error. Probá de nuevo o escribinos por WhatsApp.';
      status.className = 'form-status error';
    } finally {
      submitBtn.disabled = false;
    }
  });
}

const hamburgerBtn = document.getElementById('hamburger-btn');
const mainNav = document.querySelector('.main-nav');

if (hamburgerBtn && mainNav) {
  hamburgerBtn.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    hamburgerBtn.classList.toggle('is-active', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', isOpen);
  });

  mainNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      hamburgerBtn.classList.remove('is-active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

document.getElementById('footer-year').textContent = new Date().getFullYear();