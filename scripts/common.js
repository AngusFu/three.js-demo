import requestAnimationFrame from "raf";
import "./CanvasRenderer";
import "./Projector";

const callbacksOnResize = [];

export const THREE = window.THREE;
export { requestAnimationFrame };

export let windowHalfX = window.innerWidth / 2;
export let windowHalfY = window.innerHeight / 2;

export function toArray(arrLike) {
  return Array.prototype.slice.call(arrLike);
}
export function $(selector) {
  return document.querySelector(selector);
}
export function $$(selector) {
  return toArray(document.querySelectorAll(selector));
}

/**
 * transform point in Three.js world to client
 */
export function toScreenCords({ x, y, z }, camera) {
  const vector = new THREE.Vector3(x, y, z).project(camera);
  return {
    x: Math.round(windowHalfX * (1 + vector.x)),
    y: Math.round(windowHalfY * (1 - vector.y))
  };
}

/**
 * add updating function that will be invoked window resize
 */
export function bindResizeCallback(camera, renderer) {
  const update = function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  callbacksOnResize.push(update);
}

window.addEventListener("resize", function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  callbacksOnResize.forEach(fn => fn());
});

/**
 * Axis helper
 */
export function addAxisHelper(scene) {
  const axisHelper = new THREE.AxisHelper(1000000);
  axisHelper.position.set(0, 0, 0);
  scene.add(axisHelper);
}

/**
 * create scene & renderer
 */
export function createSceneAndRenderer() {
  const scene = new THREE.Scene();
  const renderer = new THREE.CanvasRenderer({ alpha: true });
  renderer.setClearColor(0x000000, 1);
  return { scene, renderer };
}

/**
 * update stage
 */
export function animate(render) {
  function animate() {
    requestAnimationFrame(animate);
    render();
  }
  animate();
}

/**
 * initialize
 */
export function initThreeJS({ camera, renderer, container, render }) {
  bindResizeCallback(camera, renderer);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  animate(render);
}

/**
 * 波纹粒子
 */
export function initParticles({ scene, amountX, amontY, sep, markPoint }) {
  let index = 0;
  const particles = [];
  const pointsWithFlag = [];
  const material = new THREE.SpriteCanvasMaterial({
    color: 0x94fffb,
    program: function(context) {
      context.beginPath();
      context.arc(0, 0, 1, 0, Math.PI * 2, true);
      context.fill();
    }
  });

  for (let i = 0; i < amountX; i++) {
    for (let j = 0; j < amontY; j++) {
      const particle = new THREE.Sprite(material);
      particle.position.x = i * sep - amountX * sep / 2;
      particle.position.z = j * sep - amontY * sep / 2;
      particles[index++] = particle;

      scene.add(particle);
      markPoint && markPoint(i, j, particle, pointsWithFlag);
    }
  }
  return {
    particles,
    pointsWithFlag
  };
}
