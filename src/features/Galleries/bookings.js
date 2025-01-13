import Swiper from 'swiper'
import { Keyboard } from 'swiper/modules'
import 'swiper/css'

export default function initBookingsGallery() {
  console.log('🚀 Starting initBookingsGallery function')
  console.log('Current window width:', window.innerWidth)

  // Check if element exists
  const swiperElement = document.querySelector('.swiper.is-bookings')
  if (!swiperElement) {
    console.error('❌ Swiper element not found!')
    return null
  }
  console.log('✅ Found swiper element:', swiperElement)

  // Check slides
  const slides = swiperElement.querySelectorAll('.swiper-slide')
  console.log('📊 Number of slides found:', slides.length)

  // Only initialize for tablet and mobile
  if (window.innerWidth >= 992) {
    console.log('💻 Desktop detected - not initializing Swiper')
    return null
  }

  console.log('📱 Mobile/Tablet detected - initializing Swiper')

  const swiper = new Swiper('.swiper.is-bookings', {
    modules: [Keyboard],
    slidesPerView: 'auto',
    spaceBetween: 20,
    centeredSlides: false,

    // Add padding to the slider
    slidesOffsetBefore: 20, // Left padding
    slidesOffsetAfter: 20, // Right padding

    breakpoints: {
      0: {
        enabled: true,
        slidesPerView: 1.2,
        slidesOffsetBefore: 22, // Smaller padding for mobile
        slidesOffsetAfter: 22,
      },
      768: {
        enabled: true,
        slidesPerView: 2.2,
        slidesOffsetBefore: 20, // Larger padding for tablet
        slidesOffsetAfter: 20,
      },
      992: {
        enabled: false,
      },
    },

    on: {
      init: function (swiper) {
        console.log('🎯 Swiper initialized with:', {
          activeIndex: swiper.activeIndex,
          slidesPerView: swiper.params.slidesPerView,
          currentBreakpoint: swiper.currentBreakpoint,
          enabled: swiper.enabled,
        })

        if (window.innerWidth >= 992) {
          console.log('🔒 Disabling Swiper on init (desktop)')
          swiper.disable()
        }
      },
      breakpoint: function (swiper, breakpoint) {
        console.log('📐 Breakpoint changed to:', breakpoint)
      },
    },
  })

  window.addEventListener('resize', () => {
    const width = window.innerWidth
    console.log('🔄 Window resized to:', width)

    if (width >= 992) {
      console.log('🔒 Disabling Swiper (desktop)')
      swiper.disable()
    } else {
      console.log('🔓 Enabling Swiper (mobile/tablet)')
      swiper.enable()
    }
  })

  // Log final Swiper state
  console.log('🏁 Final Swiper instance:', {
    initialized: swiper.initialized,
    enabled: swiper.enabled,
    params: swiper.params,
    slides: swiper.slides.length,
  })

  return swiper
}
