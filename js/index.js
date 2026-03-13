document.querySelectorAll('.section.withcoach').forEach((section) => {
    const coach = section.querySelector('.holdercoachview');
    const content = section.querySelector('.containcenter');
    const mainCoachIm = section.querySelector('.coachview.main');
    if (!coach || !content || !mainCoachIm) return; // safety guard
    // Hover effect
    mainCoachIm.addEventListener("mouseover", () => {
      mainCoachIm.style.opacity = 1;
      content.style.opacity = 0.3;
    });
    mainCoachIm.addEventListener("mouseout", () => {
      mainCoachIm.style.opacity = 0;
      content.style.opacity = 1;
    });
    // Fixed positioning observer
    /*
    const obsCallback = (entries) => {
      entries.forEach(entry => {
        coach.classList.toggle("is-fixed", entry.isIntersecting);
      });
    };
    const obsOptions = {
      root: null,
      rootMargin: "-100% 0px 0px 0px",
    };
    const observer = new IntersectionObserver(obsCallback, obsOptions);
    observer.observe(section);
    // Visibility / animation observer
    const obsVisibleCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          coach.classList.add("is-visible");
          setTimeout(() => {
            mainCoachIm.style.opacity = 0;
            setTimeout(() => {
              content.style.opacity = 1;
            }, 800);
          }, 800);
        }
      });
    };
    const obsVisibleOptions = {
      root: null,
      threshold: 0,
      rootMargin: "0px 0px -400px 0px"
    };
    const observerVisible = new IntersectionObserver(obsVisibleCallback, obsVisibleOptions);
    observerVisible.observe(section);
   */
  });
  let scrollTimeout;
  window.addEventListener(
    "scroll",
    () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        document
          .querySelectorAll('.coachview.main')
          .forEach(mainCoachIm => {
            mainCoachIm.style.opacity = 0;
            mainCoachIm.parentElement.parentElement.querySelector(".containcenter").style.opacity = 1;
          });
      }, 50);
    },
    { passive: true }
  );

AOS.init({
  duration: 1000,      // animation duration in ms
  offset: 120,         // trigger animation when element is 120px from viewport
  easing: 'ease-out',  // easing of animation
  once: true,          // animation happens only once
  mirror: false        // whether elements animate out while scrolling past
});