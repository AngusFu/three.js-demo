const THREE = window.THREE;

var SEPARATION = 100, AMOUNTX = 50, AMOUNTY = 50;

var container;
var camera, scene, renderer;

var particles, particle, count = 0;

var mouseX = 400, mouseY = -42;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {
  container = document.createElement('div');
  document.body.appendChild(container);
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 1000;
  scene = new THREE.Scene();
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
    }
  }

  var sceneGeometry = new THREE.Geometry();
  var sceneMesh = new THREE.Mesh();
  var loader = new THREE.FontLoader();

  loader.load('./scripts/font.json', function (font) {
    function createText(text, x) {
      var textGeo = new THREE.TextGeometry(text, {
        size: 30,
        font
      });
      textGeo.computeBoundingBox();
      textGeo.computeVertexNormals();
      var textMesh = new THREE.Mesh(textGeo, [
        new THREE.MeshPhongMaterial({
          color: 0xffffff,
          shading: THREE.FlatShading
        })
      ]);
      textMesh.position.x = x;
      textMesh.position.y = 1;
      textMesh.position.z = 1;
      return textMesh;
    }

    for (var i = 0; i < 10; i++) {
      var textMesh = createText('0床前明月光疑是地上霜'[i],
        i * 200
      );
      textMesh.updateMatrix();
      sceneGeometry.merge(
        textMesh.geometry,
        textMesh.matrix,
        0
      );
    }
    sceneMesh = new THREE.Mesh(sceneGeometry, new THREE.MeshFaceMaterial([material]));
    scene.add(sceneMesh);
  });


  renderer = new THREE.CanvasRenderer();
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
    }
  }

  renderer.render(scene, camera);
  count += 0.1;
}
