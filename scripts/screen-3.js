import requestAnimationFrame from 'raf';
import now from 'performance-now';
import {
  screenOneFlags,
  logoBgColorMatrix
} from '../config';
const THREE = window.THREE;
const container = document.getElementById('three-js-screen-3');

const logoFlips = [].slice.call(container.querySelectorAll('.logo-flip'));
logoFlips.forEach((el, i) => {
  const color = logoBgColorMatrix[i];
  el.style.backgroundColor = `rgb(${color},${color},${color})`;
});

(function runFlipHighlight() {
  highlightFlips();
  setTimeout(runFlipHighlight, Math.random() * 5000 + 2000);
}());
function highlightFlips() {
  [].slice.call(container.querySelectorAll('.hlight')).forEach(el => el.classList.remove('hlight'));
  // 随机两个高亮
  // 保证左侧四列和右侧四列都有
  // 且两者不在一行
  // 第四行容易被遮住 所以降低概率
  const getColNum = () => Math.random() > 0.2 ? (Math.random() * 3 | 0) : 3;
  const colIndexes = (() => {
    const cols = [getColNum(), getColNum()];
    while (cols[0] === cols[1]) {
      cols[1] = getColNum();
    }
    return cols;
  })();
  const indexes = [
    7 * colIndexes[0] + (Math.random() * 4 | 0),
    7 * colIndexes[1] + (4 + Math.random() * 3 | 0)
  ];
  indexes.forEach(index => {
    logoFlips[index].classList.add('hlight');
  });
}

const SEPARATION = 70;
const AMOUNTX = 60;
const AMOUNTY = 24;

let count = 0;
let mouseX = 885;
let mouseY = -359;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

const scene = new THREE.Scene();
const renderer = new THREE.CanvasRenderer({ alpha: true });
renderer.setClearColor( 0x000000, 0 );
const camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.z = 0;

const {
  particles,
  pointsWithFlag
} = initParticles();
particles.forEach(p => scene.add(p));

/**
 * Axis helper
 */
// const axisHelper = new THREE.AxisHelper(1000000);
// axisHelper.position.set(0, 0, 0);
// scene.add(axisHelper);

init();

function init() {
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  animate();

  window.addEventListener('resize', function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, false);

  
	// window.addEventListener('mousemove', function onDocumentMouseMove( event ) {
  //   mouseX = event.clientX - windowHalfX;
  //   mouseY = event.clientY - windowHalfY;
  //   console.log(mouseX, mouseY)
  // }, false);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

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

/**
 * 绘制并添加波纹粒子
 */
function initParticles() {
  let index = 0;
  const particles = [];
  const pointsWithFlag = [];
  const material = new THREE.SpriteCanvasMaterial({
    color: 0x94fffb,
    program: function (context) {
      context.beginPath();
      context.arc(0, 0, 1, 0, Math.PI * 2, true);
      context.fill();
    }
  });

  for (let i = 0; i < AMOUNTX; i++) {
    for (let j = 0; j < AMOUNTY; j++) {
      const particle = new THREE.Sprite(material);
      particle.position.x = i * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
      particle.position.z = j * SEPARATION - ((AMOUNTY * SEPARATION) / 2);

      particles[index++] = particle;
    }
  }
  return {
    particles,
    pointsWithFlag
  };
}

/**
 * 将 Three.js 中点的位置投射为屏幕位置
 */
function toScreenCords({
  x,
  y,
  z
}, camera) {
  const vector = (new THREE.Vector3(x, y, z)).project(camera);
  return {
    x: Math.round(windowHalfX * (1 + vector.x)),
    y: Math.round(windowHalfY * (1 - vector.y))
  };
}
