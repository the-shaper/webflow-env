function initializeFormLogic(calculator) {
  let currentPage = 1
  let maxPages

  function handleConditionalGroups(event) {
    if (event.target.type !== 'radio') return

    console.log('Radio button changed:', event.target)
    console.log('Data show group:', event.target.dataset.showGroup)

    const groupsToShow = event.target.dataset.showGroup
      ? event.target.dataset.showGroup.split(',').map((g) => g.trim())
      : []
    console.log('Groups to show:', groupsToShow)

    const pageNumber = event.target.name.split('-')[0] // e.g., 'p1' from 'p1-services'
    const allConditionalGroups = document.querySelectorAll(
      `#${pageNumber}-formfields .boxes-radio-wrapper.conditional-group`
    )
    console.log('All conditional groups:', allConditionalGroups)

    allConditionalGroups.forEach((group) => {
      console.log('Checking group:', group.id)
      if (groupsToShow.includes(group.id)) {
        console.log('Adding is-active to:', group.id)
        group.classList.add('is-active')
      } else {
        console.log('Removing is-active from:', group.id)
        group.classList.remove('is-active')
      }
    })

    // Recalculate after showing/hiding groups
    if (calculator && typeof calculator.recalculate === 'function') {
      calculator.recalculate()
    }
  }

  function toggleFormFields(pageNumber, isActive) {
    const formFields = document.getElementById(`p${pageNumber}-formfields`)
    if (!formFields) return

    const inputs = formFields.querySelectorAll('input, select, textarea')
    formFields.classList.toggle('off', !isActive)

    inputs.forEach((input) => {
      input.disabled = !isActive
      input.style.pointerEvents = isActive ? 'auto' : 'none'
      if (input.type !== 'radio' && input.type !== 'checkbox') {
        input.required = isActive
      }

      if (!isActive) {
        input.setCustomValidity('This field is currently inactive')
        if (input.type === 'radio' || input.type === 'checkbox') {
          if (input.checked) {
            input.checked = false
            input.dispatchEvent(new Event('change', { bubbles: true }))
          }
        } else if (
          input.type === 'select-one' ||
          input.type === 'select-multiple'
        ) {
          input.selectedIndex = -1
        } else {
          input.value = ''
        }
      } else {
        input.setCustomValidity('')
      }
    })

    // Hide all conditional groups when the switch is turned off
    if (!isActive) {
      formFields.querySelectorAll('.conditional-group').forEach((group) => {
        group.classList.remove('is-active')
      })
    }

    // Recalculate after toggling fields
    if (calculator && typeof calculator.recalculate === 'function') {
      calculator.recalculate()
    }
  }

  function handleSwitchChange(event) {
    const pageNumber = event.target.id.split('-')[0].substring(1)
    toggleFormFields(pageNumber, event.target.checked)
  }

  function showPage(pageNumber) {
    document.querySelectorAll('.f-page').forEach((page, index) => {
      page.style.display = index + 1 === pageNumber ? 'flex' : 'none'
    })
    updateButtonStates()
  }

  function updateButtonStates() {
    const nextButton = document.getElementById('f-next-button')
    const prevButton = document.getElementById('f-prev-button')
    const currentSwitch = document.getElementById(`p${currentPage}-switch`)
    const isLastPage = currentPage === maxPages
    const isFirstPage = currentPage === 1

    // Update next button
    nextButton.disabled =
      isLastPage || (currentSwitch.checked && !isPageValid(currentPage))
    nextButton.classList.toggle('is-off', isLastPage)
    nextButton.classList.toggle(
      'in-progress',
      currentSwitch.checked && !isLastPage
    )

    // Update previous button
    prevButton.disabled = isFirstPage
    prevButton.classList.toggle('is-off', isFirstPage)

    // Remove 'is-off' class from prevButton when there's a page to go back to
    if (!isFirstPage) {
      prevButton.classList.remove('is-off')
    }

    console.log(
      'Current page:',
      currentPage,
      'Is last page:',
      isLastPage,
      'Next button classes:',
      nextButton.classList.toString()
    )
  }

  function isPageValid(pageNumber) {
    const formFields = document.getElementById(`p${pageNumber}-formfields`)
    const requiredFields = formFields.querySelectorAll(
      'input:required, select:required, textarea:required'
    )
    return Array.from(requiredFields).every((field) => field.validity.valid)
  }

  function handleNextButtonClick() {
    if (currentPage < maxPages) {
      currentPage++
      showPage(currentPage)
      updateButtonStates()
    }
  }

  function handlePrevButtonClick() {
    if (currentPage > 1) {
      currentPage--
      showPage(currentPage)
      updateButtonStates() // Added this line
    }
  }

  function init() {
    // Dynamically determine the number of pages
    const pages = document.querySelectorAll('.f-page')
    maxPages = pages.length
    console.log(`Detected ${maxPages} pages`)

    for (let i = 1; i <= maxPages; i++) {
      const switchElement = document.getElementById(`p${i}-switch`)
      if (switchElement) {
        switchElement.checked = false // Set switch to off by default
        switchElement.addEventListener('change', handleSwitchChange)
        toggleFormFields(i, false) // Initialize form fields as inactive

        // Add event listeners for radio buttons in this page
        const pageRadios = document.querySelectorAll(
          `input[type="radio"][name="p${i}-services"]`
        )
        console.log(
          `Found ${pageRadios.length} radio buttons for p${i}-services`
        )
        pageRadios.forEach((radio) => {
          console.log('Adding event listener to:', radio)
          radio.addEventListener('change', handleConditionalGroups)
        })

        // Initially hide all conditional groups
        const conditionalGroups = document.querySelectorAll(
          `#p${i}-formfields .boxes-radio-wrapper.conditional-group`
        )
        console.log(
          `Found ${conditionalGroups.length} conditional groups for p${i}`
        )
        conditionalGroups.forEach((group) => {
          group.classList.remove('is-active')
        })
      } else {
        // If we can't find a switch for this page number, we've reached the end
        console.log(`No switch found for p${i}, stopping initialization`)
        break
      }
    }

    const nextButton = document.getElementById('f-next-button')
    const prevButton = document.getElementById('f-prev-button')
    nextButton.addEventListener('click', handleNextButtonClick)
    prevButton.addEventListener('click', handlePrevButtonClick)

    showPage(currentPage)
    updateButtonStates()

    // Initial calculation
    if (calculator && typeof calculator.recalculate === 'function') {
      calculator.recalculate()
    }
  }

  // Call initialization function when the DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
}

export default initializeFormLogic
