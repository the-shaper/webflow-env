import Swiper from 'swiper'
import {
  EffectCards,
  Navigation,
  Keyboard,
  EffectFade,
  Controller,
} from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-cards'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'

export default function initTestimonials() {
  const swiperElement = document.querySelector('.swiper.is-photos')
  if (!swiperElement) {
    console.warn('Testimonials: No .swiperelement found')
    return
  }

  console.log(
    'Safari check:',
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  )

  const nextButton = document.querySelector('.arrow.is-right.w-button')
  const prevButton = document.querySelector('.arrow.is-left.w-button')

  const photoSwiper = new Swiper('.swiper.is-photos', {
    modules: [EffectCards, Navigation, Keyboard, Controller],
    effect: 'cards',
    grabCursor: true,
    loop: true,
    loopedSlides: 3,
    slidesPerView: 'auto',
    speed: 300,
    cardsEffect: {
      slideShadows: true,
      rotate: true,
      perSlideOffset: 6,
      perSlideRotate: 6,
    },
    simulateTouch: true,
    touchEventsTarget: 'container',
    keyboard: {
      enabled: true,
    },
    navigation: {
      nextEl: nextButton,
      prevEl: prevButton,
    },
    on: {
      slideChange: function () {
        console.log('Photo swiper slide changed:', this.activeIndex)
      },
    },
  })

  const contentSwiper = new Swiper('.swiper.is-content', {
    modules: [EffectCards, Navigation, Keyboard, EffectFade, Controller],
    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },
    followFinger: false,
    grabCursor: true,
    loop: true,
    loopedSlides: 3,
    slidesPerView: 1,
    speed: 300,
    observer: true,
    observeParents: true,
    observeSlideChildren: true,
    watchSlidesProgress: true,
    on: {
      slideChange: function () {
        console.log('Content swiper slide changed:', this.activeIndex)
      },
    },
  })

  // Replace the simple one-way control with two-way binding
  photoSwiper.controller.control = contentSwiper
  contentSwiper.controller.control = photoSwiper

  console.log('Two-way controller initialized:', {
    photoSwiper: photoSwiper.controller,
    contentSwiper: contentSwiper.controller,
  })

  // Add controller event debugging
  photoSwiper.on('controllerChange', () => {
    console.log('Photo swiper controller change')
  })

  contentSwiper.on('controllerChange', () => {
    console.log('Content swiper controller change')
  })

  return { photoSwiper, contentSwiper }
}
