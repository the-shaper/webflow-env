import Calculator from './Calculator'
import FormController from './FormController'
import RadioManager from './RadioManager'
import SummaryModal from './SummaryModal'

function initializeForm() {
  const calculator = new Calculator()
  const radioManager = new RadioManager()
  const formController = new FormController(calculator)
  const summaryModal = new SummaryModal()

  // Subscribe modal to price updates
  calculator.subscribe((prices) => {
    const totalElement = document.getElementById('form-totalprice')
    if (totalElement) {
      totalElement.textContent = calculator.formatCurrency(
        prices.get('total') || 0
      )
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
