import { auth } from '/js/firebase.js';
import { signOut } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { removeLoadingSpinner, showLoadingSpinner, createLoadingSpinner } from '/js/Spinner.js';

const user = auth.currentUser;

function refreshToken() {
  const user = auth.currentUser;
  
  if (user) {
    user.getIdToken(true)
      .then((idToken) => {
        console.log("new token:", idToken);
        document.cookie = `token=${idToken}; path=/; Secure; SameSite=Strict; Max-Age=36000`;
      })
      .catch((error) => {
        console.error("Error refreshing token:", error);
      });
  } else {
    console.log("No user is currently signed in.");
  }
}

auth.onAuthStateChanged((user) => {
  if (user) {
    refreshToken();

    setInterval(refreshToken, 30 * 60 * 1000);
  } else {
    console.log("No user is currently signed in.");
  }
});
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
