/* ============================================
   VEŘEJNÝ KALENDÁŘ DOSTUPNOSTI
   Čte data/rezervace.json (spravuje se přes admin.html)
   Struktura:
   {
     "blocked": ["YYYY-MM-DD"],          // obsazeno
     "partial": ["YYYY-MM-DD"],          // částečně
     "rules":   [{ "type":"weekday", "day":0-6, "status":"busy|partial" }]
   }
   day: 0 = neděle ... 6 = sobota (shodné s admin.html)
   ============================================ */
(function ()
{
  const grid       = document.getElementById('calGrid');
  const monthLabel = document.getElementById('calMonthLabel');
  const prevBtn    = document.getElementById('calPrev');
  const nextBtn    = document.getElementById('calNext');
  const dateInput  = document.getElementById('date');

  if (!grid || !monthLabel) return; // stránka bez kalendáře

  const MONTHS = [
    'Leden','Únor','Březen','Duben','Květen','Červen',
    'Červenec','Srpen','Září','Říjen','Listopad','Prosinec'
  ];
  const WEEKDAYS = ['Po','Út','St','Čt','Pá','So','Ne'];

  let data = { blocked: [], partial: [], rules: [] };
  let viewYear  = new Date().getFullYear();
  let viewMonth = new Date().getMonth();
  let selectedKey = null;

  function key(y, m, d)
  {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  function statusFor(dateStr, weekday)
  {
    // Explicitní datumy mají přednost před pravidly
    if (data.blocked.includes(dateStr)) return 'busy';
    if (data.partial.includes(dateStr)) return 'partial';

    let ruleStatus = 'free';
    for (const r of (data.rules || []))
    {
      if (r && r.type === 'weekday' && Number(r.day) === weekday)
      {
        if (r.status === 'busy') return 'busy';
        if (r.status === 'partial') ruleStatus = 'partial';
      }
    }
    return ruleStatus;
  }

  function render()
  {
    monthLabel.textContent = `${MONTHS[viewMonth]} ${viewYear}`;
    grid.innerHTML = '';

    // Záhlaví dnů (Po–Ne)
    WEEKDAYS.forEach(d =>
    {
      const el = document.createElement('div');
      el.className = 'cal-weekday';
      el.textContent = d;
      grid.appendChild(el);
    });

    const firstDay    = new Date(viewYear, viewMonth, 1).getDay(); // 0=Ne
    const offset      = (firstDay === 0) ? 6 : firstDay - 1;        // Po = první sloupec
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    for (let i = 0; i < offset; i++)
    {
      const empty = document.createElement('div');
      empty.className = 'cal-day empty';
      grid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++)
    {
      const dateStr = key(viewYear, viewMonth, day);
      const cellDate = new Date(viewYear, viewMonth, day);
      const weekday  = cellDate.getDay();
      const status   = statusFor(dateStr, weekday);
      const isPast   = cellDate < todayMidnight;
      const isToday  = dateStr === key(now.getFullYear(), now.getMonth(), now.getDate());

      const cell = document.createElement('div');
      cell.className = 'cal-day ' + status;
      cell.textContent = day;
      cell.title = dateStr;

      if (isToday) cell.classList.add('today');

      if (isPast)
      {
        cell.classList.add('past');
      }
      else if (status === 'busy')
      {
        // obsazeno — nelze vybrat
      }
      else
      {
        cell.classList.add('selectable');
        if (selectedKey === dateStr) cell.classList.add('selected');
        cell.addEventListener('click', () => selectDate(dateStr));
      }

      grid.appendChild(cell);
    }
  }

  function selectDate(dateStr)
  {
    selectedKey = dateStr;
    if (dateInput)
    {
      dateInput.value = dateStr;
      dateInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    render();
  }

  if (prevBtn) prevBtn.addEventListener('click', () =>
  {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    render();
  });

  if (nextBtn) nextBtn.addEventListener('click', () =>
  {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    render();
  });

  // Načti data (cache-bust kvůli CDN GitHub Pages), pak vykresli
  fetch('data/rezervace.json?t=' + Date.now(), { cache: 'no-store' })
    .then(res => res.ok ? res.json() : null)
    .then(json =>
    {
      if (json && typeof json === 'object')
      {
        data.blocked = Array.isArray(json.blocked) ? json.blocked : [];
        data.partial = Array.isArray(json.partial) ? json.partial : [];
        data.rules   = Array.isArray(json.rules)   ? json.rules   : [];
      }
    })
    .catch(() => { /* JSON zatím neexistuje → kalendář ukáže vše volné */ })
    .finally(render);
})();
