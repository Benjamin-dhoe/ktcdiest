import { showMessage } from '/js/uiMessage.js';

const registerBtn = document.getElementById("register-btn");
const loadingRegister = document.getElementById("loading-register");

// IMPORTANT: make sure this exists globally or pass it in
// fallback safety added below
const eventFormFieldsSafe = window.eventFormFields || [];

if (registerBtn) {
  registerBtn.addEventListener("click", async () => {

    if (loadingRegister) loadingRegister.style.display = "block";
    registerBtn.disabled = true;

    try {

      const answers = [];

      document.querySelectorAll(".event-question").forEach((el) => {

        const question =
          el.querySelector(".subsection-title")?.innerText || "Vraag";

        const textInput = el.querySelector('input[type="text"]');
        const radioInput = el.querySelector('input[type="radio"]:checked');
        const checkedBoxes = el.querySelectorAll('input[type="checkbox"]:checked');

        if (textInput) {
          answers.push({
            question,
            value: textInput.value || ""
          });
        }

        else if (radioInput) {
          answers.push({
            question,
            value: radioInput.value
          });
        }

        else if (checkedBoxes.length > 0) {
          answers.push({
            question,
            value: Array.from(checkedBoxes).map(x => x.value)
          });
        }
      });

      const payload = {
        eventId: document.getElementById("eventid")?.textContent?.trim() || "",
        answers,
      };

      const res = await fetch("https://registerevent-eqi5l3wztq-ew.a.run.app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        showMessage("Inschrijving gelukt!", "success");
      } else {
        showMessage("Fout bij inschrijven", "error");
      }

    } catch (err) {
      console.error(err);
      showMessage("Er ging iets mis", "error");
    }

    if (loadingRegister) loadingRegister.style.display = "none";
    registerBtn.disabled = false;

  });
}