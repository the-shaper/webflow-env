function initializeCalculator() {
  // Function to format number as currency
  function formatCurrency(number) {
    return '$' + number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  // Function to calculate the sum of selected radio button values for a given form field wrapper
  function calculateSum(formFieldWrapperId, totalPriceElementId) {
    const formFieldWrapper = document.getElementById(formFieldWrapperId)
    const radioGroups = formFieldWrapper.querySelectorAll(
      'input[type="radio"]:checked'
    )
    let sum = 0

    radioGroups.forEach((radio) => {
      sum += parseFloat(radio.dataset.price) || 0
    })

    document.getElementById(totalPriceElementId).textContent =
      formatCurrency(sum)
    return sum
  }

  // Function to calculate the total sum of all form field wrappers
  function calculateTotalSum() {
    let totalSum = 0
    const pages = document.querySelectorAll('.f-page')
    const maxPages = pages.length

    for (let i = 1; i < maxPages; i++) {
      // Note: < instead of <=
      const formFieldWrapperId = `p${i}-formfields`
      const totalPriceElementId = `p${i}-totalprice`

      if (document.getElementById(formFieldWrapperId)) {
        totalSum += calculateSum(formFieldWrapperId, totalPriceElementId)
      }
    }

    document.getElementById('form-totalprice').textContent =
      formatCurrency(totalSum)
  }

  // Add event listeners to all radio buttons to recalculate sums on change
  document.querySelectorAll('input[type="radio"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      calculateTotalSum()
    })
  })

  // Initial calculation on page load
  calculateTotalSum()

  return {
    recalculate: calculateTotalSum,
  }
}

export default initializeCalculator
