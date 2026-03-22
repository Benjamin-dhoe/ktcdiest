document.addEventListener('DOMContentLoaded', function() {
  var currentTime = new Date().getTime();
  // Update the stored time
  localStorage.setItem('pageOpenTime', currentTime);
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      signOut(auth).then(() => {
        console.log('User signed out.');
        deleteCookie('token');
        window.location.href = '/index';
      }).catch((error) => {
        console.error('Error signing out:', error);
      });
    });
  }
  const navLottie = document.getElementById("navLottie");
  const tabMenu = document.getElementById("tabmenu");

  let isMenuOpen = false;

  function toggleMenu() {
      tabMenu.style.opacity = isMenuOpen ? "0" : "1";
      tabMenu.style.height = isMenuOpen ? "0vh" : "90vh";
      tabMenu.style.visibility = isMenuOpen ? "hidden" : "visible";

      navLottie.seek(0);
      navLottie.play();
      isMenuOpen = !isMenuOpen;

      if (isMenuOpen) {
          document.body.style.overflow = "hidden";
      } else {
          document.body.style.overflow = "";
      }
  }

  navLottie.addEventListener("click", toggleMenu);
});
document.addEventListener('visibilitychange', function() {
  if (!document.hidden) {
    var currentTime = new Date().getTime();
    var storedTime = localStorage.getItem('pageOpenTime');
    if (!storedTime || (currentTime - storedTime) > 2 * 60 * 60 * 1000) {
      // Reload the page
      location.reload();
    }
    // Update the stored time
    localStorage.setItem('pageOpenTime', currentTime);
  }
});
