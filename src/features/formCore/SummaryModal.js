class SummaryModal {
  constructor() {
    this.modalBackground = document.getElementById('modal-background')
    this.modalContent = document.getElementById('modal-content')
    this.priceWrapper = document.getElementById('pricewrapper')
    this.modalButton = document.querySelector('.f-modal-button')
    this.setupListeners()
  }

  setupListeners() {
    // Setup open button
    if (this.modalButton) {
      this.modalButton.addEventListener('click', (e) => {
        if (this.modalButton.classList.contains('is-off')) {
          e.preventDefault()
          e.stopPropagation()
          return false
        }
        this.updateAndOpen()
      })
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
      '<h3 class="modal-main-title">Resumen de tu Paquete</h3>'

    // Get all form pages
    const formPages = document.querySelectorAll('.f-page')

    formPages.forEach((page) => {
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

      // Get selections organized by type
      const selections = this.getPageSelections(formFields)

      // Add main service if exists
      if (selections.main) {
        this.addServiceSection(pageWrapper, selections.main)
      }

      // Create photo services section if exists
      if (selections.photo.length > 0) {
        const photoWrapper = document.createElement('div')
        photoWrapper.className = 'service-category-wrapper photo'
        const photoTitle = document.createElement('h5')
        photoTitle.className = 'service-category-title'
        photoTitle.textContent = 'Detalles de la Fotografía'
        photoWrapper.appendChild(photoTitle)

        selections.photo.forEach((service) => {
          this.addServiceSection(photoWrapper, service)
        })
        pageWrapper.appendChild(photoWrapper)
      }

      // Create video services section if exists
      if (selections.video.length > 0) {
        const videoWrapper = document.createElement('div')
        videoWrapper.className = 'service-category-wrapper video'
        const videoTitle = document.createElement('h5')
        videoTitle.className = 'service-category-title'
        videoTitle.textContent = 'Detalles del Video'
        videoWrapper.appendChild(videoTitle)

        selections.video.forEach((service) => {
          this.addServiceSection(videoWrapper, service)
        })
        pageWrapper.appendChild(videoWrapper)
      }

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
    const selections = {
      main: null,
      photo: [],
      video: [],
      other: [],
    }

    // Get main service selection
    const mainService = formFields.querySelector(
      'input[type="radio"][name$="-services"]:checked'
    )
    if (mainService) {
      selections.main = {
        type: 'main-service',
        value: mainService.value,
        price: mainService.closest('.radio-button-field').querySelector('.p2')
          .textContent,
        serviceType: this.getServiceType(mainService.name),
      }
    }

    // Get conditional selections from active groups
    const activeGroups = formFields.querySelectorAll(
      '.conditional-group.is-active'
    )
    activeGroups.forEach((group) => {
      const checkedRadio = group.querySelector('input[type="radio"]:checked')
      if (checkedRadio) {
        const serviceType = this.getServiceType(checkedRadio.name)
        const selection = {
          type: serviceType,
          value: checkedRadio.value,
          price: checkedRadio
            .closest('.radio-button-field')
            .querySelector('.p2').textContent,
        }

        // Add to appropriate category
        if (serviceType === 'photo-service') {
          selections.photo.push(selection)
        } else if (serviceType === 'video-service') {
          selections.video.push(selection)
        } else {
          selections.other.push(selection)
        }
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

  addServiceSection(wrapper, service) {
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

    wrapper.appendChild(selectionWrapper)
  }
}

export default SummaryModal
