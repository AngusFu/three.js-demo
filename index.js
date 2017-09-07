import './styles/swiper.min.css';
import './styles/style.css';

import { $, $$ } from './scripts/common';
import slide1 from './scripts/screen-1';
import slide2 from './scripts/screen-2';
import slide3 from './scripts/screen-3';

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

const slidesMap = { slide1, slide2, slide3 };

setTimeout(() => {
  $('.swiper-container').classList.remove('loading');
  const screens = [].slice.call(document.querySelectorAll('.swiper-wrapper > div'))
  new window.Swiper ('.swiper-container', {
    loop: false,
    autoplay: true,
    speed: 1000,
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    autoplayDisableOnInteraction: false,
    onSlideChangeStart(swiper) {
      const idIndex = screens[swiper.activeIndex].id.replace(/[^\d]/g, '')
      const id = 'slide' + idIndex
      Object.keys(slidesMap).map((key) => {
        if (key === id) {
          slidesMap[key].play();
        } else {
          slidesMap[key].pause();
        }
      })
    }
  });
}, 1000);
