/* ============================================
   KATALOG TECHNIKY — e-shop prvky
   - filtr kategorií (chipy ve sticky liště)
   - hover = druhá fotka, tečky = počet fotek
   - klik na fotku = galerie produktu (lightbox)
   - chybějící fotka = typografická karta s názvem
   ============================================ */
(function ()
{
  const cards = Array.from(document.querySelectorAll('.gear-catalog .card'));
  if (!cards.length) return;

  /* ---- Fotky produktů ---- */
  cards.forEach(card =>
  {
    const media = card.querySelector('.gear-media');
    const name  = card.querySelector('.gear-name');
    if (!media) return;

    // Bez fotky: velký název produktu jako „etiketa"
    if (media.classList.contains('no-img'))
    {
      const t = document.createElement('div');
      t.className = 'gear-ph-name';
      t.textContent = name ? name.textContent : '';
      media.prepend(t);
      return;
    }

    const img = media.querySelector('img');
    const extra = (media.dataset.more || '').split(',').filter(Boolean);
    const all = [img.getAttribute('src')].concat(extra);
    media.dataset.all = all.join(',');

    // Fotka se nenačetla → přepni na typografickou kartu
    img.addEventListener('error', () =>
    {
      media.classList.add('no-img');
      media.innerHTML = '<div class="gear-ph-name"></div><span>Foto připravujeme</span>';
      media.firstChild.textContent = name ? name.textContent : '';
    });

    if (all.length > 1)
    {
      const alt = document.createElement('img');
      alt.src = all[1];
      alt.alt = '';
      alt.loading = 'lazy';
      alt.className = 'gear-img-alt';
      media.appendChild(alt);

      const badge = document.createElement('span');
      badge.className = 'gear-count';
      badge.textContent = all.length + ' foto';
      media.appendChild(badge);
    }

    media.classList.add('zoomable');
    media.setAttribute('role', 'button');
    media.setAttribute('tabindex', '0');
    media.setAttribute('aria-label', 'Zobrazit fotky: ' + (name ? name.textContent : ''));
    media.addEventListener('click', () => openBox(card, all, 0));
    media.addEventListener('keydown', e =>
    {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openBox(card, all, 0); }
    });
  });

  /* ---- Lightbox produktu ---- */
  const box = document.createElement('div');
  box.className = 'lightbox gear-box';
  box.innerHTML =
    '<button class="lightbox-close" aria-label="Zavřít">✕</button>' +
    '<button class="lightbox-nav lightbox-prev" aria-label="Předchozí">&#8592;</button>' +
    '<button class="lightbox-nav lightbox-next" aria-label="Další">&#8594;</button>' +
    '<div class="lightbox-img-wrap"><img src="" alt=""></div>' +
    '<div class="gear-box-caption"><span class="gear-box-name"></span><span class="gear-box-price"></span><span class="gear-box-count"></span></div>';
  document.body.appendChild(box);

  const bImg = box.querySelector('img');
  const bName = box.querySelector('.gear-box-name');
  const bPrice = box.querySelector('.gear-box-price');
  const bCount = box.querySelector('.gear-box-count');
  let list = [], idx = 0;

  function show()
  {
    bImg.src = list[idx];
    bCount.textContent = list.length > 1 ? (idx + 1) + ' / ' + list.length : '';
    box.querySelectorAll('.lightbox-nav').forEach(b => b.style.display = list.length > 1 ? '' : 'none');
  }

  function openBox(card, imgs, i)
  {
    list = imgs; idx = i;
    const n = card.querySelector('.gear-name');
    const p = card.querySelector('.gear-price');
    bName.textContent = n ? n.textContent : '';
    bPrice.textContent = p ? p.textContent : '';
    bImg.alt = bName.textContent;
    show();
    box.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close()
  {
    box.classList.remove('open');
    document.body.style.overflow = '';
  }

  const step = d => { idx = (idx + d + list.length) % list.length; show(); };

  box.querySelector('.lightbox-close').addEventListener('click', close);
  box.querySelector('.lightbox-prev').addEventListener('click', () => step(-1));
  box.querySelector('.lightbox-next').addEventListener('click', () => step(1));
  box.addEventListener('click', e => { if (e.target === box) close(); });
  document.addEventListener('keydown', e =>
  {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
  let tx = 0;
  box.addEventListener('touchstart', e => { tx = e.changedTouches[0].screenX; }, { passive: true });
  box.addEventListener('touchend', e =>
  {
    const d = tx - e.changedTouches[0].screenX;
    if (Math.abs(d) > 50 && list.length > 1) step(d > 0 ? 1 : -1);
  });

  /* ---- Filtr kategorií ---- */
  const bar = document.querySelector('.cart-bar');
  const titles = Array.from(document.querySelectorAll('.gear-cat-title'));
  if (!bar || !titles.length) return;

  const groups = titles.map(t => ({ title: t, body: t.nextElementSibling, label: t.textContent.trim() }));
  const chips = document.createElement('div');
  chips.className = 'gear-filter';
  chips.setAttribute('role', 'tablist');

  function makeChip(label, filterFn)
  {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'gear-chip';
    b.textContent = label;
    b.addEventListener('click', () =>
    {
      chips.querySelectorAll('.gear-chip').forEach(c => c.classList.remove('active'));
      b.classList.add('active');
      groups.forEach(g =>
      {
        const on = filterFn(g);
        g.title.hidden = !on;
        if (g.body) g.body.hidden = !on;
      });
      const top = bar.getBoundingClientRect().top + window.scrollY - 80;
      if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
    });
    chips.appendChild(b);
    return b;
  }

  makeChip('Vše', () => true).classList.add('active');
  groups.forEach(g =>
  {
    const count = g.body ? g.body.querySelectorAll('.card').length : 0;
    makeChip(g.label + (count ? ' · ' + count : ''), x => x === g);
  });

  bar.appendChild(chips);
})();
