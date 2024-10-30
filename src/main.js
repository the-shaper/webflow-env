import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.min.css'
import 'flatpickr/dist/themes/dark.css'

// Old implementation imports (commented out for now)
// import initializeCalculator from './features/calculator'
// import initializeFormLogic from './features/formLogic'
// import initializeRadioButtons from './features/radiobutts'
// import { initializeModal } from './features/updateModal'

// New implementation import
import initializeForm from './features/formCore'
import './styles/style.css'

// Old implementation initialization (commented out for now)
// const calculator = initializeCalculator()
// initializeFormLogic(calculator)
// initializeRadioButtons()
// initializeModal()

// New implementation initialization
const form = initializeForm()

// Make calculator available globally (as in old implementation)
window.calculator = form.calculator

const datepickerElement = document.querySelector('[data-element="datepicker"]')
if (datepickerElement) {
  flatpickr(datepickerElement, {
    dateFormat: 'm-d-Y',
  })
}
