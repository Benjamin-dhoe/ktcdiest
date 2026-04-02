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

      eventFormFieldsSafe.forEach((field, index) => {

        const question = field.question || field.label || "Vraag";

        // TEXT
        if (field.type === "text") {
          const input = document.querySelector(`input[name="field_${index}"]`);

          answers.push({
            label: field.label,
            question,
            value: input ? input.value : ""
          });
        }

        // SINGLE CHOICE
        else if (field.type === "list-single") {
          const selected = document.querySelector(`input[name="field_${index}"]:checked`);

          answers.push({
            label: field.label,
            question,
            value: selected ? selected.value : ""
          });
        }

        // MULTIPLE CHOICE
        else if (field.type === "list-multiple") {
          const selected = Array.from(
            document.querySelectorAll(`input[name="field_${index}"]:checked`)
          ).map(el => el.value);

          answers.push({
            label: field.label,
            question,
            value: selected
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