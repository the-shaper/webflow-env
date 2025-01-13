// Core imports - centralize all shared Swiper imports here
import { Navigation, Pagination } from 'swiper/modules'

// Core styles - centralize all shared Swiper styles here
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// Export modules for reuse
export const CoreModules = { Navigation, Pagination }

// Common utility functions
export function createBaseSwiperConfig(options = {}) {
  return {
    modules: [Navigation, Pagination],
    grabCursor: true,
    keyboard: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    ...options,
  }
}

// Common error handling
export function validateSwiperElement(selector, context = '') {
  const element = document.querySelector(selector)
  if (!element) {
    console.warn(`${context}: No element found for selector "${selector}"`)
    return false
  }
  return true
}
