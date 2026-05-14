/* dotted-surface.js — plain script, requires THREE to be loaded first */

function initDottedSurface(container) {
  if (!container || typeof THREE === 'undefined') return;

  var SEPARATION = 150;
  var AMOUNTX    = 40;
  var AMOUNTY    = 60;

  var w = container.offsetWidth  || 1200;
  var h = container.offsetHeight || 500;

  // Scene
  var scene = new THREE.Scene();

  // Camera — looking slightly downward toward the wave field
  var camera = new THREE.PerspectiveCamera(60, w / h, 1, 10000);
  camera.position.set(0, 355, 1220);
  camera.lookAt(0, 0, 0);

  // Renderer (transparent background so section bg shows through)
  var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);
  renderer.setClearColor(0x000000, 0);

  // Canvas — sit below the content but above the section background
  var canvas = renderer.domElement;
  canvas.style.position   = 'absolute';
  canvas.style.top        = '0';
  canvas.style.left       = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex     = '0';

  container.appendChild(canvas);

  // Build the point cloud
  var positions = [];
  var colors    = [];

  for (var ix = 0; ix < AMOUNTX; ix++) {
    for (var iy = 0; iy < AMOUNTY; iy++) {
      positions.push(
        ix * SEPARATION - (AMOUNTX * SEPARATION) / 2,
        0,
        iy * SEPARATION - (AMOUNTY * SEPARATION) / 2
      );
      // Pure white dots
      colors.push(1, 1, 1);
    }
  }

  var geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color',    new THREE.Float32BufferAttribute(colors,    3));

  var material = new THREE.PointsMaterial({
    size: 6,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    sizeAttenuation: true,
  });

  var points = new THREE.Points(geometry, material);
  scene.add(points);

  // Animation
  var count = 0;
  var rafId;

  function animate() {
    rafId = requestAnimationFrame(animate);

    var posAttr = geometry.attributes.position;
    var pos     = posAttr.array;
    var i = 0;

    for (var _ix = 0; _ix < AMOUNTX; _ix++) {
      for (var _iy = 0; _iy < AMOUNTY; _iy++) {
        pos[i * 3 + 1] =
          Math.sin((_ix + count) * 0.3) * 50 +
          Math.sin((_iy + count) * 0.5) * 50;
        i++;
      }
    }

    posAttr.needsUpdate = true;
    renderer.render(scene, camera);
    count += 0.1;
  }

  // Resize
  var ro = new ResizeObserver(function() {
    var nw = container.offsetWidth;
    var nh = container.offsetHeight;
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
    renderer.setSize(nw, nh);
  });
  ro.observe(container);

  animate();
}
