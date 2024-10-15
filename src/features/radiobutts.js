function initializeRadioButtons() {
  console.log('Initializing radio buttons')

  function setupRadioButtonBehavior() {
    // Get all radio button fields
    const radioButtonFields = document.querySelectorAll(
      '.radio-button-field.w-radio'
    )
    console.log('Radio button fields:', radioButtonFields)

    radioButtonFields.forEach((field) => {
      // Get the radio input inside the field
      const radioInput = field.querySelector('input[type="radio"]')
      console.log('Radio input found:', radioInput)

      // Add event listener to the field instead of the radio input
      field.addEventListener('click', function (event) {
        // Prevent the default behavior
        event.preventDefault()

        // Manually check the radio input
        radioInput.checked = true
        console.log(
          'Radio input checked:',
          radioInput.checked,
          'Value:',
          radioInput.value
        )

        // Dispatch a change event to trigger the existing logic
        radioInput.dispatchEvent(new Event('change', { bubbles: true }))
        console.log('Change event dispatched for:', radioInput.name)
      })

      // Keep the existing change event listener
      radioInput.addEventListener('change', function () {
        console.log('Radio input changed:', radioInput)

        // Get the name of the radio group
        const groupName = radioInput.name
        console.log('Radio group name:', groupName)

        // Get all radio buttons in the same group
        const groupRadioButtons = document.querySelectorAll(
          `input[name="${groupName}"]`
        )
        console.log('Group radio buttons:', groupRadioButtons)

        groupRadioButtons.forEach((button) => {
          const parentField = button.closest('.radio-button-field.w-radio')
          if (button.checked) {
            parentField.classList.add('is-active')
            console.log('Added is-active to:', parentField)

            // Add is-active to all child elements
            const childElements = parentField.querySelectorAll('*')
            childElements.forEach((child) => {
              child.classList.add('is-active')
              console.log('Added is-active to child:', child)
            })
          } else {
            parentField.classList.remove('is-active')
            console.log('Removed is-active from:', parentField)

            // Remove is-active from all child elements
            const childElements = parentField.querySelectorAll('*')
            childElements.forEach((child) => {
              child.classList.remove('is-active')
              console.log('Removed is-active from child:', child)
            })
          }
        })

        // Trigger form validation after radio button change
        const event = new Event('input', { bubbles: true, cancelable: true })
        radioInput.dispatchEvent(event)
      })
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupRadioButtonBehavior)
  } else {
    setupRadioButtonBehavior()
  }
}

export default initializeRadioButtons
