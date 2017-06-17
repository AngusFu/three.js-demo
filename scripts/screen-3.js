
import {
  $,
  toArray,
  THREE,
  windowHalfX,
  windowHalfY,
  createSceneAndRenderer,
  initParticles,
  initThreeJS
} from './common';
import { logoBgColorMatrix } from '../config';

const screenDOM = $('#three-js-screen-3');

const SEPARATION = 70;
const AMOUNTX = 60;
const AMOUNTY = 24;

let count = 0;
let mouseX = 885;
let mouseY = -359;

const { scene, renderer } = createSceneAndRenderer();
const camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.z = 0;

const { particles } = initParticles({
  scene,
  amountX: AMOUNTX,
  amontY: AMOUNTY,
  sep: SEPARATION
});

initLogoWall();
initThreeJS({
  render,
  camera,
  renderer,
  container: screenDOM
});

function render() {
  camera.position.x += (mouseX - camera.position.x) * .05;
  camera.position.y += (-mouseY - camera.position.y) * .05;
  camera.lookAt(scene.position);

  let i = 0;
  let j = 0;
  for (let ix = 0; ix < AMOUNTX; ix++) {
    for (let iy = 0; iy < AMOUNTY; iy++) {
      const particle = particles[i++];
      particle.position.y = (Math.sin((ix + count) * 0.3) * 50) + (Math.sin((iy + count) * 0.5) * 50);
      particle.scale.x = particle.scale.y = (Math.sin((ix + count) * 0.3) + 1) * 1.4 + (Math.sin((iy + count) * 0.5) + 1) * 1.4;
    }
  }

  renderer.render(scene, camera);
  count += 0.1;
}

function initLogoWall() {
  const queryWithSideEffect = function (sel, fn) {
    const arr = toArray(screenDOM.querySelectorAll(sel));
    return arr.map((el, i) => {
      fn && fn(el, i);
      return el;
    });
  };

  const logoFlips = queryWithSideEffect(
    '.logo-flip',
    (el, i) => {
      const color = logoBgColorMatrix[i];
      el.style.backgroundColor = `rgb(${color},${color},${color})`;
    }
  );

  const highlightFlips = function () {
    // remove highlight elems first
    queryWithSideEffect(
      '.hlight',
      el => el.classList.remove('hlight')
    );

    // 随机两个高亮
    // 保证左侧四列和右侧四列都有
    // 且两者不在一行
    // 第四行容易被遮住 所以降低概率
    const getColNum = () => {
      return Math.random() > 0.2 ? (Math.random() * 3 | 0) : 3;
    };

    const [first, second] = (() => {
      const cols = [getColNum(), getColNum()];

      while (cols[0] === cols[1]) {
        cols[1] = getColNum();
      }

      return [
        7 * cols[0] + (Math.random() * 4 | 0),
        7 * cols[1] + (Math.random() * 3 | 0) + 4
      ];
    })();

    logoFlips[first].classList.add('hlight');
    logoFlips[second].classList.add('hlight');
  }

  ;(function runFlipHighlight() {
    highlightFlips();
    setTimeout(runFlipHighlight, Math.random() * 5000 + 2000);
  }());
}
