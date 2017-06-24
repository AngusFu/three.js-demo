import {
  $,
  THREE,
  windowHalfX,
  windowHalfY,
  createSceneAndRenderer,
  initParticles,
  initThreeJS
} from "./common";

import { screenOneFlags } from "../config";

const SEPARATION = 70;
const AMOUNTX = 50;
const AMOUNTY = 60;

let count = 0;
let mouseX = 885;
let mouseY = -359;

const { scene, renderer } = createSceneAndRenderer();
const camera = new THREE.PerspectiveCamera(
  120,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
camera.position.z = 500;

const { particles } = initParticles({
  scene,
  amountX: AMOUNTX,
  amontY: AMOUNTY,
  sep: SEPARATION
});

export default initThreeJS({
  render,
  camera,
  renderer,
  container: $("#three-js-screen-2")
});

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
    }
  }
  renderer.render(scene, camera);
  count += 0.1;
}
