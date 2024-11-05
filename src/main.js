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
  // Detect if we're on mobile
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )

  flatpickr(datepickerElement, {
    dateFormat: 'm-d-Y',
    disableMobile: true, // Force flatpickr UI on mobile
    allowInput: true,
    altInput: true,
    altFormat: 'm/d/Y',
    placeholder: 'mm/dd/yyyy',
    onChange: function (selectedDates, dateStr, instance) {
      instance.altInput.classList.add('date-picker')
    },
    onReady: function (selectedDates, dateStr, instance) {
      // Add necessary classes to the alt input
      instance.altInput.classList.add('date-picker')

      // If on mobile, add specific mobile class
      if (isMobile) {
        instance.altInput.classList.add('mobile-date-picker')
      }

      // Ensure the input maintains its visibility
      instance.altInput.style.display = 'block'
      instance.input.style.display = 'none'
    },
  })
}
