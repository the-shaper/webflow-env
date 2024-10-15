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

function updateModal(maxPages) {
  const modalContent = document.getElementById('modal-content')
  if (!modalContent) {
    console.error('Modal content element not found')
    return
  }

  // Clear existing content
  modalContent.innerHTML =
    '<h3 class="modal-main-title">Your Package Summary</h3>'

  let totalPrice = 0

  for (let i = 1; i <= maxPages; i++) {
    const formPage = document.getElementById(`f-p${i}`)
    if (!formPage) continue

    const formFields = document.getElementById(`p${i}-formfields`)
    if (!formFields) continue

    let pageHasSelections = false
    const pageWrapper = document.createElement('div')
    pageWrapper.className = 'formPage-data-wrapper'

    const titleElement = document.createElement('h4')
    titleElement.className = 'modal-page-title'
    const pageTitle = formPage.querySelector('h3')
    titleElement.textContent = pageTitle ? pageTitle.textContent : `Page ${i}`

    // Function to create and append service selection
    const appendServiceSelection = (name, className) => {
      const selectedRadio = formFields.querySelector(
        `input[name="${name}"]:checked`
      )
      if (selectedRadio) {
        if (!pageHasSelections) {
          pageWrapper.appendChild(titleElement)
          pageHasSelections = true
        }

        const selectionWrapper = document.createElement('div')
        selectionWrapper.className = `selected-concept-wrapper ${className}`

        const serviceType = document.createElement('p')
        serviceType.className = 'modal-service-type'
        serviceType.textContent = selectedRadio.value
        selectionWrapper.appendChild(serviceType)

        const servicePrice = document.createElement('p')
        servicePrice.className = 'modal-service-price'
        const price = parseFloat(selectedRadio.dataset.price) || 0
        servicePrice.textContent = `$${price.toFixed(2)}`
        selectionWrapper.appendChild(servicePrice)

        pageWrapper.appendChild(selectionWrapper)
        totalPrice += price
      }
    }

    // Append main service selection
    appendServiceSelection(`p${i}-services`, 'main-service')

    // Append photo service selection if exists
    appendServiceSelection(`p${i}-fotos`, 'photo-service')

    // Append video service selection if exists
    appendServiceSelection(`p${i}-video`, 'video-service')

    if (pageHasSelections) {
      modalContent.appendChild(pageWrapper)
    }
  }

  const totalPriceElement = document.createElement('p')
  totalPriceElement.id = 'modal-total-price'
  totalPriceElement.className = 'modal-total-price'
  totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)}`
  modalContent.appendChild(totalPriceElement)
}

export function initializeModal() {
  function setup() {
    const modalBackground = document.getElementById('modal-background')
    const modalContent = document.getElementById('modal-content')
    const openModalButton = document.getElementById('open-modal')
    const closeModalButton = document.getElementById('close-modal-button')

    if (!modalContent) {
      console.error('Modal content element not found')
      return
    }

    if (openModalButton) {
      openModalButton.addEventListener('click', () => {
        updateModal(document.querySelectorAll('.f-page').length)
        openModal()
      })
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
        if (event.target === modalBackground) {
          closeModal()
        }
      })
    } else {
      console.warn('Modal background not found')
    }
  }

  // Ensure the DOM is fully loaded before running the setup
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup)
  } else {
    setup()
  }
}
