import Swiper from 'swiper'
import { Keyboard, Autoplay } from 'swiper/modules'

import 'swiper/css'

export default function initTeamGallery() {
  const teamSwiper = new Swiper('.swiper.team-names', {
    modules: [Keyboard, Autoplay],
    grabCursor: true,
    centeredSlides: true,
    initialSlide: 1,
    spaceBetween: 30,
    loop: false,
    slidesPerView: 3,
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 3,
      },
    },
    keyboard: {
      enabled: true,
      onlyInViewport: false,
    },
    autoplay: {
      delay: 5000,
      pauseOnMouseEnter: true,
    },
    speed: 800,
    slideActiveClass: 'swiper-slide-active',
    watchOverflow: true,
    allowTouchMove: true,
    resistance: true,
    resistanceRatio: 0.85,
    slideToClickedSlide: true,
    on: {
      init: function (swiper) {
        console.log('✅ Carousel initialized:', {
          totalSlides: swiper.slides.length,
          activeIndex: swiper.activeIndex,
        })
      },
    },
  })

  return teamSwiper
}
