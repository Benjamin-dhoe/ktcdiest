const openFiltersBtn = document.getElementById("open-event-filters-btn");
const closeFiltersBtn = document.getElementById("close-event-filters-btn");
const resetFiltersBtn = document.getElementById("reset-event-filters-btn");
const filtersDiv = document.getElementById("filters-div");
const filterCheckboxes = document.querySelectorAll(".custom-checkbox input[type='checkbox']");

const dateRangeInput = document.getElementById("event-date-range");
let eventCards = [];

// ----------------------
// DATE RANGE PICKER
// ----------------------
let selectedStart = null;
let selectedEnd = null;

flatpickr(dateRangeInput, {
  mode: "range",
  dateFormat: "d-m-Y",
  minDate: "today",
  onChange: function(selectedDates) {
    if (selectedDates.length === 2) {
      selectedStart = selectedDates[0];
      selectedEnd = selectedDates[1];
    } else {
      selectedStart = null;
      selectedEnd = null;
    }
    applyFilters();
  }
});

// Set default filter range: today → 6 months ahead
const today = new Date();
const sixMonthsAhead = new Date();
sixMonthsAhead.setMonth(sixMonthsAhead.getMonth() + 6);

selectedStart = today;
selectedEnd = sixMonthsAhead;

dateRangeInput.value =
  today.toLocaleDateString("nl-BE") + " tot " +
  sixMonthsAhead.toLocaleDateString("nl-BE");

// ----------------------
// OPEN / CLOSE FILTER PANEL
// ----------------------
openFiltersBtn.addEventListener("click", () => {
  filtersDiv.classList.add("open");
});

closeFiltersBtn.addEventListener("click", () => {
  filtersDiv.classList.remove("open");
});

// ----------------------
// RESET FILTERS
// ----------------------
resetFiltersBtn.addEventListener("click", () => {
  // Reset date
  dateRangeInput.value = "";
  selectedStart = null;
  selectedEnd = null;

  // Reset checkboxes
  filterCheckboxes.forEach(cb => cb.checked = false);

  showAllEvents();
});

// ----------------------
// LIVE FILTERING ON CHECKBOX CHANGE
// ----------------------
filterCheckboxes.forEach(cb => cb.addEventListener("change", applyFilters));

// ----------------------
// FILTER LOGIC
// ----------------------
function applyFilters() {
  const selectedTypes = getCheckedValues("event-type");
  const selectedAges = getCheckedValues("event-age");

  eventCards.forEach(card => {
    const cardStart = parseDate(card.getAttribute("filter-date-start"));
    const cardEnd = parseDate(card.getAttribute("filter-date-end"));
    const cardType = card.getAttribute("filter-type").toLowerCase();
    // const cardAges = JSON.parse(card.getAttribute("filter-leeftijd").toLowerCase());
    let rawAges = card.getAttribute("filter-leeftijd") || "[]";
    // Replace single quotes with double quotes
    rawAges = rawAges.replace(/'/g, '"').trim();
    // Add missing closing bracket if needed
    if (!rawAges.endsWith("]")) {
      rawAges = rawAges + "]";
    }
    let cardAges = [];
    try {
      cardAges = JSON.parse(rawAges).map(a => String(a).toLowerCase());
    } catch (e) {
      console.warn("Invalid leeftijd JSON:", rawAges);
      cardAges = [];
    }


    let visible = true;

    // Date filter
    if (selectedStart && selectedEnd) {
      if (cardEnd < selectedStart || cardStart > selectedEnd) {
        visible = false;
      }
    }

    // Type filter
    if (selectedTypes.length > 0 && !selectedTypes.includes(cardType)) {
      visible = false;
    }

    // Age filter
    if (selectedAges.length > 0) {
      const match = selectedAges.some(age => cardAges.includes(age));
      if (!match) {
        visible = false;
      }
    }

    card.style.display = visible ? "block" : "none";
  });
  const visibleCards = Array.from(eventCards).filter(card => card.style.display !== "none");
  const availableCheckboxValues = [...new Set(
    visibleCards.map(card => card.getAttribute("filter-type").toLowerCase())
  )];
  filterCheckboxes.forEach(cb => {
    const isAvailable = availableCheckboxValues.includes(cb.value.toLowerCase());

    const wrapper = cb.closest(".custom-checkbox");
  
    if (isAvailable) {
      wrapper.style.display = "flex";
    } else {
      wrapper.style.display = "none";
    }
  });
}

function showAllEvents() {
  eventCards.forEach(card => card.style.display = "block");
}

function getCheckedValues(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)]
    .map(cb => cb.value.toLowerCase());
}

function parseDate(str) {
  const [day, month, year] = str.split("-").map(Number);
  return new Date(year, month - 1, day);
}

async function loadEvents() {
  try {
    const response = await fetch(
      "https://getevents-eqi5l3wztq-ew.a.run.app"
    );

    const html = await response.text();

    console.log(html);

    document.querySelector("#events-container").innerHTML = html;

  } catch (err) {
    console.error(err);
  }
}
async function populateEventSection() {
  try {
    await loadEvents();
    eventCards = document.querySelectorAll(".event-holder");
    applyFilters();

  } catch (err) {
    console.error(err);
  }
}
populateEventSection();
