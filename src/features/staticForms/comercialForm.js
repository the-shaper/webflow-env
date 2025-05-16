// This script handles the visual state for radio buttons within the form
// marked with the attribute data-form="comercial".
// It toggles the 'is-active' class on the radio button field and its children.

/**
 * Updates the visual state ('is-active' class) for a group of radio buttons.
 * @param {HTMLInputElement} radio - The radio button element that was interacted with.
 */
function updateComercialRadioVisualState(radio) {
  // Get all radios in the same group
  const groupName = radio.name
  // Find the closest container with the data-form="comercial" attribute
  const formWrapper = radio.closest('[data-form="comercial"]')

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
 * Initializes the event listeners for the comercial form.
 */
function initializeComercialForm() {
  // Set up event delegation for click and change events on the document
  // We listen on the document and filter down to our specific form.
  document.addEventListener('click', (event) => {
    // Check if the click occurred within the data-form="comercial" container
    const formWrapper = event.target.closest('[data-form="comercial"]')
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
      // updateComercialRadioVisualState, but calling it here too after a click
      // provides robustness in case the change event doesn't fire immediately
      // or for scenarios like initial page load states if you were to trigger clicks programmatically.
      updateComercialRadioVisualState(radio)
      // Note: In many cases, the native 'change' event fired after a click
      // will handle the update, potentially making the direct call here redundant
      // depending on browser behavior and Webflow's handling. Keeping it similar
      // to the original logic for safety.
    }, 0)
  })

  document.addEventListener('change', (event) => {
    // Check if the change occurred within the data-form="comercial" container
    const formWrapper = event.target.closest('[data-form="comercial"]')
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
    updateComercialRadioVisualState(radio)

    // If your form needs additional logic based on radio changes, add it here.
    // For this simpler form, we only handle the visual state.
  })

  // Optional: Initial update on page load for pre-selected radios
  /*
  document.addEventListener('DOMContentLoaded', () => {
    const formWrapper = document.querySelector('[data-form="comercial"]');
    if (formWrapper) {
      formWrapper.querySelectorAll('input[type="radio"]').forEach(radio => {
        if (radio.checked) {
          updateComercialRadioVisualState(radio);
        }
      });
    }
  });
  */

  // Get the comercial form element and add submit listener
  const comercialForm = document.querySelector('[data-form="comercial"]')
  if (comercialForm) {
    comercialForm.addEventListener('submit', handleComercialSubmit)
  }
}

/**
 * Handles the submission of the comercial form.
 * @param {Event} event - The submit event.
 */
async function handleComercialSubmit(event) {
  // Prevent default form submission
  event.preventDefault()

  // Collect data using the provided selectors
  const clientNameInput = document.querySelector('#Nombre-Del-Cliente-com')
  const projectNameInput = document.querySelector('#Nombre-del-proyecto-com') // Project Name
  const clientEmailInput = document.querySelector('#E-mail-cliente-com')
  const serviceNeedsRadio = document.querySelector(
    'input[name="Needs-com"]:checked'
  ) // Checked radio for Service Needs
  const eventDateInput = document.querySelector('[data-element="datepicker"]')
  const serviceNameElement = document.querySelector('h1') // First h1 for Service Name

  // Basic validation
  if (
    !clientNameInput ||
    !projectNameInput ||
    !clientEmailInput ||
    !serviceNeedsRadio ||
    !eventDateInput ||
    !serviceNameElement
  ) {
    console.error('Required form elements not found for comercial form')
    // Optionally show an error message to the user
    return
  }
  if (
    !clientNameInput.value ||
    !projectNameInput.value ||
    !clientEmailInput.value ||
    !serviceNeedsRadio.value ||
    !eventDateInput.value
  ) {
    console.error('Required form fields are empty for comercial form')
    // Optionally show an error message to the user
    return
  }

  // Construct formData object
  const formData = {
    clientName: clientNameInput.value,
    projectName: projectNameInput.value,
    clientEmail: clientEmailInput.value,
    serviceNeeds: serviceNeedsRadio.value,
    serviceName: serviceNameElement.textContent || 'Comercial', // Use h1 content, fallback text
    eventDate: eventDateInput.value.split('-').join('/'), // Format date
    formType: 'comercial', // Add a form identifier
  }

  console.log('Submitting comercial form data:', formData)

  // Determine function URL
  const functionUrl =
    window.location.hostname === 'localhost'
      ? '/.netlify/functions/create-calendar-event'
      : 'https://webflow-env-git.netlify.app/.netlify/functions/create-calendar-event' // Use the same logic as FormController

  console.log('Sending request to:', functionUrl)

  // Send POST request
  try {
    const response = await fetch(functionUrl, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const responseText = await response.text()
    console.log('Raw comercial response:', responseText)

    let result
    try {
      result = JSON.parse(responseText)
    } catch (e) {
      console.error('Failed to parse comercial response as JSON:', responseText)
      throw new Error('Invalid response from server')
    }

    if (!response.ok) {
      throw new Error(result.message || 'Error submitting comercial form')
    }

    console.log('Comercial form submission successful:', result)
    // Handle success (e.g., show a success message, redirect)
    // You will need to determine how success should be handled in your Webflow setup.
    // For now, I'll just log success.
  } catch (error) {
    console.error('Error submitting comercial form:', error)
    // Handle error (e.g., show an error message)
    // You will need to determine how errors should be handled in your Webflow setup.
    // For now, I'll just log the error.
  }
}

// Export the initialization function
export default initializeComercialForm
