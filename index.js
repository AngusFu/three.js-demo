import './styles/swiper.min.css';
import './styles/style.css';

import { $$ } from './scripts/common';
import slide1 from './scripts/screen-1';
import slide2 from './scripts/screen-2';
import slide3 from './scripts/screen-3';

const slides = [slide1, slide2, slide3];
new window.Swiper ('.swiper-container', {
  loop: false,
  // autoplay: true,
  speed: 1000,
  autoplayDisableOnInteraction: false,
  onSlideChangeStart(swiper) {
    console.log(22222)
    slides.forEach((slide, i) => {
      if (i === swiper.activeIndex) {
        slide.play();
      } else {
        slide.pause();
      }
    })
  }
});

const setScale = () => {
  const s = Math.max(window.innerWidth, 992) / 1920;
  const css = `transform-origin:center;transform:scale(${s})`;
  $$('.text-band').forEach((el) => {
    el.style.cssText = css;
  });
  $$('.honor-bands>div').forEach((el) => {
    el.style.cssText = `transform-origin:center;transform:translate(-50%,-50%) scale(${s}) ;`;
  });
};
setScale();
window.addEventListener("resize", setScale);
