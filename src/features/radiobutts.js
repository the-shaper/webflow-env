function initializeRadioButtons() {
  let isInitialized = false

  function setupRadioButtonBehavior() {
    if (isInitialized) return
    isInitialized = true

    // Get all radio button fields
    const radioButtonFields = document.querySelectorAll(
      '.radio-button-field.w-radio'
    )

    radioButtonFields.forEach((field) => {
      // Get the radio input inside the field
      const radioInput = field.querySelector('input[type="radio"]')

      // Add event listener to the field instead of the radio input
      field.addEventListener('click', function (event) {
        // Prevent the default behavior
        event.preventDefault()

        // Manually check the radio input
        radioInput.checked = true

        // Dispatch a change event to trigger the existing logic
        radioInput.dispatchEvent(new Event('change', { bubbles: true }))
      })

      // Keep the existing change event listener
      radioInput.addEventListener('change', function () {
        // Get the name of the radio group
        const groupName = radioInput.name

        // Get all radio buttons in the same group
        const groupRadioButtons = document.querySelectorAll(
          `input[name="${groupName}"]`
        )

        groupRadioButtons.forEach((button) => {
          const parentField = button.closest('.radio-button-field.w-radio')
          if (button.checked) {
            parentField.classList.add('is-active')
            const childElements = parentField.querySelectorAll('*')
            childElements.forEach((child) => {
              child.classList.add('is-active')
            })
          } else {
            parentField.classList.remove('is-active')
            const childElements = parentField.querySelectorAll('*')
            childElements.forEach((child) => {
              child.classList.remove('is-active')
            })
          }
        })

        // Trigger form validation after radio button change
        const event = new Event('input', { bubbles: true, cancelable: true })
        radioInput.dispatchEvent(event)
      })
    })

    function handleConditionalGroupChanges() {
      const conditionalGroups = document.querySelectorAll(
        '.boxes-radio-wrapper.conditional-group'
      )

      conditionalGroups.forEach((group) => {
        if (!group.classList.contains('is-active')) {
          const radioInputs = group.querySelectorAll('input[type="radio"]')
          radioInputs.forEach((radio) => {
            radio.checked = false
          })
        }
      })

      if (
        window.calculator &&
        typeof window.calculator.recalculate === 'function'
      ) {
        window.calculator.recalculate()
      }
    }

    // Add event listener for changes in conditional groups
    document.addEventListener(
      'conditionalGroupChanged',
      handleConditionalGroupChanges
    )
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupRadioButtonBehavior, {
      once: true,
    })
  } else {
    setupRadioButtonBehavior()
  }
}

export default initializeRadioButtons
