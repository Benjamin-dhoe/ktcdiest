const navMenu = document.getElementById("navlinks");
const logoBall = document.getElementById("logoball");
const serveVidHolder = document.getElementById("serve-vid-holder");
const serveVid = document.getElementById("serve-vid");
const openBtn = document.getElementById("open-nav-btn");
const closeBtn = document.getElementById("close-nav-btn");
function restartSpin() {
  logoBall.style.display = "block";
  logoBall.classList.remove("spin");
  // force reflow so browser “commits” the removal
  void logoBall.offsetHeight; // or logoBall.offsetWidth
  logoBall.classList.add("spin");
}
let logoHandler = null;
let endedHandler = null;
function cleanupVideoHandlers() {
  if (logoHandler) serveVid.removeEventListener("timeupdate", logoHandler);
  if (endedHandler) serveVid.removeEventListener("ended", endedHandler);
  logoHandler = null;
  endedHandler = null;
}
// Extra safety for iOS
serveVid.muted = true;
serveVid.setAttribute("playsinline", "");
serveVid.setAttribute("webkit-playsinline", "");
openBtn.addEventListener("click", () => {
  openBtn.classList.add("fade-out");
  // IMPORTANT: remove any previous handlers first
  cleanupVideoHandlers();
  // Make holder visible clearly (0.1 is almost invisible)
  serveVidHolder.style.opacity = 0.1;
  serveVidHolder.style.pointerEvents = "auto";
  // Fully reset playback
  serveVid.pause();
  serveVid.currentTime = 0;
  serveVid.play().then(() => {
    navMenu.classList.add("startopen");
  }).catch(err => {
    console.log("Video playback blocked:", err);
  });
  logoHandler = () => {
    if (serveVid.currentTime >= 0.2) {
      restartSpin();
      navMenu.classList.add("endopen");
      serveVid.removeEventListener("timeupdate", logoHandler);
      logoHandler = null;
    }
  };
  endedHandler = () => {
    serveVidHolder.style.opacity = 0;
    serveVidHolder.style.pointerEvents = "none";
    logoBall.style.display = "none";
    navMenu.querySelectorAll(".navlink").forEach(link => {
      link.style.transition = "opacity 0.3s ease";
      link.style.opacity = 1;
    });
    // clean reference
    endedHandler = null;
  };
  serveVid.addEventListener("timeupdate", logoHandler);
  serveVid.addEventListener("ended", endedHandler, { once: true });
});
closeBtn.addEventListener("click", () => {
  navMenu.querySelectorAll(".navlink").forEach(link => {
    link.style.opacity = 0;
  });
  // stop & reset video + hide holder to avoid “ended” firing later
  cleanupVideoHandlers();
  serveVid.pause();
  serveVid.currentTime = 0;
  serveVidHolder.style.opacity = 0;
  serveVidHolder.style.pointerEvents = "none";
  logoBall.style.display = "none";
  logoBall.classList.remove("spin");
  navMenu.classList.remove("endopen", "startopen");
  openBtn.classList.remove("fade-out");
});