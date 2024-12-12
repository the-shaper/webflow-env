import Calculator from './Calculator'
import FormController from './FormController'
import RadioManager from './RadioManager'
import SummaryModal from './SummaryModal'

function initializeForm2() {
  const secondForm = document.querySelector('[data-form="second"]')
  if (!secondForm) {
    console.log('⚪ Form2 not found in this page')
    return null
  }

  console.log('🟣 FormCore2 Init:', {
    page: document.title,
    formId: secondForm.id,
    formFields: Array.from(
      secondForm.querySelectorAll('[id$="-formfields"]')
    ).map((f) => ({
      id: f.id,
      classes: f.className,
      hasOffClass: f.classList.contains('off'),
    })),
  })

  const calculator = new Calculator()
  const radioManager = new RadioManager()
  const formController = new FormController(calculator)
  const summaryModal = new SummaryModal()

  // Get modal button
  const modalButton = document.querySelector(
    '[data-form="second"] .f-modal-button'
  )
  if (modalButton) {
    modalButton.classList.add('is-off') // Set initial state

    // Add click event listener to prevent clicks when disabled
    modalButton.addEventListener('click', (e) => {
      if (modalButton.classList.contains('is-off')) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    })
  }

  // Subscribe modal to price updates
  calculator.subscribe((prices) => {
    const totalElement = document.querySelector(
      '[data-form="second"] #form-totalprice'
    )
    const totalPrice = prices.get('total') || 0

    // Update total price display
    if (totalElement) {
      totalElement.textContent = calculator.formatCurrency(totalPrice)
    }

    // Update modal button state and disabled property
    if (modalButton) {
      const isInactive = totalPrice === 0
      modalButton.classList.toggle('is-off', isInactive)
      modalButton.disabled = isInactive
      modalButton.style.pointerEvents = isInactive ? 'none' : 'auto'
      modalButton.setAttribute('aria-disabled', isInactive)
    }
  })

  return {
    calculator,
    radioManager,
    formController,
    summaryModal,
  }
}

export default initializeForm2
