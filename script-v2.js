
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
    const OFFSET = 100;
    const ACTIVE_CLASS = "menu-nav_item-active";
    const menuBlock = document.getElementById("rec1399455211");

    const anchors = Array.from(document.querySelectorAll('a[name]'));
    const menuButtons = Array.from(menuBlock.querySelectorAll(".menu-nav_item"));

    let lastAnchorName = null;

    function getCurrentAnchorName() {
      const scrollY = window.scrollY + OFFSET;
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

    // function setActiveButton(anchorName) {
    //   menuButtons.forEach((button) => {
    //     const link = button.querySelector("a");
    //     if (!link) return;

    //     const href = link.getAttribute("href") || "";
    //     const targetName = href.replace("#", "");

    //     if (targetName === anchorName) {
    //       button.classList.add(ACTIVE_CLASS);
    //     } else {
    //       button.classList.remove(ACTIVE_CLASS);
    //     }
    //   });
    // }

//     function setActiveButton(anchorName) {
//   menuButtons.forEach((button) => {
//     const link = button.querySelector("a");
//     if (!link) return;

//     const href = link.getAttribute("href") || "";
//     const targetName = href.replace("#", "");

//     if (targetName === anchorName) {
//       button.classList.add(ACTIVE_CLASS);

//       // Прокручиваем родительский контейнер к активной кнопке
//       button.scrollIntoView({
//         behavior: 'smooth',
//         block: 'nearest',
//         inline: 'center', // важно: по горизонтали — в центр
//       });
//     } else {
//       button.classList.remove(ACTIVE_CLASS);
//     }
//   });
// }


    function setActiveButton(anchorName) {
  const scrollContainer = document.querySelector(".menu_wrapper .tn-molecule");

  if (!scrollContainer) return;

  menuButtons.forEach((button) => {
    const link = button.querySelector("a");
    if (!link) return;

    const href = link.getAttribute("href") || "";
    const targetName = href.replace("#", "");

    if (targetName === anchorName) {
      button.classList.add(ACTIVE_CLASS);

      const containerRect = scrollContainer.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();

      const offsetLeft = buttonRect.left - containerRect.left;
      const scrollTo = offsetLeft + scrollContainer.scrollLeft - (scrollContainer.clientWidth / 2 - button.offsetWidth / 2);

      scrollContainer.scrollTo({
        left: scrollTo,
        behavior: "smooth"
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

    const throttledScroll = throttle(handleScroll, 100);
    window.addEventListener('scroll', throttledScroll);
    window.addEventListener('resize', throttledScroll);
    throttledScroll();
  });

