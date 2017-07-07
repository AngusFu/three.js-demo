import {
  $,
  THREE,
  windowHalfX,
  windowHalfY,
  toScreenCords,
  createSceneAndRenderer,
  initParticles,
  initThreeJS
} from "./common";

import { screenOneFlags } from "../config";
const screenOneFlagMap = initFlags(screenOneFlags);

const SEPARATION = 70;
const AMOUNTX = 50;
const AMOUNTY = 60;

let count = 0;
let mouseX = 85;
let mouseY = -420;

const { scene, renderer } = createSceneAndRenderer();
const camera = new THREE.PerspectiveCamera(
  120,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
camera.position.z = 800;

const { particles, pointsWithFlag } = initParticles({
  scene,
  amountX: AMOUNTX,
  amontY: AMOUNTY,
  sep: SEPARATION,
  markPoint: (i, j, particle, marked) => {
    if (`${i}x${j}` in screenOneFlagMap) {
      const { x, z } = particle.position;
      marked.push({ x, z });
    }
  }
});

export default initThreeJS({
  render,
  camera,
  renderer,
  container: $("#three-js-screen-1")
});

function render() {
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  let i = 0;
  let j = 0;
  const ratio = windowHalfY / 250;

  for (let ix = 0; ix < AMOUNTX; ix++) {
    for (let iy = 0; iy < AMOUNTY; iy++) {
      const particle = particles[i++];
      particle.position.y =
        Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) * 50;
      particle.scale.x = particle.scale.y =
        (Math.sin((ix + count) * 0.3) + 1) * 1.4 +
        (Math.sin((iy + count) * 0.5) + 1) * 1.4;

      if (screenOneFlagMap[`${ix}x${iy}`]) {
        const point = pointsWithFlag[j++];
        point.y = particle.position.y;

        const { style, mins, maxs } = screenOneFlagMap[`${ix}x${iy}`];
        const { x, y } = toScreenCords(point, camera);

        const scale =
          Math.min(Math.max(particle.scale.x / 6 * maxs, mins), maxs) +
          particle.scale.x / 30;
        style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale * ratio })`;
      }
    }
  }

  renderer.render(scene, camera);
  count += 0.1;
}

function initFlags(flags) {
  const ret = flags.map(flag => {
    const { cn, en, mins, maxs } = flag;
    const div = document.createElement("div");

    div.className = "flag-1";
    div.innerHTML = `<p>${en}</p><h2>${cn}</h2>`;
    $("#three-js-screen-1").appendChild(div);

    return {
      style: div.style,
      mins,
      maxs
    };
  });

  return flags.reduce((acc, f, i) => {
    acc[f.cord] = ret[i];
    return acc;
  }, {});
}
