class Calculator {
  constructor() {
    this.listeners = new Set()
    this.prices = new Map()
    console.log('Calculator initialized')
  }

  calculatePagePrices(pageNum) {
    console.log(`📊 Calculating prices for page ${pageNum}...`)

    const wrapper = document.getElementById(`p${pageNum}-formfields`)
    if (!wrapper) return

    const pageSum = this.calculatePageSum(wrapper, pageNum)

    // Store the new page sum
    this.prices.set(pageNum, pageSum)

    // Calculate total by summing all page values
    const totalSum = Array.from(this.prices.entries()).reduce(
      (sum, [key, value]) => {
        // Only add numerical page values (ignore 'total' key)
        return typeof key === 'number' ? sum + value : sum
      },
      0
    )

    console.log('\n💰 Price Map after calculation:', {
      pages: Object.fromEntries(this.prices),
      newTotal: totalSum,
    })

    this.prices.set('total', totalSum)
    this.notifyListeners()
  }

  calculatePageSum(wrapper, pageNum) {
    let sum = 0
    const mainGroup = new Map()
    const conditionalGroups = new Map()

    // Debug: Log all radio buttons state before any processing
    console.log('\n🔍 DEBUG - Before Processing:')
    const allRadios = wrapper.querySelectorAll('input[type="radio"]')
    console.log(
      'All radios in wrapper:',
      Array.from(allRadios).map((r) => ({
        name: r.name,
        checked: r.checked,
        value: r.value,
        price: r.dataset.price,
        inConditionalGroup: !!r.closest('.conditional-group'),
        groupActive: r
          .closest('.conditional-group')
          ?.classList.contains('is-active'),
      }))
    )

    // First, get the main service radio (if any)
    const mainServiceRadio = wrapper.querySelector(
      `input[name="p${pageNum}-services"]:checked`
    )

    // Debug: Log main service query result
    console.log('🔍 Main Service Query:', {
      selector: `input[name="p${pageNum}-services"]:checked`,
      found: !!mainServiceRadio,
      value: mainServiceRadio?.value,
      price: mainServiceRadio?.dataset.price,
      checked: mainServiceRadio?.checked,
    })

    if (mainServiceRadio) {
      mainGroup.set('services', {
        radio: mainServiceRadio,
        price: parseFloat(mainServiceRadio.dataset.price) || 0,
        groupType: 'main',
      })
    }

    // Debug: Log conditional groups state
    const allConditionalGroups = wrapper.querySelectorAll('.conditional-group')
    console.log(
      '🔍 Conditional Groups:',
      Array.from(allConditionalGroups).map((g) => ({
        id: g.id,
        isActive: g.classList.contains('is-active'),
        hasCheckedRadios: !!g.querySelector('input[type="radio"]:checked'),
      }))
    )

    // Then get all conditional radios
    const conditionalRadios = wrapper.querySelectorAll(
      '.conditional-group.is-active input[type="radio"]:checked'
    )

    // Debug: Log found conditional radios
    console.log(
      '🔍 Found Conditional Radios:',
      Array.from(conditionalRadios).map((r) => ({
        name: r.name,
        value: r.value,
        price: r.dataset.price,
        groupId: r.closest('.conditional-group')?.id,
      }))
    )

    conditionalRadios.forEach((radio) => {
      conditionalGroups.set(radio.name, {
        radio,
        price: parseFloat(radio.dataset.price) || 0,
        groupType: 'conditional',
      })
    })

    // Process main group first
    console.log('\nProcessed main groups:')
    mainGroup.forEach((data, groupName) => {
      console.log({
        groupName,
        value: data.radio.value,
        price: data.price,
        groupType: data.groupType,
      })
      sum += data.price
    })

    // Then add conditional groups
    console.log('\nProcessed conditional groups:')
    conditionalGroups.forEach((data, groupName) => {
      console.log({
        groupName,
        value: data.radio.value,
        price: data.price,
        groupType: data.groupType,
      })
      sum += data.price
    })

    console.log(`\nFinal sum for page ${pageNum}: ${sum}`)

    // Update individual page total
    const totalElement = document.getElementById(`p${pageNum}-totalprice`)
    if (totalElement) {
      totalElement.textContent = this.formatCurrency(sum)
    }

    return sum
  }

  formatCurrency(number) {
    return '$' + number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  notifyListeners() {
    this.listeners.forEach((callback) => callback(this.prices))
  }

  subscribe(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  getPrices() {
    return this.prices
  }

  clearPagePrices(pageNum) {
    console.log(`🗑️ Clearing prices for page ${pageNum}`)
    // Remove the page's price from our price map
    this.prices.delete(pageNum)

    // Clear the page total display
    const totalElement = document.getElementById(`p${pageNum}-totalprice`)
    if (totalElement) {
      totalElement.textContent = this.formatCurrency(0)
    }

    // Recalculate total without this page
    const totalSum = Array.from(this.prices.values()).reduce(
      (sum, price) => (typeof price === 'number' ? sum + price : sum),
      0
    )

    console.log(
      `\n💰 New Total Sum after clearing page ${pageNum}: ${totalSum}`
    )
    this.prices.set('total', totalSum)
    this.notifyListeners()
  }
}

export default Calculator
