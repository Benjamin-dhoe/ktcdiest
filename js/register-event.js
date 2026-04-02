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

        const label =
          el.querySelector(".subsection-title")?.getAttribute("data-label") || "label";

        const textInput = el.querySelector('input[type="text"]');
        const radioInput = el.querySelector('input[type="radio"]:checked');
        const checkedBoxes = el.querySelectorAll('input[type="checkbox"]:checked');

        if (textInput) {
          answers.push({
            label,
            value: textInput.value || ""
          });
        }

        else if (radioInput) {
          answers.push({
            label,
            value: radioInput.value
          });
        }

        else if (checkedBoxes.length > 0) {
          answers.push({
            label,
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

        const section = document.getElementById("inschrijven-section");

        if (section) {
          section.innerHTML = `
            <div class="event-success-box">
              <div class="event-success-title">Inschrijving gelukt 🎉</div>
              <div class="event-success-text">
                Je hebt ingeschreven voor dit event.<br>
                Herlaad de pagina om een nieuwe inschrijving te plaatsen.
              </div>
            </div>
          `;
        }
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