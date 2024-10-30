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

      this.handleRadioFieldClick(radioField, event)
    })

    document.addEventListener('change', (event) => {
      if (!event.target.matches('input[type="radio"]')) return

      console.log('📻 RadioManager: Change Event', {
        name: event.target.name,
        value: event.target.value,
        isNativeEvent: !event.synthetic, // Add a marker for synthetic events
      })

      this.handleRadioChange(event.target)
    })
  }

  handleRadioFieldClick(field, event) {
    event.preventDefault()
    const radio = field.querySelector('input[type="radio"]')
    if (!radio) return

    console.log('🔄 RadioManager: Handling Click', {
      radio: radio.name,
      wasChecked: radio.checked,
      inConditionalGroup: !!radio.closest('.conditional-group'),
    })

    radio.checked = true
    // Mark this as a synthetic event
    const syntheticEvent = new Event('change', { bubbles: true })
    syntheticEvent.synthetic = true
    radio.dispatchEvent(syntheticEvent)
  }

  handleRadioChange(radio) {
    console.log('⚡ RadioManager: Handling Change', {
      name: radio.name,
      checked: radio.checked,
      groupName: radio.name,
    })
    const groupName = radio.name
    const groupRadios = document.querySelectorAll(`input[name="${groupName}"]`)

    groupRadios.forEach((button) => {
      const field = button.closest('.radio-button-field.w-radio')
      if (!field) return

      const isActive = button.checked
      field.classList.toggle('is-active', isActive)

      field.querySelectorAll('*').forEach((child) => {
        child.classList.toggle('is-active', isActive)
      })
    })
  }
}

export default RadioManager
