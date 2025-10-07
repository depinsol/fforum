

  // ======== НАСТРОЙКИ ========

  // Отступ (в пикселях) от верха окна до якоря, при котором активируется кнопка
  const SCROLL_OFFSET_FOR_ACTIVE = 300;

  // CSS-класс, который добавляется активной кнопке меню
  const ACTIVE_CLASS = "menu-nav_item-active";

  // ID блока меню (важно: смотрим по Tilda ID)
  const MENU_BLOCK_ID = "rec1399455211";

  // CSS-селектор кнопок меню (элементы, которые переключают активность)
  const MENU_BUTTON_SELECTOR = ".menu-nav_item";

  // Селектор якорных элементов (по имени)
  const ANCHOR_SELECTOR = 'a[name]';

  // Селектор скролл-контейнера (обёртка вокруг меню, которую надо прокручивать)
  const SCROLL_CONTAINER_SELECTOR = ".menu_wrapper .tn-molecule";

  // Частота обновления в миллисекундах (throttle)
  const SCROLL_THROTTLE_MS = 100;

  // ===========================

  // Утилита для "throttle" — ограничивает частоту вызовов
  function throttle(callee, timeout) {
    let timer = null;
    return function (...args) {
      if (timer) return;
      timer = setTimeout(() => {
        callee(...args);
        timer = null;
      }, timeout);
    };
  }

  document.addEventListener("DOMContentLoaded", function () {
    const menuBlock = document.getElementById(MENU_BLOCK_ID);

    const anchors = Array.from(document.querySelectorAll(ANCHOR_SELECTOR));
    const menuButtons = Array.from(menuBlock.querySelectorAll(MENU_BUTTON_SELECTOR));

    let lastAnchorName = null;

    function getCurrentAnchorName() {
      const scrollY = window.scrollY + SCROLL_OFFSET_FOR_ACTIVE;
      let currentAnchor = null;

      for (let i = 0; i < anchors.length; i++) {
        const anchor = anchors[i];
        const top = anchor.getBoundingClientRect().top + window.scrollY;
        if (scrollY >= top) {
          currentAnchor = anchor;
        } else {
          break;
        }
      }

      return currentAnchor?.getAttribute('name') || null;
    }

    function setActiveButton(anchorName) {
      const scrollContainer = document.querySelector(SCROLL_CONTAINER_SELECTOR);
      if (!scrollContainer) return;

      menuButtons.forEach((button) => {
        const link = button.querySelector("a");
        if (!link) return;

        const href = link.getAttribute("href") || "";
        const targetName = href.replace("#", "");

        if (targetName === anchorName) {
          button.classList.add(ACTIVE_CLASS);

          // Центрируем кнопку в скролл-контейнере
          const containerRect = scrollContainer.getBoundingClientRect();
          const buttonRect = button.getBoundingClientRect();

          const offsetLeft = buttonRect.left - containerRect.left;
          const scrollTo =
            offsetLeft +
            scrollContainer.scrollLeft -
            (scrollContainer.clientWidth / 2 - button.offsetWidth / 2);

          scrollContainer.scrollTo({
            left: scrollTo,
            behavior: "smooth",
          });

        } else {
          button.classList.remove(ACTIVE_CLASS);
        }
      });
    }

    function handleScroll() {
      const current = getCurrentAnchorName();
      if (current && current !== lastAnchorName) {
        lastAnchorName = current;
        setActiveButton(current);
        console.log("Текущий якорь:", current);
      }
    }

    const throttledScroll = throttle(handleScroll, SCROLL_THROTTLE_MS);
    window.addEventListener("scroll", throttledScroll);
    window.addEventListener("resize", throttledScroll);
    throttledScroll();
  });

