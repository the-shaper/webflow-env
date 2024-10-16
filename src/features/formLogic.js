import initializeRadioButtons from './radiobutts.js'
import { initializeModal } from './updateModal.js'

function initializeFormLogic(calculator) {
  let currentPage = 1
  let maxPages

  function handleConditionalGroups(event) {
    if (event.target.type !== 'radio') return

    const pageNumber = event.target.name.split('-')[0] // e.g., 'p1' from 'p1-services'
    const currentSwitch = document.getElementById(`${pageNumber}-switch`)

    if (!currentSwitch || !currentSwitch.checked) return

    const groupsToShow = event.target.dataset.showGroup
      ? event.target.dataset.showGroup.split(',').map((g) => g.trim())
      : []

    const allConditionalGroups = document.querySelectorAll(
      `#${pageNumber}-formfields .boxes-radio-wrapper.conditional-group`
    )

    allConditionalGroups.forEach((group) => {
      if (groupsToShow.includes(group.id)) {
        group.classList.add('is-active')
        // Select first option in the newly activated group
        const firstRadio = group.querySelector('input[type="radio"]')
        if (firstRadio) {
          firstRadio.checked = true
          firstRadio.dispatchEvent(new Event('change', { bubbles: true }))
        }
      } else {
        group.classList.remove('is-active')
      }
    })

    if (calculator && typeof calculator.recalculate === 'function') {
      calculator.recalculate()
    }
    updateButtonStates()
  }

  function toggleFormFields(pageNumber, isActive) {
    const formFields = document.getElementById(`p${pageNumber}-formfields`)
    if (!formFields) return

    const inputs = formFields.querySelectorAll('input, select, textarea')
    formFields.classList.toggle('off', !isActive)

    inputs.forEach((input) => {
      if (input.type === 'radio' || input.type === 'checkbox') {
        input.disabled = !isActive
        input.parentElement.style.pointerEvents = isActive ? 'auto' : 'none'
        if (!isActive && input.checked) {
          input.checked = false
          input.dispatchEvent(new Event('change', { bubbles: true }))
        }
      } else {
        input.disabled = !isActive
        input.style.pointerEvents = isActive ? 'auto' : 'none'
        input.required = isActive && input.hasAttribute('required')
      }

      if (!isActive) {
        input.setCustomValidity('This field is currently inactive')
      } else {
        input.setCustomValidity('')
      }
    })

    if (!isActive) {
      formFields.querySelectorAll('.conditional-group').forEach((group) => {
        group.classList.remove('is-active')
      })
    }

    if (calculator && typeof calculator.recalculate === 'function') {
      calculator.recalculate()
    }
    updateNextButtonState(pageNumber, isActive)
  }

  function handleSwitchChange(event) {
    const pageNumber = event.target.id.split('-')[0].substring(1)
    const isChecked = event.target.checked
    console.log(
      `Switch for page ${pageNumber} is now ${isChecked ? 'on' : 'off'}`
    )
    toggleFormFields(pageNumber, isChecked)
    updateButtonStates()
    updateNextButtonAndAlert()
  }

  function showPage(pageNumber) {
    document.querySelectorAll('.f-page').forEach((page, index) => {
      page.style.display = index + 1 === pageNumber ? 'flex' : 'none'
    })
    currentPage = pageNumber // Make sure to update currentPage
    updateButtonStates()
  }

  function updateButtonStates() {
    const nextButton = document.getElementById('f-next-button')
    const prevButton = document.getElementById('f-prev-button')

    if (prevButton) {
      prevButton.classList.toggle('is-off', currentPage === 1)
      prevButton.disabled = currentPage === 1
    } else {
      console.warn('Previous button not found')
    }

    if (nextButton) {
      if (currentPage === maxPages) {
        nextButton.classList.add('is-off')
        nextButton.disabled = true
      } else {
        const currentSwitch = document.getElementById(`p${currentPage}-switch`)
        if (currentSwitch && currentSwitch.checked) {
          const isValid = isPageValid(currentPage)
          nextButton.classList.toggle('is-off', !isValid)
          nextButton.disabled = !isValid
        } else {
          nextButton.classList.remove('is-off')
          nextButton.disabled = false
        }
      }
    } else {
      console.warn('Next button not found')
    }

    updateApplyButton() // Call the new function here
  }

  function isPageValid(pageNumber) {
    const formFields = document.getElementById(`p${pageNumber}-formfields`)
    if (!formFields) return false

    const requiredFields = formFields.querySelectorAll(
      'input:required, select:required, textarea:required'
    )
    return Array.from(requiredFields).every((field) => field.validity.valid)
  }

  function handleNextButtonClick() {
    if (currentPage < maxPages) {
      currentPage++
      showPage(currentPage)
    }
  }

  function handlePrevButtonClick() {
    if (currentPage > 1) {
      currentPage--
      showPage(currentPage)
    }
  }

  function updateNextButtonState(pageNumber, isSwitchChecked) {
    const nextButton = document.getElementById('f-next-button')

    if (isSwitchChecked) {
      const isValid = isPageValid(pageNumber)
      nextButton.classList.toggle('is-off', !isValid)
    } else {
      nextButton.classList.remove('is-off')
    }
  }

  function updateNextButtonAndAlert() {
    const nextButton = document.getElementById('f-next-button')
    const alertElement = document.getElementById('f-alert')

    if (currentPage === maxPages) {
      // For the last page, always disable the next button
      nextButton.classList.add('is-off')
      nextButton.disabled = true
      alertElement.classList.remove('is-active')
    } else {
      const currentSwitch = document.getElementById(`p${currentPage}-switch`)
      if (currentSwitch && currentSwitch.checked) {
        const isValid = isPageValid(currentPage)
        nextButton.classList.toggle('is-off', !isValid)
        nextButton.disabled = !isValid
        alertElement.classList.toggle('is-active', !isValid)
      } else {
        nextButton.classList.remove('is-off')
        nextButton.disabled = false
        alertElement.classList.remove('is-active')
      }
    }
  }

  function updateApplyButton() {
    const applyButton = document.getElementById('f-apply-button')
    if (!applyButton) {
      console.warn('Apply button not found')
      return
    }

    if (currentPage === maxPages) {
      const isLastPageValid = isPageValid(currentPage)
      applyButton.classList.toggle('is-active', isLastPageValid)
    } else {
      applyButton.classList.remove('is-active')
    }
  }

  function init() {
    const pages = document.querySelectorAll('.f-page')
    maxPages = pages.length
    console.log(`Detected ${maxPages} pages`)

    for (let i = 1; i <= maxPages; i++) {
      const formFields = document.getElementById(`p${i}-formfields`)
      if (formFields) {
        formFields.addEventListener('input', () => {
          updateButtonStates()
          updateNextButtonAndAlert()
        })
      }

      if (i < maxPages) {
        // Only look for switches on non-last pages
        const switchElement = document.getElementById(`p${i}-switch`)
        if (switchElement) {
          switchElement.checked = false
          switchElement.addEventListener('change', handleSwitchChange)
          toggleFormFields(i, false)

          // Add event listeners for radio buttons
          const pageRadios = document.querySelectorAll(
            `input[type="radio"][name="p${i}-services"]`
          )
          pageRadios.forEach((radio) => {
            radio.addEventListener('change', handleConditionalGroups)
          })

          // Hide all conditional groups initially
          const conditionalGroups = document.querySelectorAll(
            `#p${i}-formfields .boxes-radio-wrapper.conditional-group`
          )
          conditionalGroups.forEach((group) => {
            group.classList.remove('is-active')
          })
        } else {
          console.log(`No switch found for p${i}, skipping initialization`)
        }
      }
    }

    const nextButton = document.getElementById('f-next-button')
    const prevButton = document.getElementById('f-prev-button')

    if (nextButton) {
      nextButton.addEventListener('click', handleNextButtonClick)
    } else {
      console.warn('Next button not found')
    }

    if (prevButton) {
      prevButton.addEventListener('click', handlePrevButtonClick)
    } else {
      console.warn('Previous button not found')
    }

    document.querySelectorAll('.f-page').forEach((page) => {
      const formFields = page.querySelector('[id^="p"][id$="-formfields"]')
      if (formFields) {
        formFields.addEventListener('input', () => {
          updateButtonStates()
          updateNextButtonAndAlert()
        })
      }
    })

    showPage(currentPage)
    updateButtonStates()

    if (calculator && typeof calculator.recalculate === 'function') {
      calculator.recalculate()
    }

    // Initialize radio buttons
    initializeRadioButtons()

    // Initialize modal
    initializeModal()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
}

export default initializeFormLogic
