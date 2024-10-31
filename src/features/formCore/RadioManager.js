class RadioManager {
  constructor() {
    this.setupEventDelegation()
  }

  setupEventDelegation() {
    document.addEventListener('click', (event) => {
      const radioField = event.target.closest('.radio-button-field.w-radio')
      if (!radioField) return

      console.log('🎯 RadioManager: Click Event', {
        target: event.target.tagName,
        radioField: radioField.id,
        hasRadio: !!radioField.querySelector('input[type="radio"]'),
      })

      // Let Webflow handle the native click
      const radio = radioField.querySelector('input[type="radio"]')
      if (!radio) return

      console.log('🔄 RadioManager: Handling Click', {
        radio: radio.name,
        wasChecked: radio.checked,
        inConditionalGroup: !!radio.closest('.conditional-group'),
      })

      // Update visual state after a short delay to let Webflow finish
      setTimeout(() => {
        this.updateRadioVisualState(radio)

        // Dispatch our synthetic event after visual update
        const syntheticEvent = new Event('change', { bubbles: true })
        syntheticEvent.synthetic = true
        radio.dispatchEvent(syntheticEvent)
      }, 0)
    })

    document.addEventListener('change', (event) => {
      if (!event.target.matches('input[type="radio"]')) return

      console.log('📻 RadioManager: Change Event', {
        name: event.target.name,
        value: event.target.value,
        isNativeEvent: !event.synthetic,
      })

      const isInConditionalGroup = event.target.closest('.conditional-group')

      if (!event.synthetic) {
        // Only update visual state for native events
        this.updateRadioVisualState(event.target)
      }

      // Then handle the specific radio type
      if (!isInConditionalGroup) {
        this.handleMainRadioChange(event.target)
      } else {
        this.handleConditionalRadioChange(event.target)
      }
    })
  }

  updateRadioVisualState(radio) {
    // Get all radios in the same group
    const groupName = radio.name
    const groupRadios = document.querySelectorAll(`input[name="${groupName}"]`)

    // Update all radio fields in the group
    groupRadios.forEach((button) => {
      const field = button.closest('.radio-button-field.w-radio')
      if (!field) return

      const isActive = button.checked

      // Update field state
      field.classList.toggle('is-active', isActive)
      button.classList.toggle('is-active', isActive)

      // Update all children including the w-form-label
      field.querySelectorAll('*').forEach((child) => {
        child.classList.toggle('is-active', isActive)
      })
    })
  }

  handleMainRadioChange(radio) {
    console.log('⚡ RadioManager: Handling Main Radio Change', {
      name: radio.name,
      checked: radio.checked,
    })
  }

  handleConditionalRadioChange(radio) {
    const formFields = radio.closest('[id$="-formfields"]')
    if (!formFields) {
      console.log('❌ No formFields found')
      return
    }

    const pageNum = formFields.id.match(/p(\d+)-formfields/)?.[1]
    if (!pageNum) {
      console.log('❌ No pageNum found')
      return
    }

    // Detailed DOM state check before any operations
    console.log('🔍 DOM State Before Operations:', {
      formFieldsId: formFields.id,
      mainServiceSelector: `input[name="p${pageNum}-services"]`,
      mainServiceElements: Array.from(
        formFields.querySelectorAll(`input[name="p${pageNum}-services"]`)
      ).map((el) => ({
        value: el.value,
        checked: el.checked,
        price: el.dataset.price,
        parentVisible: el.parentElement.style.display !== 'none',
        parentClasses: el.parentElement.className,
      })),
      activeGroups: Array.from(
        formFields.querySelectorAll('.conditional-group.is-active')
      ).map((g) => g.id),
      currentRadio: {
        name: radio.name,
        value: radio.value,
        checked: radio.checked,
        groupId: radio.closest('.conditional-group')?.id,
      },
    })

    // Store main service state
    const mainServiceRadio = formFields.querySelector(
      `input[name="p${pageNum}-services"]:checked`
    )

    // Log main service state
    console.log('🔍 Main Service State:', {
      found: !!mainServiceRadio,
      value: mainServiceRadio?.value,
      checked: mainServiceRadio?.checked,
      price: mainServiceRadio?.dataset.price,
      parentVisible: mainServiceRadio?.parentElement.style.display !== 'none',
    })

    // If main service is unchecked, recheck it
    if (mainServiceRadio && !mainServiceRadio.checked) {
      console.log('🔄 Restoring main service state')
      mainServiceRadio.checked = true
      this.updateRadioVisualState(mainServiceRadio)
    }

    // Log final state after operations
    console.log('🔍 Final DOM State:', {
      mainServiceChecked: formFields.querySelector(
        `input[name="p${pageNum}-services"]:checked`
      )?.value,
      currentRadioChecked: radio.checked,
      activeGroups: Array.from(
        formFields.querySelectorAll('.conditional-group.is-active')
      ).map((g) => g.id),
    })

    // Ensure conditional radio visual state
    this.updateRadioVisualState(radio)
  }
}

export default RadioManager
