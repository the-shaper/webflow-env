class FormController {
  constructor(calculator) {
    this.calculator = calculator
    this.currentPage = 1
    this.maxPages = document.querySelectorAll('.f-page').length
    this.setupEventDelegation()
    this.setupNavigation()
    this.hideAllConditionalGroups()
    this.showPage(1)
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
        this.handleConditionalGroups(event)
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

    // Debug: Log DOM state before changes
    console.log('2. Before Changes:', {
      mainServiceChecked: !!formFields.querySelector(
        `input[name="p${pageNum}-services"]:checked`
      ),
      activeConditionalGroups: Array.from(
        formFields.querySelectorAll('.conditional-group.is-active')
      ).map((g) => g.id),
      checkedRadios: Array.from(
        formFields.querySelectorAll('input[type="radio"]:checked')
      ).map((r) => r.name),
    })

    const isInConditionalGroup = radio.closest('.conditional-group')
    console.log('Is in conditional group:', !!isInConditionalGroup)

    if (!isInConditionalGroup) {
      console.log('Main radio selected, resetting conditional groups')
      formFields
        .querySelectorAll('.boxes-radio-wrapper.conditional-group')
        .forEach((group) => {
          console.log('Resetting group:', group.id)
          group.classList.remove('is-active')
          this.resetGroupInputs(group)
        })

      const groupsToShow = radio.dataset.showGroup?.split(',') || []
      console.log('Groups to show:', groupsToShow)

      groupsToShow.forEach((groupId) => {
        const group = document.getElementById(groupId?.trim())
        if (group) {
          console.log('Activating group:', groupId)
          group.classList.add('is-active')
        }
      })
    }

    this.calculator.calculatePagePrices(pageNum)
  }

  resetGroupInputs(group) {
    console.log('\n🔄 Resetting inputs for group:', group.id)
    group.querySelectorAll('input[type="radio"]').forEach((radio) => {
      if (radio.checked) {
        console.log('Unchecking radio:', {
          name: radio.name,
          value: radio.value,
          price: radio.dataset.price,
        })
        radio.checked = false
        radio.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })
  }

  handleSwitchChange(event) {
    const pageNumber = event.target.id.split('-')[0].substring(1)
    const isChecked = event.target.checked
    this.toggleFormFields(pageNumber, isChecked)
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
}

export default FormController
