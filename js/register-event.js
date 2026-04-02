const registerBtn = document.getElementById("register-btn");
import { showMessage } from '/js/uiMessage.js';
if (registerBtn) {
    registerBtn.addEventListener("click", async () => {

    const answers = [];

    eventFormFields.forEach((field, index) => {

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
        const selected = Array.from(document.querySelectorAll(`input[name="field_${index}"]:checked`))
          .map(el => el.value);

        answers.push({
          label: field.label,
          question,
          value: selected
        });
      }
    });

    const payload = {
      eventId: event.id || currentEventId || "",
      answers,
      email: document.querySelector("#email")?.value || "",
      name: document.querySelector("#name")?.value || "",
      timestamp: new Date().toISOString()
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
  });
}
