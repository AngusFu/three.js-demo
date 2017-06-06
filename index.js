const THREE = window.THREE;
const div = document.getElementById('test');

const SEPARATION = 100;
const AMOUNTX = 30;
const AMOUNTY = 60;

let count = 0;
let mouseX = 85;
let mouseY = -342;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

const flagPosMap = {
  '14x39': 1
};

const {
  particles,
  pointsWithFlag
} = initParticles(); 

const scene = new THREE.Scene();
const renderer = new THREE.CanvasRenderer();
const camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.z = 1000;
particles.forEach(p => scene.add(p));

/**
 * Axis helper
 */
const axisHelper = new THREE.AxisHelper(1000000);
axisHelper.position.set(0, 0, 0);
scene.add(axisHelper);

init();

function init() {
  const container = document.createElement('div');
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  document.body.appendChild(container);
  animate();

  window.addEventListener('resize', function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, false);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  camera.position.x += (mouseX - camera.position.x) * .05;
  camera.position.y += (-mouseY - camera.position.y) * .05;
  camera.lookAt(scene.position);

  var i = 0;
  var j = 0;
  for (var ix = 0; ix < AMOUNTX; ix++) {
    for (var iy = 0; iy < AMOUNTY; iy++) {
      let particle = particles[i++];
      particle.position.y = (Math.sin((ix + count) * 0.3) * 50) + (Math.sin((iy + count) * 0.5) * 50);
      particle.scale.x = particle.scale.y = (Math.sin((ix + count) * 0.3) + 1) * 2 + (Math.sin((iy + count) * 0.5) + 1) * 2;

      if (`${ix}x${iy}` in flagPosMap) {
        var point = pointsWithFlag[j++];
        point.y = particle.position.y;
        const { x, y } = toScreenCords(point, camera);
        const scale = Math.min(Math.max(particle.scale.x / 4, .5), 2);
        div.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      }
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
      context.arc(0, 0, 0.6, 0, Math.PI * 2, true);
      context.fill();
    }
  });

  for (let i = 0; i < AMOUNTX; i++) {
    for (let j = 0; j < AMOUNTY; j++) {
      let particle = new THREE.Sprite(material);
      particle.position.x = i * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
      particle.position.z = j * SEPARATION - ((AMOUNTY * SEPARATION) / 2);

      particles[index++] = particle;
      // scene.add(particle);

      if (`${i}x${j}` in flagPosMap) {
        const { x, z } = particle.position;
        pointsWithFlag.push({ x, z });
      }
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
  var vector = (new THREE.Vector3(x, y, z)).project(camera);
  return {
    x: Math.round(windowHalfX * (1 + vector.x)),
    y: Math.round(windowHalfY * (1 - vector.y))
  };
}

/*function appendImage(src) {
  var texture = new THREE.TextureLoader(src);
  var material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide
  });
  var gemoetry = new THREE.PlaneGeometry(50, 50, 1, 1);
  var mesh = new THREE.Mesh(gemoetry, material);
  return mesh;
}*/
