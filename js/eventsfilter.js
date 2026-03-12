const openFiltersBtn = document.getElementById("open-event-filters-btn");
const closeFiltersBtn = document.getElementById("close-event-filters-btn");
const applyFiltersBtn = document.getElementById("apply-event-filters-btn");
const resetFiltersBtn = document.getElementById("reset-event-filters-btn");
const filtersDiv = document.getElementById("filters-div");

const dateRangeInput = document.getElementById("event-date-range");
const eventCards = document.querySelectorAll(".event-holder");

// ----------------------
// DATE RANGE PICKER
// ----------------------
let selectedStart = null;
let selectedEnd = null;

flatpickr(dateRangeInput, {
  mode: "range",
  dateFormat: "d-m-Y",
  onChange: function(selectedDates) {
    if (selectedDates.length === 2) {
      selectedStart = selectedDates[0];
      selectedEnd = selectedDates[1];
    }
  }
});

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
  dateRangeInput.value = "";
  selectedStart = null;
  selectedEnd = null;

  document.querySelectorAll(".holder-filter-checks input[type='checkbox']")
    .forEach(cb => cb.checked = false);

  showAllEvents();
});

// ----------------------
// APPLY FILTERS
// ----------------------
applyFiltersBtn.addEventListener("click", () => {
  applyFilters();
  filtersDiv.classList.remove("open");
});

// ----------------------
// FILTER LOGIC
// ----------------------
function applyFilters() {
  const selectedTypes = getCheckedValues("Type event");
  const selectedAges = getCheckedValues("Leeftijd");

  eventCards.forEach(card => {
    const cardStart = parseDate(card.getAttribute("filter-date-start"));
    const cardEnd = parseDate(card.getAttribute("filter-date-end"));
    const cardType = card.getAttribute("filter-type").toLowerCase();
    const cardAges = JSON.parse(card.getAttribute("filter-leeftijd").toLowerCase());

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
      if (!match) visible = false;
    }

    card.style.display = visible ? "block" : "none";
  });
}

function showAllEvents() {
  eventCards.forEach(card => card.style.display = "block");
}

function getCheckedValues(sectionLabel) {
  const section = [...document.querySelectorAll(".filter-category")]
    .find(cat => cat.querySelector("label").textContent.trim() === sectionLabel);

  return [...section.querySelectorAll("input[type='checkbox']:checked")]
    .map(cb => cb.nextElementSibling.textContent.trim().toLowerCase());
}

function parseDate(str) {
  const [day, month, year] = str.split("-").map(Number);
  return new Date(year, month - 1, day);
}

