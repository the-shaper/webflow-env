import Swiper from 'swiper'
import { EffectCards } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-cards'

export default function initTestimonials() {
  const swiperElement = document.querySelector('.swiper.is-photos')
  if (!swiperElement) {
    console.warn('Testimonials: No .swiperelement found')
    return
  }

  // Force correct flex direction before initializing Swiper
  const wrapper = swiperElement.querySelector('.swiper-wrapper')
  if (wrapper) {
    console.log('Current flex-flow:', getComputedStyle(wrapper).flexFlow)
    wrapper.style.setProperty('flex-direction', 'row', 'important')
    wrapper.style.setProperty('flex-flow', 'row', 'important')
    console.log('After override flex-flow:', getComputedStyle(wrapper).flexFlow)
  }

  const photoSwiper = new Swiper('.swiper.is-photos', {
    modules: [EffectCards],
    effect: 'cards',
    grabCursor: true,
    cardsEffect: {
      slideShadows: true,
      rotate: true,
      perSlideOffset: 8,
      perSlideRotate: 2,
    },
    simulateTouch: true,
    touchEventsTarget: 'container',
  })

  return photoSwiper
}
