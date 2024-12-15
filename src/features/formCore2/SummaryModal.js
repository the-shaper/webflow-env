class SummaryModal {
  constructor() {
    // First, let's log what we're looking for
    console.log('🎭 Modal: Looking for elements with selectors:', {
      background: '[data-form="second"] #modal-background',
      content: '[data-form="second"] #modal-content',
      priceWrapper: '[data-form="second"] #pricewrapper',
      button: '[data-form="second"] .f-modal-button',
    })

    this.modalBackground = document.querySelector(
      '[data-form="second"] #modal-background'
    )
    this.modalContent = document.querySelector(
      '[data-form="second"] #modal-content'
    )
    this.priceWrapper = document.querySelector(
      '[data-form="second"] #pricewrapper'
    )
    this.modalButton = document.querySelector(
      '[data-form="second"] .f-modal-button'
    )

    // Then log what we found
    console.log('🎭 Modal: Found elements:', {
      background: this.modalBackground?.id || 'not found',
      content: this.modalContent?.id || 'not found',
      priceWrapper: this.priceWrapper?.id || 'not found',
      button: this.modalButton?.className || 'not found',
      html: document.querySelector('[data-form="second"]')?.innerHTML,
    })

    this.setupListeners()
  }

  setupListeners() {
    // Setup open button
    if (this.modalButton) {
      this.modalButton.addEventListener('click', (e) => {
        console.log('🎭 Modal: Button clicked', {
          isOff: this.modalButton.classList.contains('is-off'),
          disabled: this.modalButton.disabled,
        })

        if (this.modalButton.classList.contains('is-off')) {
          e.preventDefault()
          e.stopPropagation()
          return false
        }
        this.updateAndOpen()
      })
    }

    // Setup close button
    const closeButton = document.querySelector(
      '[data-form="second"] #close-modal-button'
    )
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        console.log('🎭 Modal: Close button clicked')
        this.close()
      })
    }

    console.log('🎭 Modal: Listeners setup complete', {
      hasCloseButton: !!closeButton,
    })
  }

  updateAndOpen() {
    console.log('🎭 Modal: Updating and opening...')
    this.update()
    this.open()
  }

  update() {
    console.log('🎭 Modal: Starting update')
    if (!this.modalContent) {
      console.warn('⚠️ Modal: No modal content element found')
      return
    }

    // Clear existing content
    this.modalContent.innerHTML =
      '<h3 class="modal-main-title">Resumen de tu Paquete</h3>'

    // Get the active coverage wrapper
    const activeWrapper = document.querySelector(
      '[data-form="second"] .coverage-wrapper:not(.off)'
    )
    if (!activeWrapper) {
      console.warn('⚠️ Modal: No active coverage wrapper found')
      return
    }

    console.log('📦 Modal: Active wrapper:', {
      id: activeWrapper.id,
      hasServices: !!activeWrapper.querySelector(
        'input[name$="-services"]:checked'
      ),
      activeGroups: activeWrapper.querySelectorAll(
        '.conditional-group.is-active'
      ).length,
    })

    // Create wrapper for this coverage section
    const coverageWrapper = document.createElement('div')
    coverageWrapper.className = 'formPage-data-wrapper'

    // Add coverage title
    const titleElement = document.createElement('h4')
    titleElement.className = 'modal-page-title'
    const coverageTitle = document.querySelector(
      '[data-form="second"] #p1-group0 input[type="radio"]:checked'
    )
    titleElement.textContent = coverageTitle ? coverageTitle.value : ''
    coverageWrapper.appendChild(titleElement)

    // Get selections organized by type
    const selections = this.getPageSelections(activeWrapper)

    // Add main service if exists
    if (selections.main) {
      this.addServiceSection(coverageWrapper, selections.main)
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
      coverageWrapper.appendChild(photoWrapper)
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
      coverageWrapper.appendChild(videoWrapper)
    }

    this.modalContent.appendChild(coverageWrapper)

    // Update total price
    if (this.priceWrapper) {
      const formTotal = document.querySelector(
        '[data-form="second"] #form-totalprice'
      )
      this.priceWrapper.innerHTML = `
        <p class="sh1 white totalprice">Inversión total</p>
        <h6 class="h6 white upper-margin">${
          formTotal ? formTotal.textContent : '$0'
        }</h6>
      `
    }
  }

  getPageSelections(activeWrapper) {
    const selections = {
      main: null,
      photo: [],
      video: [],
      other: [],
    }

    console.log('🔍 Modal: Getting selections from', activeWrapper.id)

    // Get main service selection
    const mainService = activeWrapper.querySelector(
      'input[type="radio"][name$="-services"]:checked'
    )
    if (mainService) {
      selections.main = {
        type: 'main-service',
        value: mainService.value,
        price: mainService.closest('.radio-button-field').querySelector('.p2')
          ?.textContent,
        serviceType: this.getServiceType(mainService.name),
      }
      console.log('📍 Modal: Main service found:', selections.main)
    }

    // Get conditional selections from active groups
    const activeGroups = activeWrapper.querySelectorAll(
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
            .querySelector('.p2')?.textContent,
        }

        console.log(`✓ Modal: ${serviceType} selection:`, selection)

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
    console.log('🎭 Modal: Opening modal', {
      background: this.modalBackground?.style.display,
    })
    if (this.modalBackground) {
      this.modalBackground.style.display = 'flex'
      console.log('🎭 Modal: Display set to flex')
    } else {
      console.warn('⚠️ Modal: No modal background element found')
    }
  }

  close() {
    console.log('🎭 Modal: Closing modal')
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
