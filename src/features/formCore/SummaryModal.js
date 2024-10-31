class SummaryModal {
  constructor() {
    this.modalBackground = document.getElementById('modal-background')
    this.modalContent = document.getElementById('modal-content')
    this.priceWrapper = document.getElementById('pricewrapper')
    this.setupListeners()
  }

  setupListeners() {
    // Setup open button
    const openButton = document.getElementById('open-modal')
    if (openButton) {
      openButton.addEventListener('click', () => this.updateAndOpen())
    }

    // Setup close button
    const closeButton = document.getElementById('close-modal-button')
    if (closeButton) {
      closeButton.addEventListener('click', () => this.close())
    }

    // Setup background click to close
    if (this.modalBackground) {
      this.modalBackground.addEventListener('click', (event) => {
        if (event.target === this.modalBackground) {
          this.close()
        }
      })
    }
  }

  updateAndOpen() {
    this.update()
    this.open()
  }

  update() {
    if (!this.modalContent) return

    // Clear existing content
    this.modalContent.innerHTML =
      '<h3 class="modal-main-title">Your Package Summary</h3>'

    // Get all form pages
    const formPages = document.querySelectorAll('.f-page')

    formPages.forEach((page) => {
      // Only process pages that have selections
      const formFields = page.querySelector('[id$="-formfields"]')
      const pageTotal = page.querySelector('[id$="-totalprice"]')

      if (!formFields || !pageTotal || pageTotal.textContent === '$0') return

      // Create page wrapper
      const pageWrapper = document.createElement('div')
      pageWrapper.className = 'formPage-data-wrapper'

      // Add page title
      const titleElement = document.createElement('h4')
      titleElement.className = 'modal-page-title'
      const pageTitle = page.querySelector('h3')
      titleElement.textContent = pageTitle ? pageTitle.textContent : ''
      pageWrapper.appendChild(titleElement)

      // Get selected services
      const selectedServices = this.getPageSelections(formFields)
      selectedServices.forEach((service) => {
        const selectionWrapper = document.createElement('div')
        selectionWrapper.className = `selected-concept-wrapper ${service.type}`

        const serviceType = document.createElement('p')
        serviceType.className = 'modal-service-type'
        serviceType.textContent = service.value
        selectionWrapper.appendChild(serviceType)

        const servicePrice = document.createElement('p')
        servicePrice.className = 'modal-service-price'
        servicePrice.textContent = service.price
        selectionWrapper.appendChild(servicePrice)

        pageWrapper.appendChild(selectionWrapper)
      })

      this.modalContent.appendChild(pageWrapper)
    })

    // Update total price
    if (this.priceWrapper) {
      const formTotal = document.getElementById('form-totalprice')
      this.priceWrapper.innerHTML = `
        <p class="sh1 white totalprice">Inversión total</p>
        <h6 class="h6 white upper-margin">${
          formTotal ? formTotal.textContent : '$0'
        }</h6>
      `
    }
  }

  getPageSelections(formFields) {
    const selections = []

    // Get main service selection
    const mainService = formFields.querySelector(
      'input[type="radio"][name$="-services"]:checked'
    )
    if (mainService) {
      selections.push({
        type: 'main-service',
        value: mainService.value,
        price: mainService.closest('.radio-button-field').querySelector('.p2')
          .textContent,
      })
    }

    // Get conditional selections from active groups
    const activeGroups = formFields.querySelectorAll(
      '.conditional-group.is-active'
    )
    activeGroups.forEach((group) => {
      const checkedRadio = group.querySelector('input[type="radio"]:checked')
      if (checkedRadio) {
        selections.push({
          type: this.getServiceType(checkedRadio.name),
          value: checkedRadio.value,
          price: checkedRadio
            .closest('.radio-button-field')
            .querySelector('.p2').textContent,
        })
      }
    })

    return selections
  }

  getServiceType(name) {
    if (name.includes('foto')) return 'photo-service'
    if (name.includes('video')) return 'video-service'
    return 'other-service'
  }

  open() {
    if (this.modalBackground) {
      this.modalBackground.style.display = 'flex'
    }
  }

  close() {
    if (this.modalBackground) {
      this.modalBackground.style.display = 'none'
    }
  }
}

export default SummaryModal
