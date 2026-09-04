/* ============================================
   HEADER — scroll efekt
   ============================================ */
const header = document.getElementById('pageHeader');

if (header)
{
  window.addEventListener('scroll', () =>
  {
    header.classList.toggle('scrolled', window.scrollY > 20);
  });
}

/* ============================================
   MOBILNÍ NAVIGACE — hamburger
   ============================================ */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.querySelector('.nav-links');

if (navToggle && navLinks)
{
  navToggle.addEventListener('click', () =>
  {
    const open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Zavři menu po kliknutí na odkaz
  navLinks.querySelectorAll('a').forEach(a =>
  {
    a.addEventListener('click', () =>
    {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ============================================
   HERO 360 — šipka „scrolluj dolů"
   ============================================ */
const scrollDown = document.getElementById('scrollDown');

if (scrollDown)
{
  scrollDown.addEventListener('click', () =>
  {
    const target = document.querySelector('main .section') || document.querySelector('.section');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
}

/* ============================================
   LIGHTBOX — galerie
   ============================================ */
const galleryGrid   = document.getElementById('galleryGrid');
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev  = document.getElementById('lightboxPrev');
const lightboxNext  = document.getElementById('lightboxNext');
const lightboxCounter = document.getElementById('lightboxCounter');

if (galleryGrid && lightbox)
{
  const items = Array.from(galleryGrid.querySelectorAll('.gallery-item img'));
  let currentIndex = 0;

  function openLightbox(index)
  {
    currentIndex = index;
    lightboxImg.src = items[index].src;
    lightboxImg.alt = items[index].alt;
    lightboxCounter.textContent = `${index + 1} / ${items.length}`;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox()
  {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showPrev()
  {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    openLightbox(currentIndex);
  }

  function showNext()
  {
    currentIndex = (currentIndex + 1) % items.length;
    openLightbox(currentIndex);
  }

  // Klik na fotku
  items.forEach((img, index) =>
  {
    img.parentElement.addEventListener('click', () => openLightbox(index));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrev);
  lightboxNext.addEventListener('click', showNext);

  // Klik mimo obrázek zavře lightbox
  lightbox.addEventListener('click', (e) =>
  {
    if (e.target === lightbox) closeLightbox();
  });

  // Klávesnice
  document.addEventListener('keydown', (e) =>
  {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  // Swipe na mobilu
  let touchStartX = 0;

  lightbox.addEventListener('touchstart', (e) =>
  {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) =>
  {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50)
    {
      diff > 0 ? showNext() : showPrev();
    }
  });
}
