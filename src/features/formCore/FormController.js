class FormController {
  constructor(calculator) {
    this.calculator = calculator
    this.currentPage = 1
    this.maxPages = document.querySelectorAll('.f-page').length
    this.initializeSwitchStates()
    this.setupEventDelegation()
    this.setupNavigation()
    this.hideAllConditionalGroups()
    this.showPage(1)
    this.calculateTimeout = null
    this.alertElement = document.getElementById('f-alert')
    this.nextButton = document.getElementById('f-next-button')
  }

  initializeSwitchStates() {
    // Get all form pages
    const formPages = document.querySelectorAll('.f-page')

    formPages.forEach((page) => {
      const pageNum = page.id.match(/p(\d+)/)?.[1]
      if (!pageNum) return

      const formFields = document.getElementById(`p${pageNum}-formfields`)
      const switchElement = document.getElementById(`p${pageNum}-switch`)

      if (formFields) {
        // Add .off class by default
        formFields.classList.add('off')

        // Disable all inputs
        this.toggleInputs(formFields, false)

        // If there's a switch, ensure it's unchecked
        if (switchElement) {
          switchElement.checked = false
        }

        // Clear any prices for this page
        this.calculator.clearPagePrices(pageNum)
      }
    })
  }

  hideAllConditionalGroups() {
    document
      .querySelectorAll('.boxes-radio-wrapper.conditional-group')
      .forEach((group) => {
        group.classList.remove('is-active')
      })
  }

  setupNavigation() {
    const nextButton = document.getElementById('f-next-button')
    const prevButton = document.getElementById('f-prev-button')

    if (nextButton) {
      nextButton.addEventListener('click', () => this.handleNextButtonClick())
    }
    if (prevButton) {
      prevButton.addEventListener('click', () => this.handlePrevButtonClick())
    }

    this.updateButtonStates()
  }

  handleNextButtonClick() {
    if (this.nextButton?.disabled) return

    if (this.currentPage < this.maxPages) {
      this.showPage(this.currentPage + 1)
    }
  }

  handlePrevButtonClick() {
    if (this.currentPage > 1) {
      this.showPage(this.currentPage - 1)
    }
  }

  showPage(pageNumber) {
    document.querySelectorAll('.f-page').forEach((page, index) => {
      page.style.display = index + 1 === pageNumber ? 'flex' : 'none'
    })
    this.currentPage = pageNumber
    this.updateButtonStates()
  }

  updateButtonStates() {
    const nextButton = document.getElementById('f-next-button')
    const prevButton = document.getElementById('f-prev-button')

    if (prevButton) {
      prevButton.classList.toggle('is-off', this.currentPage === 1)
      prevButton.disabled = this.currentPage === 1
    }

    if (nextButton) {
      const isLastPage = this.currentPage === this.maxPages
      nextButton.classList.toggle('is-off', isLastPage)
      nextButton.disabled = isLastPage
    }
  }

  setupEventDelegation() {
    document.addEventListener('change', (event) => {
      if (event.target.matches('input[type="radio"]')) {
        const isCalculatorRadio =
          event.target.name.endsWith('-services') || // Main service radio
          event.target.closest('.conditional-group') // Conditional group radio

        if (isCalculatorRadio) {
          this.handleConditionalGroups(event)
        }
      }

      if (event.target.matches('[id$="-switch"]')) {
        this.handleSwitchChange(event)
      }
    })
  }

  handleConditionalGroups(event) {
    const radio = event.target

    // Debug: Log event sequence
    console.log('\n🔄 DEBUG - Event Sequence:')
    console.log('1. Event Target:', {
      name: radio.name,
      value: radio.value,
      checked: radio.checked,
      type: radio.type,
      inConditionalGroup: !!radio.closest('.conditional-group'),
    })

    const formFields = radio.closest('[id$="-formfields"]')
    if (!formFields) {
      console.log('❌ No form fields wrapper found')
      return
    }

    const pageNum = parseInt(formFields.id.match(/p(\d+)-formfields/)?.[1])
    if (!pageNum) {
      console.log('❌ Could not extract page number')
      return
    }

    const isInConditionalGroup = radio.closest('.conditional-group')
    console.log('Is in conditional group:', !!isInConditionalGroup)

    // Only handle main service radio changes
    if (!isInConditionalGroup) {
      console.log('Main radio selected, resetting conditional groups')

      const groupsToReset = Array.from(
        formFields.querySelectorAll('.boxes-radio-wrapper.conditional-group')
      )

      const groupsToShow = radio.checked
        ? radio.dataset.showGroup?.split(',') || []
        : []

      requestAnimationFrame(() => {
        // First reset all groups
        groupsToReset.forEach((group) => {
          console.log('Resetting group:', group.id)
          group.classList.remove('is-active')
          this.resetGroupInputs(group)
        })

        // Then activate necessary groups and select default options
        groupsToShow.forEach((groupId) => {
          const group = document.getElementById(groupId?.trim())
          if (group) {
            console.log('Activating group:', groupId)
            group.classList.add('is-active')
            this.selectDefaultOption(group)
          }
        })

        // Finally calculate prices
        this.calculator.calculatePagePrices(pageNum)
      })
    } else {
      // For conditional group changes, just calculate prices
      requestAnimationFrame(() => {
        this.calculator.calculatePagePrices(pageNum)
      })
    }

    // Update alert visibility after radio selection
    this.updateAlertVisibility(pageNum)
  }

  resetGroupInputs(group) {
    console.log('\n🔄 Resetting inputs for group:', group.id)
    const radios = group.querySelectorAll('input[type="radio"]')

    radios.forEach((radio) => {
      if (radio.checked) {
        console.log('Unchecking radio:', {
          name: radio.name,
          value: radio.value,
          price: radio.dataset.price,
        })
        radio.checked = false

        // Ensure the radio field styling is updated
        const field = radio.closest('.radio-button-field.w-radio')
        if (field) {
          field.classList.remove('is-active')
          field.querySelectorAll('*').forEach((child) => {
            child.classList.remove('is-active')
          })
        }

        // Notify about the change
        radio.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })
  }

  handleSwitchChange(event) {
    const pageNumber = event.target.id.split('-')[0].substring(1)
    const isChecked = event.target.checked
    this.toggleFormFields(pageNumber, isChecked)

    // Handle alert visibility based on switch state
    if (!isChecked) {
      this.hideAlert()
    } else {
      this.updateAlertVisibility(pageNumber)
    }
  }

  toggleFormFields(pageNumber, isActive) {
    const formFields = document.getElementById(`p${pageNumber}-formfields`)
    if (!formFields) return

    formFields.classList.toggle('off', !isActive)
    this.toggleInputs(formFields, isActive)

    if (!isActive) {
      this.resetConditionalGroups(formFields)
      this.calculator.clearPagePrices(pageNumber)
    } else {
      this.calculator.calculatePagePrices(pageNumber)
    }
  }

  toggleInputs(formFields, isActive) {
    formFields.querySelectorAll('input, select, textarea').forEach((input) => {
      input.disabled = !isActive
      if (input.type === 'radio' || input.type === 'checkbox') {
        input.parentElement.style.pointerEvents = isActive ? 'auto' : 'none'
        if (!isActive && input.checked) {
          input.checked = false
          input.dispatchEvent(new Event('change', { bubbles: true }))
        }
      }
    })
  }

  resetConditionalGroups(formFields) {
    formFields.querySelectorAll('.conditional-group').forEach((group) => {
      group.classList.remove('is-active')
    })
  }

  selectDefaultOption(group) {
    // Get the first radio button in the group
    const firstRadio = group.querySelector('input[type="radio"]')
    if (!firstRadio) return

    console.log('🎯 Selecting default option:', {
      groupId: group.id,
      radioName: firstRadio.name,
      radioValue: firstRadio.value,
    })

    // Set checked state
    firstRadio.checked = true

    // Update Webflow's visual state
    const radioField = firstRadio.closest('.radio-button-field.w-radio')
    if (radioField) {
      radioField.classList.add('is-active')
      firstRadio.classList.add('is-active')

      // Update all children (including w-form-label)
      radioField.querySelectorAll('*').forEach((child) => {
        child.classList.add('is-active')
      })
    }

    // Dispatch a synthetic change event to ensure our system knows about the selection
    const syntheticEvent = new Event('change', { bubbles: true })
    syntheticEvent.synthetic = true
    firstRadio.dispatchEvent(syntheticEvent)
  }

  updateAlertVisibility(pageNumber) {
    const formFields = document.getElementById(`p${pageNumber}-formfields`)
    const switchElement = document.getElementById(`p${pageNumber}-switch`)

    if (!formFields || !switchElement) return

    if (switchElement.checked && !this.hasSelectedRadios(formFields)) {
      this.showAlert()
    } else {
      this.hideAlert()
    }
  }

  hasSelectedRadios(formFields) {
    const radios = formFields.querySelectorAll('input[type="radio"]')
    return Array.from(radios).some((radio) => radio.checked)
  }

  showAlert() {
    this.alertElement?.classList.add('is-active')
    if (this.nextButton) {
      this.nextButton.classList.add('is-off')
      this.nextButton.disabled = true
    }
  }

  hideAlert() {
    this.alertElement?.classList.remove('is-active')
    if (this.nextButton) {
      if (this.currentPage !== this.maxPages) {
        this.nextButton.classList.remove('is-off')
        this.nextButton.disabled = false
      }
    }
  }
}

export default FormController
