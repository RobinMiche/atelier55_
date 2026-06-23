document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      siteNav.classList.toggle("open");
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
    });
  }

  const CART_KEY = "atelier55-cart";

  const getCart = () => {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  };

  const saveCart = (cart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  };

  const updateCartCount = () => {
    const countElement = document.getElementById("cart-count");
    if (!countElement) return;

    const cart = getCart();
    const count = cart.length;
    countElement.textContent = `${count} ${count === 1 ? "položka" : count > 1 && count < 5 ? "položky" : "položek"}`;
  };

  const addButtons = document.querySelectorAll(".add-to-cart");
  addButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const name = button.dataset.name;
      const price = button.dataset.price;

      const cart = getCart();
      cart.push({ name, price });
      saveCart(cart);
      updateCartCount();

      button.textContent = "Přidáno";
      button.disabled = true;

      setTimeout(() => {
        button.textContent = "Přidat do poptávky";
        button.disabled = false;
      }, 1200);
    });
  });

  const renderReservationGear = () => {
    const listContainer = document.getElementById("selected-gear-list");
    const gearTextarea = document.getElementById("gearSelection");

    if (!listContainer || !gearTextarea) return;

    const cart = getCart();

    if (cart.length === 0) {
      listContainer.innerHTML = "<p>Zatím nemáš vybranou žádnou techniku.</p>";
      gearTextarea.value = "";
      return;
    }

    const list = document.createElement("ul");
    let textOutput = "";

    cart.forEach((item, index) => {
      const li = document.createElement("li");
      li.textContent = `${item.name} – ${item.price} Kč / den`;
      list.appendChild(li);

      textOutput += `${index + 1}. ${item.name} – ${item.price} Kč / den\n`;
    });

    listContainer.innerHTML = "";
    listContainer.appendChild(list);
    gearTextarea.value = textOutput.trim();
  };

  const clearCartButton = document.getElementById("clear-cart");
  if (clearCartButton) {
    clearCartButton.addEventListener("click", () => {
      localStorage.removeItem(CART_KEY);
      renderReservationGear();
      updateCartCount();
    });
  }

  updateCartCount();
  renderReservationGear();
});
