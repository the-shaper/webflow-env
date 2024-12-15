class FormController {
  constructor(calculator) {
    this.calculator = calculator
    this.currentPage = 1
    this.maxPages = 2

    // Initialize coverage wrappers to off state
    document
      .querySelectorAll('[data-form="second"] .coverage-wrapper')
      .forEach((wrapper) => {
        wrapper.classList.add('off')
      })

    this.setupEventDelegation()
    this.setupNavigation()
    this.showPage(1)

    this.alertElement = document.querySelector('[data-form="second"] #f-alert')
    this.nextButton = document.querySelector(
      '[data-form="second"] #f-next-button'
    )

    // Add form submission handler with debug log
    const form = document.querySelector('[data-form="second"]')
    console.log('Found form:', !!form) // Debug log
    if (form) {
      form.addEventListener('submit', (e) => {
        console.log('Form submit triggered') // Debug log
        this.handleSubmit(e)
      })
    }
  }

  setupNavigation() {
    const nextButton = document.querySelector(
      '[data-form="second"] #f-next-button'
    )
    const prevButton = document.querySelector(
      '[data-form="second"] #f-prev-button'
    )

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
    document
      .querySelectorAll('[data-form="second"] .f-page')
      .forEach((page, index) => {
        page.style.display = index + 1 === pageNumber ? 'flex' : 'none'
      })
    this.currentPage = pageNumber
    this.updateButtonStates()
  }

  updateButtonStates() {
    const nextButton = document.querySelector(
      '[data-form="second"] #f-next-button'
    )
    const prevButton = document.querySelector(
      '[data-form="second"] #f-prev-button'
    )

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
      const formWrapper = event.target.closest('[data-form="second"]')
      if (!formWrapper) return

      if (event.target.matches('input[type="radio"]')) {
        console.log('�������� Radio Change:', {
          name: event.target.name,
          value: event.target.value,
          wrapper: event.target.closest('.coverage-wrapper')?.id,
          hasPrice: !!event.target.dataset.price,
          price: event.target.dataset.price,
        })

        // Handle parent group (p1-cob) selections
        if (event.target.closest('#p1-group0')) {
          this.handleParentGroupChange(event.target)
        } else {
          // Handle service groups within coverage wrappers
          const coverageWrapper = event.target.closest('.coverage-wrapper')
          if (coverageWrapper) {
            const isServiceRadio =
              event.target.name.includes('-services') ||
              event.target.closest('.conditional-group')

            if (isServiceRadio) {
              this.handleConditionalGroups(event)
            }
          }
        }
      }
    })
  }

  handleParentGroupChange(radio) {
    // Get the target wrapper ID from data-show-group
    const targetWrapperId = radio.dataset.showGroup

    console.log('🔄 Parent Group Change:', {
      selectedRadio: radio.value,
      targetWrapper: targetWrapperId,
      parentGroup: 'p1-group0',
    })

    // Hide all coverage wrappers
    document
      .querySelectorAll('[data-form="second"] .coverage-wrapper')
      .forEach((wrapper) => {
        wrapper.classList.add('off')
        console.log(`📦 Hiding wrapper: ${wrapper.id}`)
      })

    // Show the selected wrapper
    if (targetWrapperId) {
      const targetWrapper = document.querySelector(
        `[data-form="second"] #${targetWrapperId}`
      )
      if (targetWrapper) {
        targetWrapper.classList.remove('off')
        console.log(`📦 Showing wrapper: ${targetWrapperId}`)
      }
    }

    // Reset all radio selections in hidden wrappers
    document
      .querySelectorAll('[data-form="second"] .coverage-wrapper.off')
      .forEach((wrapper) => {
        console.log(`🔄 Resetting selections in: ${wrapper.id}`)
        wrapper.querySelectorAll('input[type="radio"]').forEach((radio) => {
          if (radio.checked) {
            radio.checked = false
            const field = radio.closest('.radio-button-field.w-radio')
            if (field) {
              field.classList.remove('is-active')
              field.querySelectorAll('*').forEach((child) => {
                child.classList.remove('is-active')
              })
            }
          }
        })
      })

    // Calculate prices after change
    this.calculator.calculatePagePrices(1)
    this.updateAlertVisibility(1)
  }

  handleConditionalGroups(event) {
    const radio = event.target
    const coverageWrapper = radio.closest('.coverage-wrapper')
    if (!coverageWrapper) return

    console.log('🔍 Handling service selection:', {
      wrapper: coverageWrapper.id,
      radioName: radio.name,
      radioValue: radio.value,
      price: radio.dataset.price,
    })

    const formFields = radio.closest('[id$="-formfields"]')
    if (!formFields) return

    const pageNum = parseInt(formFields.id.match(/p(\d+)-formfields/)?.[1])
    if (!pageNum) return

    const isInConditionalGroup = radio.closest('.conditional-group')

    // Only handle main service radio changes
    if (!isInConditionalGroup) {
      const groupsToReset = Array.from(
        coverageWrapper.querySelectorAll(
          '.boxes-radio-wrapper.conditional-group'
        )
      )

      const groupsToShow = radio.checked
        ? radio.dataset.showGroup?.split(',') || []
        : []

      requestAnimationFrame(() => {
        // Reset all groups within this coverage wrapper
        groupsToReset.forEach((group) => {
          group.classList.remove('is-active')
          this.resetGroupInputs(group)
        })

        // Activate necessary groups
        groupsToShow.forEach((groupId) => {
          const group = coverageWrapper.querySelector(`#${groupId?.trim()}`)
          if (group) {
            group.classList.add('is-active')
            this.selectDefaultOption(group)
          }
        })

        this.calculator.calculatePagePrices(pageNum)

        // Enable modal button if we have valid selections
        const modalButton = document.querySelector(
          '[data-form="second"] .f-modal-button'
        )
        if (modalButton) {
          const hasValidSelections =
            this.calculator.getPrices().get('total') > 0
          modalButton.classList.toggle('is-off', !hasValidSelections)
          modalButton.disabled = !hasValidSelections
        }
      })
    } else {
      requestAnimationFrame(() => {
        this.calculator.calculatePagePrices(pageNum)
      })
    }

    this.updateAlertVisibility(pageNum)
  }

  resetGroupInputs(group) {
    const radios = group.querySelectorAll('input[type="radio"]')
    radios.forEach((radio) => {
      if (radio.checked) {
        radio.checked = false
        const field = radio.closest('.radio-button-field.w-radio')
        if (field) {
          field.classList.remove('is-active')
          field.querySelectorAll('*').forEach((child) => {
            child.classList.remove('is-active')
          })
        }
        radio.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })
  }

  selectDefaultOption(group) {
    const firstRadio = group.querySelector('input[type="radio"]')
    if (!firstRadio) return

    firstRadio.checked = true
    const radioField = firstRadio.closest('.radio-button-field.w-radio')
    if (radioField) {
      radioField.classList.add('is-active')
      firstRadio.classList.add('is-active')
      radioField.querySelectorAll('*').forEach((child) => {
        child.classList.add('is-active')
      })
    }

    const syntheticEvent = new Event('change', { bubbles: true })
    syntheticEvent.synthetic = true
    firstRadio.dispatchEvent(syntheticEvent)
  }

  updateAlertVisibility(pageNum) {
    const formFields = document.querySelector(
      `[data-form="second"] #p${pageNum}-formfields`
    )

    if (!formFields) return

    if (!this.hasSelectedRadios(formFields)) {
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

  async handleSubmit(event) {
    event.preventDefault()

    // Add debugging logs
    console.log('Form submission started')

    // Get the date input and check if it exists
    const dateInput = document.querySelector('[data-element="datepicker"]')
    if (!dateInput) {
      console.error('Date input not found')
      return
    }
    console.log('Date input found:', dateInput.value)

    // Get other form elements with null checks
    const clientNameInput = document.querySelector(
      '[name="Nombre-del-Cliente"]'
    )
    const partnerNameInput = document.querySelector(
      '[name="Nombre-de-la-Pareja"]'
    )
    const clientEmailInput = document.querySelector('[name="E-Mail-Cliente"]')
    const serviceRadio = document.querySelector('input[name="p1-cob"]:checked')

    // Debug log all elements
    console.log('Form elements found:', {
      dateInput: !!dateInput,
      clientNameInput: !!clientNameInput,
      partnerNameInput: !!partnerNameInput,
      clientEmailInput: !!clientEmailInput,
      serviceRadio: !!serviceRadio,
    })

    // Check if all required elements exist
    if (!clientNameInput || !partnerNameInput || !clientEmailInput) {
      console.error('Required form elements not found')
      return
    }

    const formData = {
      clientName: clientNameInput.value,
      partnerName: partnerNameInput.value,
      clientEmail: clientEmailInput.value,
      serviceName: serviceRadio ? serviceRadio.value : '',
      eventDate: dateInput.value.split('-').join('/'), // Convert date format
    }

    console.log('Submitting form data:', formData)

    try {
      console.log(
        'Sending request to:',
        '/.netlify/functions/create-calendar-event'
      )

      const response = await fetch(
        '/.netlify/functions/create-calendar-event',
        {
          method: 'POST',
          body: JSON.stringify(formData),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      // Log the raw response for debugging
      const responseText = await response.text()
      console.log('Raw response:', responseText)

      let result
      try {
        result = JSON.parse(responseText)
      } catch (e) {
        console.error('Failed to parse response as JSON:', responseText)
        throw new Error('Invalid response from server')
      }

      if (!response.ok) {
        throw new Error(result.message || 'Error creating calendar event')
      }

      console.log('Calendar event created:', result)
    } catch (error) {
      console.error('Error details:', error)
    }
  }
}

export default FormController
