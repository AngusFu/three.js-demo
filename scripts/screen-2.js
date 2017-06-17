import requestAnimationFrame from 'raf';
import now from 'performance-now';
import {
  screenOneFlags
} from '../config';
const THREE = window.THREE;

const SEPARATION = 70;
const AMOUNTX = 50;
const AMOUNTY = 60;

let count = 0;
let mouseX = 885;
let mouseY = -359;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

const container = document.getElementById('three-js-screen-2');
// const screenOneFlagStyles = screenOneFlags.map(f => {
//   const {
//     cn,
//     en,
//     mins,
//     maxs
//   } = f;
//   const div = document.createElement('div');
//   div.className = 'flag-1';
//   div.innerHTML = `<p>${en}</p><h2>${cn}</h2>`;
//   container.appendChild(div);
//   return {
//     style: div.style,
//     mins,
//     maxs
//   };
// });

const scene = new THREE.Scene();
const renderer = new THREE.CanvasRenderer({ alpha: true });
renderer.setClearColor( 0x000000, 1 );
const camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.z = 500;

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
