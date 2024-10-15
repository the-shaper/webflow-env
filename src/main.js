import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.min.css'
import 'flatpickr/dist/themes/dark.css'

import initializeCalculator from './features/calculator'
import initializeFormLogic from './features/formLogic'
import initializeRadioButtons from './features/radiobutts'
import './styles/style.css'

const calculator = initializeCalculator()
initializeFormLogic(calculator)
initializeRadioButtons()

const datepickerElement = document.querySelector('[data-element="datepicker"]')
if (datepickerElement) {
  flatpickr(datepickerElement, {
    dateFormat: 'm-d-Y',
  })
}
