import Calculator from './Calculator'
import FormController from './FormController'
import RadioManager from './RadioManager'
import SummaryModal from './SummaryModal'

function initializeForm() {
  const calculator = new Calculator()
  const radioManager = new RadioManager()
  const formController = new FormController(calculator)
  const summaryModal = new SummaryModal()

  // Get modal button
  const modalButton = document.querySelector('.f-modal-button')
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
    const totalElement = document.getElementById('form-totalprice')
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
      // Optional: Update pointer events to visually indicate disabled state
      modalButton.style.pointerEvents = isInactive ? 'none' : 'auto'
      // Add aria-disabled for accessibility
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

export default initializeForm
