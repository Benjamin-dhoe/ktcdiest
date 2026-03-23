
export function createLoadingSpinner() {
  const spinner = document.createElement("div");
  spinner.classList.add("loading-spinner");
  spinner.innerHTML = `
    <lottie-player src="/images/loading.json" background="transparent" speed="1" loop="" autoplay=""></lottie-player>
  `;
  return spinner;
}

export function showLoadingSpinner(container) {
  const spinner = createLoadingSpinner();
  container.appendChild(spinner);
  return spinner;
}

export function removeLoadingSpinner(container) {
  const spinner = container.querySelector('.loading-spinner');
  if (spinner) {
    spinner.remove();
  }
}
