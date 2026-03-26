/**
 * Displays a UI message for 5 seconds or until closed.
 * @param {string} message - The message to display.
 * @param {string} type - The type of message ('success', 'error', 'info').
 * @param {HTMLElement} container - The container element to display the message in.
 */
export function showMessage(message, type = 'info', container = document.body) {
    const messageElement = document.createElement('div');
    messageElement.className = `ui-message ${type}`;

    const closeButton = document.createElement('button');
    closeButton.textContent = 'x';
    closeButton.className = 'close-ui-message';

    // Add the message content
    const messageContent = document.createElement('div');
    messageContent.textContent = message;

    messageElement.appendChild(closeButton);
    messageElement.appendChild(messageContent);

    container.appendChild(messageElement);

    setTimeout(() => {
        messageElement.style.opacity = '1';
    }, 10);

    const autoRemove = setTimeout(() => {
        removeMessage(messageElement, container);
    }, 8000);

    closeButton.addEventListener('click', () => {
        clearTimeout(autoRemove);
        removeMessage(messageElement, container);
    });
}

/**
 * Removes the message element from the DOM.
 * @param {HTMLElement} element - The message element to remove.
 * @param {HTMLElement} container - The container from which to remove the element.
 */
export function removeMessage(element, container) {
    element.style.opacity = '0';
    setTimeout(() => {
        container.removeChild(element);
    }, 300);
}
