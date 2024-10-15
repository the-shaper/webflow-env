function openModal() {
  const modalBackground = document.getElementById('modal-background')
  if (modalBackground) {
    modalBackground.style.display = 'flex'
  }
}

function closeModal() {
  const modalBackground = document.getElementById('modal-background')
  if (modalBackground) {
    modalBackground.style.display = 'none'
  }
}

export function initializeModal() {
  const modalBackground = document.getElementById('modal-background')
  const openModalButton = document.getElementById('open-modal')
  const closeModalButton = document.getElementById('close-modal-button')

  if (openModalButton) {
    openModalButton.addEventListener('click', openModal)
  } else {
    console.warn('Open modal button not found')
  }

  if (closeModalButton) {
    closeModalButton.addEventListener('click', closeModal)
  } else {
    console.warn('Close modal button not found')
  }

  if (modalBackground) {
    modalBackground.addEventListener('click', (event) => {
      // Close the modal only if the click is directly on the background
      if (event.target === modalBackground) {
        closeModal()
      }
    })
  } else {
    console.warn('Modal background not found')
  }
}
