import './styles/swiper.min.css';
import './styles/style.css';

import './scripts/screen-1';
import './scripts/screen-2';
import './scripts/screen-3';

new window.Swiper ('.swiper-container', {
  loop: true,
  autoplay: true,
  speed: 1000,
  autoplayDisableOnInteraction: false
});
