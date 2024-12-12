class Calculator {
  constructor() {
    this.listeners = new Set()
    this.prices = new Map()
    console.log('Calculator2 initialized')
  }

  calculatePagePrices(pageNum) {
    console.log(`📊 Calculator2: Calculating prices for page ${pageNum}...`)

    const wrapper = document.querySelector(
      `[data-form="second"] #p${pageNum}-formfields`
    )
    if (!wrapper) return

    const pageSum = this.calculatePageSum(wrapper, pageNum)

    // Store the new page sum
    this.prices.set(pageNum, pageSum)

    // Calculate total by summing all page values
    const totalSum = Array.from(this.prices.entries()).reduce(
      (sum, [key, value]) => {
        return typeof key === 'number' ? sum + value : sum
      },
      0
    )

    console.log('\n💰 Calculator2: Price Map after calculation:', {
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

    // Create a Map to store all checked radios by their names
    const checkedRadios = new Map()

    // Collect all checked radios from active groups
    activeGroups.forEach((group) => {
      const checkedRadio = Array.from(
        group.querySelectorAll('input[type="radio"]')
      ).find((radio) => radio.checked)

      if (checkedRadio) {
        checkedRadios.set(checkedRadio.name, {
          radio: checkedRadio,
          price: parseFloat(checkedRadio.dataset.price) || 0,
          groupType: 'conditional',
          groupId: group.id,
        })
      }
    })

    // Process main group first
    mainGroup.forEach((data) => {
      sum += data.price
    })

    // Then process all conditional groups
    checkedRadios.forEach((data) => {
      sum += data.price
    })

    // Update individual page total
    const totalElement = document.querySelector(
      `[data-form="second"] #p${pageNum}-totalprice`
    )
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
      document.querySelector('[data-form="second"] .f-inv-total-wrapper'),
      document.querySelector('[data-form="second"] .inv-seccion-wrapper'),
    ]

    elements.forEach((element) => {
      if (element) {
        element.classList.remove('flash-animation')
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
    console.log(`🗑️ Calculator2: Clearing prices for page ${pageNum}`)
    this.prices.delete(pageNum)

    const totalElement = document.querySelector(
      `[data-form="second"] #p${pageNum}-totalprice`
    )
    if (totalElement) {
      totalElement.textContent = this.formatCurrency(0)
    }

    const totalSum = Array.from(this.prices.entries()).reduce(
      (sum, [key, value]) => {
        return typeof key === 'number' ? sum + value : sum
      },
      0
    )

    this.prices.set('total', totalSum)
    this.notifyListeners()
  }
}

export default Calculator
