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

    // Get ALL active conditional groups
    const activeGroups = wrapper.querySelectorAll(
      '.conditional-group.is-active'
    )
    console.log(
      '🔍 Found Active Groups:',
      Array.from(activeGroups).map((g) => ({
        id: g.id,
        hasCheckedRadio: !!g.querySelector('input[type="radio"]:checked'),
        checkedRadioDetails: Array.from(
          g.querySelectorAll('input[type="radio"]:checked')
        ).map((r) => ({
          name: r.name,
          value: r.value,
          price: r.dataset.price,
        })),
      }))
    )

    // Create a Map to store all checked radios by their names
    const checkedRadios = new Map()

    // First pass: collect all checked radios from active groups
    activeGroups.forEach((group) => {
      // Get all radio inputs in this group
      const allRadios = group.querySelectorAll('input[type="radio"]')
      console.log(`🔍 Group ${group.id} Details:`, {
        groupId: group.id,
        isActive: group.classList.contains('is-active'),
        allRadios: Array.from(allRadios).map((r) => ({
          name: r.name,
          checked: r.checked,
          value: r.value,
          price: r.dataset.price,
          parentIsActive: r
            .closest('.radio-button-field')
            ?.classList.contains('is-active'),
        })),
      })

      // Find the checked radio for this group
      const checkedRadio = Array.from(allRadios).find((radio) => {
        const isChecked = radio.checked
        console.log(`Radio Check in ${group.id}:`, {
          name: radio.name,
          value: radio.value,
          isChecked,
          hasActiveParent: radio
            .closest('.radio-button-field')
            ?.classList.contains('is-active'),
        })
        return isChecked
      })

      if (checkedRadio) {
        console.log(`✅ Found checked radio in ${group.id}:`, {
          name: checkedRadio.name,
          value: checkedRadio.value,
          price: checkedRadio.dataset.price,
        })
        checkedRadios.set(checkedRadio.name, {
          radio: checkedRadio,
          price: parseFloat(checkedRadio.dataset.price) || 0,
          groupType: 'conditional',
          groupId: group.id,
        })
      } else {
        console.log(`❌ No checked radio found in ${group.id}`)
      }
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

    // Then process all conditional groups
    console.log('\nProcessed conditional groups:')
    checkedRadios.forEach((data, radioName) => {
      console.log({
        radioName,
        groupId: data.groupId,
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
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number)
  }

  notifyListeners() {
    this.listeners.forEach((callback) => callback(this.prices))

    // Add flash animation to both elements
    const elements = [
      document.querySelector('.f-inv-total-wrapper'),
      document.querySelector('.inv-seccion-wrapper'),
    ]

    elements.forEach((element) => {
      if (element) {
        element.classList.remove('flash-animation')
        // Force browser reflow to restart animation
        void element.offsetWidth
        element.classList.add('flash-animation')
      }
    })
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
    const totalSum = Array.from(this.prices.entries()).reduce(
      (sum, [key, value]) => {
        // Only add numerical page values (ignore 'total' key)
        return typeof key === 'number' ? sum + value : sum
      },
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
