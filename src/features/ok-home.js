// Initialize GSAP
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default class MenuController {
  static init() {
    // Debug logs to verify page detection
    console.log('Current path:', window.location.pathname)
    console.log(
      'Has home attribute:',
      !!document.querySelector('[data-page="home"]')
    )

    const isTargetPage =
      window.location.pathname === '/' ||
      document.querySelector('[data-page="home"]')

    console.log('Is target page:', isTargetPage)

    if (!isTargetPage) {
      console.log('MenuController: Not on home page, skipping initialization')
      return
    }

    console.log('MenuController: Initializing on home page')
    return new MenuController()
  }

  constructor() {
    this.menuOpen = false
    this.menuTrigger = document.querySelector('[data-menu-trigger]')
    this.menuCloseButtons = document.querySelectorAll('[data-menu-close]')
    this.menuContent = document.querySelector('[data-content="menu"]')
    this.introContent = document.querySelector('[data-content="intro"]')
    this.lastScrollTime = Date.now()

    // Add non class by default
    this.menuCloseButtons.forEach((button) => button.classList.add('non'))

    this.timeline = gsap.timeline({ paused: true })

    this.initializeAnimation()
    this.bindEvents()
    this.preventScroll()
  }

  preventScroll() {
    // Prevent default scroll
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    // Handle both wheel and trackpad
    window.addEventListener('wheel', (e) => this.handleScroll(e), {
      passive: false,
    })
    window.addEventListener('touchmove', (e) => e.preventDefault(), {
      passive: false,
    })
  }

  handleScroll(e) {
    e.preventDefault()

    // Debounce scroll events
    const now = Date.now()
    if (now - this.lastScrollTime < 500) return // 500ms cooldown
    this.lastScrollTime = now

    if (e.deltaY > 0 && !this.menuOpen) {
      // Scrolling down - open menu
      this.openMenu()
    } else if (e.deltaY < 0 && this.menuOpen) {
      // Scrolling up - close menu
      this.closeMenu()
    }
  }

  initializeAnimation() {
    this.timeline
      .to(this.introContent, {
        x: '-100%',
        duration: 0.5,
        ease: 'power2.inOut',
      })
      .to(
        this.menuContent,
        {
          x: '-100%',
          duration: 0.5,
          ease: 'power2.inOut',
        },
        '-=0.5'
      )
  }

  bindEvents() {
    this.menuTrigger.addEventListener('click', () => this.openMenu())
    this.menuCloseButtons.forEach((button) => {
      button.addEventListener('click', () => this.closeMenu())
    })
  }

  openMenu() {
    if (this.menuOpen) return
    this.menuOpen = true
    this.menuCloseButtons.forEach((button) => button.classList.remove('non'))
    this.menuTrigger.classList.add('non')
    this.timeline.play()
  }

  closeMenu() {
    if (!this.menuOpen) return
    this.menuOpen = false
    this.menuCloseButtons.forEach((button) => button.classList.add('non'))
    this.menuTrigger.classList.remove('non')
    this.timeline.reverse()
  }
}

// Initialize only when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  MenuController.init()
})
