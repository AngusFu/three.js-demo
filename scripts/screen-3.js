import {
  $,
  toArray,
  THREE,
  windowHalfX,
  windowHalfY,
  createSceneAndRenderer,
  initParticles,
  initThreeJS,
  toScreenCords
} from "./common";
import { logoBgColorMatrix } from "../config";

import { screenThreeFlags } from '../config';
const screenThreeFlagMap = initFlags(screenThreeFlags);
const screenDOM = $("#three-js-screen-3");

const SEPARATION = 70;
const AMOUNTX = 60;
const AMOUNTY = 50;

let count = 0;
let mouseX = -28;
let mouseY = -450;

const { scene, renderer } = createSceneAndRenderer();
const camera = new THREE.PerspectiveCamera(
  120,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
camera.position.z = 800;
renderer.setClearColor(0x000000, .6);

const { particles, pointsWithFlag } = initParticles({
  scene,
  amountX: AMOUNTX,
  amontY: AMOUNTY,
  sep: SEPARATION,
  markPoint:(i, j, particle, marked) => {
    if (`${i}x${j}` in screenThreeFlagMap) {
      const { x, z } = particle.position;
      marked.push({ x, z });
    }
  }
});

const logoWallCtrl = initLogoWall();

const waveCtrl = initThreeJS({
  render,
  camera,
  renderer,
  container: screenDOM
});

export default {
  play() {
    logoWallCtrl.play();
    waveCtrl.play();
  },
  pause() {
    logoWallCtrl.pause();
    waveCtrl.pause();
  }
};


function render() {
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  let i = 0;
  let j = 0;
  for (let ix = 0; ix < AMOUNTX; ix++) {
    for (let iy = 0; iy < AMOUNTY; iy++) {
      const particle = particles[i++];
      particle.position.y =
        Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) * 50;
      particle.scale.x = particle.scale.y =
        (Math.sin((ix + count) * 0.3) + 1) * 1.4 +
        (Math.sin((iy + count) * 0.5) + 1) * 1.4;
  
      if (screenThreeFlagMap[`${ix}x${iy}`]) {
        const point = pointsWithFlag[j++];
        point.y = particle.position.y;

        const {
          style,
          mins,
          maxs
        } = screenThreeFlagMap[`${ix}x${iy}`];
        const {
          x,
          y
        } = toScreenCords(point, camera);
        const scale = Math.min(
          Math.max(
            particle.scale.x / 6 * maxs,
            mins
          ),
          maxs
        ) + particle.scale.x / 30;
        style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      }

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

  let stop = false;
  ; (function runFlipHighlight() {
    stop || highlightFlips();
    setTimeout(runFlipHighlight, Math.random() * 2000 + 2000);
  }());

  return {
    play() {
      stop = false;
    },
    pause() {
      stop = true;
    }
  };
}

// document.addEventListener("mousemove", onDocumentMouseMove, false);
// function onDocumentMouseMove(event) {
//   mouseX = event.clientX - windowHalfX;
//   mouseY = event.clientY - windowHalfY;
//   console.log(mouseX, mouseY);
// }

function initFlags(flags) {
  const ret = flags.map(flag => {
    const { logo, mins, maxs } = flag;
    const div = document.createElement('div');

    div.className = 'flag-3';
    div.innerHTML = `<img src="${logo}"><i></i>`;
    $('#three-js-screen-3').appendChild(div);

    return {
      style: div.style,
      mins,
      maxs
    };
  });

  return flags.reduce((acc, f, i) => {
    acc[f.cord] = ret[i]
    return acc;
  }, {});
}
