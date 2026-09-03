/* ============================================
   KOŠÍK TECHNIKY (localStorage)
   - technika.html: tlačítka .add-to-cart přidávají/odebírají položky
   - rezervace.html: vybraná technika se přenese do poptávky
   ============================================ */
(function ()
{
  const KEY = 'a55cart';

  function load()
  {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }

  function save(items)
  {
    try { localStorage.setItem(KEY, JSON.stringify(items)); }
    catch (e) { /* soukromý režim apod. */ }
  }

  function plural(n)
  {
    if (n === 1) return '1 položka';
    if (n >= 2 && n <= 4) return n + ' položky';
    return n + ' položek';
  }

  /* ---- Stránka TECHNIKA ---- */
  function initGearPage()
  {
    const buttons = document.querySelectorAll('.add-to-cart');
    const countEl = document.getElementById('cart-count');
    if (!buttons.length) return;

    function refresh()
    {
      const items = load();
      const names = items.map(i => i.name);

      if (countEl) countEl.textContent = plural(items.length);

      buttons.forEach(btn =>
      {
        const name = btn.dataset.name;
        const inCart = names.includes(name);
        btn.classList.toggle('in-cart', inCart);
        btn.textContent = inCart ? 'V poptávce ✓' : 'Přidat do poptávky';
      });
    }

    buttons.forEach(btn =>
    {
      btn.addEventListener('click', () =>
      {
        const name  = btn.dataset.name;
        const price = btn.dataset.price || '';
        let items = load();

        if (items.some(i => i.name === name))
        {
          items = items.filter(i => i.name !== name);
        }
        else
        {
          items.push({ name, price });
        }

        save(items);
        refresh();
      });
    });

    refresh();
  }

  /* ---- Stránka REZERVACE ---- */
  function initReservationPage()
  {
    const mount = document.getElementById('cartSummary');
    if (!mount) return;

    const items = load();
    if (!items.length) { mount.hidden = true; return; }

    mount.hidden = false;

    const lines = items.map(i =>
      `• ${i.name}${i.price ? ` (${i.price} Kč / den)` : ''}`
    ).join('\n');

    // Vizuální shrnutí
    mount.innerHTML =
      '<div class="cart-summary-head">Vybraná technika k poptávce</div>' +
      '<ul class="cart-summary-list">' +
      items.map(i =>
        `<li>${i.name}${i.price ? ` <span>${i.price} Kč / den</span>` : ''}</li>`
      ).join('') +
      '</ul>' +
      '<button type="button" class="cart-clear" id="cartClear">Vymazat výběr</button>';

    // Přenes do zprávy (jen pokud tam ještě není a uživatel nepsal)
    const message = document.getElementById('message');
    if (message)
    {
      const marker = 'Poptávaná technika:';
      if (!message.value.includes(marker))
      {
        const block = `${marker}\n${lines}\n\n`;
        message.value = block + message.value;
      }
    }

    const clearBtn = document.getElementById('cartClear');
    if (clearBtn)
    {
      clearBtn.addEventListener('click', () =>
      {
        save([]);
        mount.hidden = true;
        if (message)
        {
          message.value = message.value
            .replace(/Poptávaná technika:[\s\S]*?\n\n/, '');
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () =>
  {
    initGearPage();
    initReservationPage();
  });
})();
