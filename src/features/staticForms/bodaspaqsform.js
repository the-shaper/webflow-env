// This script handles the visual state for radio buttons within the form
// marked with the attribute data-form="bodaspaqs".
// It toggles the 'is-active' class on the radio button field and its children.

/**
 * Updates the visual state ('is-active' class) for a group of radio buttons.
 * @param {HTMLInputElement} radio - The radio button element that was interacted with.
 */
function updateBodaspaqsRadioVisualState(radio) {
  // Get all radios in the same group
  const groupName = radio.name
  // Find the closest container with the data-form="bodaspaqs" attribute
  const formWrapper = radio.closest('[data-form="bodaspaqs"]')

  // If not within the target form wrapper, do nothing
  if (!formWrapper) {
    return
  }

  // Find all radio buttons in the same group within this specific form wrapper
  const groupRadios = formWrapper.querySelectorAll(`input[name="${groupName}"]`)

  // Iterate through all radio buttons in the group to update their visual state
  groupRadios.forEach((button) => {
    // Find the parent Webflow radio button field element
    const field = button.closest('.radio-button-field.w-radio')
    if (!field) {
      return // Skip if the field wrapper is not found
    }

    // Determine if the current radio button is checked
    const isActive = button.checked

    // Toggle the 'is-active' class on the field and the input itself
    field.classList.toggle('is-active', isActive)
    button.classList.toggle('is-active', isActive) // Although visual state is typically on the parent field

    // Toggle the 'is-active' class on all children of the field (e.g., the label)
    field.querySelectorAll('*').forEach((child) => {
      child.classList.toggle('is-active', isActive)
    })
  })
}

/**
 * Initializes the event listeners for the bodaspaqs form.
 */
function initializeBodaspaqsForm() {
  // Set up event delegation for click and change events on the document
  // We listen on the document and filter down to our specific form.
  document.addEventListener('click', (event) => {
    // Check if the click occurred within the data-form="bodaspaqs" container
    const formWrapper = event.target.closest('[data-form="bodaspaqs"]')
    if (!formWrapper) {
      return // Ignore clicks outside our target form
    }

    // Check if the click is related to a radio button field
    const radioField = event.target.closest('.radio-button-field.w-radio')
    if (!radioField) {
      return // Ignore clicks not on a radio field
    }

    // Find the actual radio input element
    const radio = radioField.querySelector('input[type="radio"]')
    if (!radio) {
      return // Ignore if no radio input is found within the field wrapper
    }

    // Use a small timeout to allow Webflow's native click handling to potentially
    // update the checked state before we update the visual state.
    setTimeout(() => {
      // The change event listener below is primarily responsible for calling
      // updateBodaspaqsRadioVisualState, but calling it here too after a click
      // provides robustness in case the change event doesn't fire immediately
      // or for scenarios like initial page load states if you were to trigger clicks programmatically.
      updateBodaspaqsRadioVisualState(radio)
      // Note: In many cases, the native 'change' event fired after a click
      // will handle the update, potentially making the direct call here redundant
      // depending on browser behavior and Webflow's handling. Keeping it similar
      // to the original logic for safety.
    }, 0)
  })

  document.addEventListener('change', (event) => {
    // Check if the change occurred within the data-form="bodaspaqs" container
    const formWrapper = event.target.closest('[data-form="bodaspaqs"]')
    if (!formWrapper) {
      return // Ignore changes outside our target form
    }

    // Check if the change event is from a radio button
    if (!event.target.matches('input[type="radio"]')) {
      return // Ignore changes from non-radio inputs
    }

    const radio = event.target

    // Call the visual state update function for the changed radio button
    // This is the primary trigger for updating the 'is-active' classes
    // whenever a radio button's checked state changes.
    updateBodaspaqsRadioVisualState(radio)

    // If your form needs additional logic based on radio changes (like showing/hiding
    // conditional fields, similar to the conditional groups in RadioManager),
    // you would add that logic here or call other functions from here.
    // Since you mentioned this form is simpler, we are only including the visual state update.
  })

  // Optional: You might want to run an initial update on page load
  // to set the correct 'is-active' state based on pre-selected radio buttons
  // (e.g., if using CMS data to pre-fill the form).
  // This would involve finding all radio buttons within the form wrapper
  // and calling updateBodaspaqsRadioVisualState for the checked ones.
  /*
  document.addEventListener('DOMContentLoaded', () => {
    const formWrapper = document.querySelector('[data-form="bodaspaqs"]');
    if (formWrapper) {
      formWrapper.querySelectorAll('input[type="radio"]').forEach(radio => {
        if (radio.checked) {
          updateBodaspaqsRadioVisualState(radio);
        }
      });
    }
  });
  */
}

// Export the initialization function
export default initializeBodaspaqsForm
