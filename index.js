const THREE = window.THREE;

var SEPARATION = 100, AMOUNTX = 50, AMOUNTY = 50;

var container;

var particles, particle, count = 0;

var mouseX = 400, mouseY = -42;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

const scene = new THREE.Scene();
const renderer = new THREE.CanvasRenderer();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);

const xMesh = appendImage('./x.png');
scene.add(xMesh);

init();
animate();

function init() {
  container = document.createElement('div');
  document.body.appendChild(container);
  camera.position.z = 1000;
  particles = new Array();

  var PI2 = Math.PI * 2;
  var material = new THREE.SpriteCanvasMaterial({
    color: 0x00FFF5,
    program: function (context) {
      context.beginPath();
      context.arc(0, 0, 0.5, 0, PI2, true);
      context.fill();
    }
  });

  var i = 0;
  for (var ix = 0; ix < AMOUNTX; ix++) {
    for (var iy = 0; iy < AMOUNTY; iy++) {
      particle = particles[i++] = new THREE.Sprite(material);
      particle.position.x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
      particle.position.z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
      scene.add(particle);
      if (i === 49) {
        xMesh.position.x = particle.position.x;
        xMesh.position.z = particle.position.z;
      }
    }
  }

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

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
  camera.position.y += (- mouseY - camera.position.y) * .05;
  camera.lookAt(scene.position);

  var i = 0;
  for (var ix = 0; ix < AMOUNTX; ix++) {
    for (var iy = 0; iy < AMOUNTY; iy++) {
      particle = particles[i++];
      particle.position.y = (Math.sin((ix + count) * 0.3) * 50) +
        (Math.sin((iy + count) * 0.5) * 50);
      particle.scale.x = particle.scale.y = (Math.sin((ix + count) * 0.3) + 1) * 2 +
        (Math.sin((iy + count) * 0.5) + 1) * 2;
      if (i === 50) {
        xMesh.position.y = particle.position.y;
        xMesh.scale.x = particle.scale.x;
      }
    }
  }

  renderer.render(scene, camera);
  count += 0.1;
}

function appendImage(src) {
  var texture = new THREE.ImageUtils.loadTexture(src);
  var material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide
  });
  var gemoetry = new THREE.PlaneGeometry(50, 50, 1, 1);
  var mesh = new THREE.Mesh(gemoetry, material);
  return mesh;
}