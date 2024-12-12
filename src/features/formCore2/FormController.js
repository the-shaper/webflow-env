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
        // Handle parent group (p1-cob) selections
        if (event.target.closest('#p1-group0')) {
          this.handleParentGroupChange(event.target)
        } else {
          // Handle other radio groups (photo/video services)
          const isCalculatorRadio =
            event.target.name.endsWith('-services') ||
            event.target.closest('.conditional-group')

          if (isCalculatorRadio) {
            this.handleConditionalGroups(event)
          }
        }
      }
    })
  }

  handleParentGroupChange(radio) {
    // Get the target wrapper ID from data-show-group
    const targetWrapperId = radio.dataset.showGroup

    // Hide all coverage wrappers
    document
      .querySelectorAll('[data-form="second"] .coverage-wrapper')
      .forEach((wrapper) => {
        wrapper.classList.add('off')
      })

    // Show the selected wrapper
    if (targetWrapperId) {
      const targetWrapper = document.querySelector(
        `[data-form="second"] #${targetWrapperId}`
      )
      if (targetWrapper) {
        targetWrapper.classList.remove('off')
      }
    }

    // Reset all radio selections in hidden wrappers
    document
      .querySelectorAll('[data-form="second"] .coverage-wrapper.off')
      .forEach((wrapper) => {
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
    const formFields = radio.closest('[id$="-formfields"]')
    if (!formFields) return

    const pageNum = parseInt(formFields.id.match(/p(\d+)-formfields/)?.[1])
    if (!pageNum) return

    const isInConditionalGroup = radio.closest('.conditional-group')

    // Only handle main service radio changes
    if (!isInConditionalGroup) {
      const groupsToReset = Array.from(
        formFields.querySelectorAll('.boxes-radio-wrapper.conditional-group')
      )

      const groupsToShow = radio.checked
        ? radio.dataset.showGroup?.split(',') || []
        : []

      requestAnimationFrame(() => {
        // Reset all groups
        groupsToReset.forEach((group) => {
          group.classList.remove('is-active')
          this.resetGroupInputs(group)
        })

        // Activate necessary groups
        groupsToShow.forEach((groupId) => {
          const group = document.getElementById(groupId?.trim())
          if (group) {
            group.classList.add('is-active')
            this.selectDefaultOption(group)
          }
        })

        this.calculator.calculatePagePrices(pageNum)
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
}

export default FormController
