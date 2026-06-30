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
   KALENDÁŘ REZERVACÍ
   ============================================ */

// ── Obsazené termíny ──────────────────────────────────────────────
// Přidej/odeber datumy ve formátu 'YYYY-MM-DD'
const occupiedDates = [
  '2025-07-03',
  '2025-07-07',
  '2025-07-10',
  '2025-07-11',
  '2025-07-15',
  '2025-07-22',
  '2025-08-01',
  '2025-08-05',
];
// ─────────────────────────────────────────────────────────────────

const calendarGrid    = document.getElementById('calendarGrid');
const calendarMonth   = document.getElementById('calendarMonth');
const prevMonthBtn    = document.getElementById('prevMonth');
const nextMonthBtn    = document.getElementById('nextMonth');
const selectedDisplay = document.getElementById('selectedDateDisplay');
const submitBtn       = document.getElementById('submitBtn');
const bookingSuccess  = document.getElementById('bookingSuccess');
const bookingFormInner = document.getElementById('bookingFormInner');

if (calendarGrid)
{
  const today = new Date();
  let currentYear  = today.getFullYear();
  let currentMonth = today.getMonth(); // 0–11
  let selectedDate = null;

  const monthNames = [
    'Leden','Únor','Březen','Duben','Květen','Červen',
    'Červenec','Srpen','Září','Říjen','Listopad','Prosinec'
  ];

  function toKey(year, month, day)
  {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  }

  function renderCalendar()
  {
    calendarMonth.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    calendarGrid.innerHTML = '';

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    // Pondělí = 0 (evropský formát)
    const startOffset = (firstDay === 0) ? 6 : firstDay - 1;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Prázdné buňky před prvním dnem
    for (let i = 0; i < startOffset; i++)
    {
      const empty = document.createElement('div');
      empty.className = 'cal-day empty';
      calendarGrid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++)
    {
      const key  = toKey(currentYear, currentMonth, day);
      const cell = document.createElement('div');
      cell.className = 'cal-day';
      cell.textContent = day;

      const cellDate = new Date(currentYear, currentMonth, day);
      const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      if (occupiedDates.includes(key))
      {
        cell.classList.add('occupied');
      }
      else if (cellDate < todayMidnight)
      {
        cell.classList.add('past');
      }
      else
      {
        if (key === toKey(today.getFullYear(), today.getMonth(), today.getDate()))
        {
          cell.classList.add('today');
        }

        if (selectedDate === key)
        {
          cell.classList.add('selected');
        }

        cell.addEventListener('click', () => selectDate(key, day));
      }

      calendarGrid.appendChild(cell);
    }
  }

  function selectDate(key, day)
  {
    selectedDate = key;

    // Zobraz vybraný datum
    const [y, m, d] = key.split('-');
    const dateObj = new Date(y, m - 1, d);
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    selectedDisplay.textContent = dateObj.toLocaleDateString('cs-CZ', options);

    // Aktivuj tlačítko
    if (submitBtn) submitBtn.disabled = false;

    renderCalendar();
  }

  prevMonthBtn.addEventListener('click', () =>
  {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar();
  });

  nextMonthBtn.addEventListener('click', () =>
  {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar();
  });

  renderCalendar();

  /* ── Odeslání formuláře ── */
  if (submitBtn)
  {
    submitBtn.addEventListener('click', () =>
    {
      const name  = document.getElementById('fieldName')?.value.trim();
      const email = document.getElementById('fieldEmail')?.value.trim();
      const type  = document.getElementById('fieldType')?.value;

      if (!name || !email || !type)
      {
        alert('Vyplňte prosím jméno, e-mail a typ pronájmu.');
        return;
      }

      // Zde lze napojit reálné API / Formspree / Netlify Forms
      // Prozatím simulujeme úspěch
      bookingFormInner.style.display = 'none';
      bookingSuccess.classList.add('show');
    });
  }
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
