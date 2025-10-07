function initScrollSpy({
  scrollOffset = 300,
  activeClass = "menu-nav_item-active",
  menuBlockId,
  menuButtonSelector = ".menu-nav_item",
  anchorSelector = 'a[name]',
  scrollContainerSelector = ".menu_wrapper .tn-molecule",
  throttleMs = 100,
}) {
  if (!menuBlockId) {
    console.warn("ScrollSpy: не указан menuBlockId");
    return;
  }

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
    const menuBlock = document.getElementById(menuBlockId);
    if (!menuBlock) return;

    const anchors = Array.from(document.querySelectorAll(anchorSelector));
    const menuButtons = Array.from(menuBlock.querySelectorAll(menuButtonSelector));
    const scrollContainer = document.querySelector(scrollContainerSelector);

    if (!anchors.length || !menuButtons.length) return;

    // === Изначально: очищаем все активные классы ===
    menuButtons.forEach((btn) => btn.classList.remove(activeClass));

    let lastAnchorName = null;

    function getCurrentAnchorName() {
      const scrollY = window.scrollY + scrollOffset;
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

      return currentAnchor?.getAttribute("name") || null;
    }

    function setActiveButton(anchorName) {
      menuButtons.forEach((button) => {
        const link = button.querySelector("a");
        if (!link) return;

        const href = link.getAttribute("href") || "";
        const targetName = href.replace("#", "");

        if (anchorName && targetName === anchorName) {
          button.classList.add(activeClass);

          if (scrollContainer) {
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
          }
        } else {
          button.classList.remove(activeClass);
        }
      });
    }

    function handleScroll() {
      const current = getCurrentAnchorName();
      if (current !== lastAnchorName) {
        lastAnchorName = current;
        setActiveButton(current);
        // console.log("Текущий якорь:", current);
      }
    }

    const throttledScroll = throttle(handleScroll, throttleMs);
    window.addEventListener("scroll", throttledScroll);
    window.addEventListener("resize", throttledScroll);
    throttledScroll(); 
  });
}
