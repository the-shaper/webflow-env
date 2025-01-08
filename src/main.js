import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.min.css'
import 'flatpickr/dist/themes/dark.css'

// Import both form implementations
import initializeForm from './features/formCore'
import initializeForm2 from './features/formCore2'
import './styles/style.css'
// import initMasonryGrid from './features/Galleries/main-gal.js'
import initTabs from './features/Galleries/dynamic-gal.js'
import initTestimonials from './features/Galleries/testimonials.js'
import MenuController from './features/ok-home.js'

// Initialize both forms if their respective elements exist
const mainForm = document.querySelector('[data-form="main"]')
  ? initializeForm()
  : null

const secondForm = document.querySelector('[data-form="second"]')
  ? initializeForm2()
  : null

// Initialize Galleries
// initMasonryGrid()

// Initialize Menu Controller
document.querySelector('[data-menu-trigger]') && new MenuController()

// Initialize Tabs if elements exist
document.querySelector('.standard-button-style') && initTabs()

// Initialize Testimonials
initTestimonials()

// Make calculators available globally
window.calculator = mainForm?.calculator
window.calculator2 = secondForm?.calculator

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
