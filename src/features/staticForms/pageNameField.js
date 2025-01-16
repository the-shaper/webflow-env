/* global $ */
export function setPageName() {
  const pageName = document.querySelector('h1')?.textContent || document.title
  const field = $('input[name="Page Name"]')

  console.log('Captured page name:', pageName)

  if (field.length) {
    field.val(pageName)
    console.log('Field value set to:', field.val())
  } else {
    console.log('Warning: Page Name field not found')
  }
}
