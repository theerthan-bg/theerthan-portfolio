/**
 * Interactive 3D WebGL Scene for Theerthan B G's Portfolio
 * Powered by Three.js
 */

(function () {
  const container = document.getElementById('hero-3d-canvas-container');
  if (!container) return;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 6.5;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  // Group for the 3D Holographic Core
  const coreGroup = new THREE.Group();
  scene.add(coreGroup);

  // 1. Outer Holographic Wireframe Icosahedron
  const icoGeometry = new THREE.IcosahedronGeometry(1.8, 1);
  const icoMaterial = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    wireframe: true,
    transparent: true,
    opacity: 0.65,
    roughness: 0.2,
    metalness: 0.9,
    emissive: 0x0891b2,
    emissiveIntensity: 0.4
  });
  const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
  coreGroup.add(icosahedron);

  // 2. Vertex Points on the Icosahedron for cyber-node effect
  const pointsMaterial = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 0.08,
    transparent: true,
    opacity: 0.9
  });
  const vertexPoints = new THREE.Points(icoGeometry, pointsMaterial);
  coreGroup.add(vertexPoints);

  // 3. Inner Pulsating Crystal Core (Octahedron)
  const coreGeometry = new THREE.OctahedronGeometry(0.9, 0);
  const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x8b5cf6,
    emissive: 0x7c3aed,
    emissiveIntensity: 0.7,
    roughness: 0.1,
    metalness: 0.2,
    transmission: 0.8,
    ior: 1.5,
    transparent: true,
    opacity: 0.85
  });
  const innerCrystal = new THREE.Mesh(coreGeometry, coreMaterial);
  coreGroup.add(innerCrystal);

  // 4. Orbital Cyber Rings (Torus geometries)
  const ring1Geo = new THREE.TorusGeometry(2.3, 0.015, 16, 100);
  const ring1Mat = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    transparent: true,
    opacity: 0.5
  });
  const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
  ring1.rotation.x = Math.PI / 3;
  coreGroup.add(ring1);

  const ring2Geo = new THREE.TorusGeometry(2.6, 0.015, 16, 100);
  const ring2Mat = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
    transparent: true,
    opacity: 0.45
  });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.y = Math.PI / 4;
  ring2.rotation.x = -Math.PI / 6;
  coreGroup.add(ring2);

  const ring3Geo = new THREE.TorusGeometry(2.9, 0.01, 16, 100);
  const ring3Mat = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    transparent: true,
    opacity: 0.35
  });
  const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
  ring3.rotation.z = Math.PI / 4;
  coreGroup.add(ring3);

  // 5. Starfield & Cyber Dust Particles
  const particleCount = 750;
  const particlePositions = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);

  const cyan = new THREE.Color(0x06b6d4);
  const purple = new THREE.Color(0x8b5cf6);
  const emerald = new THREE.Color(0x10b981);

  for (let i = 0; i < particleCount; i++) {
    const r = 3 + Math.random() * 8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    particlePositions[i * 3 + 2] = r * Math.cos(phi);

    let col = cyan;
    const rand = Math.random();
    if (rand > 0.6) col = purple;
    else if (rand > 0.35) col = emerald;

    particleColors[i * 3] = col.r;
    particleColors[i * 3 + 1] = col.g;
    particleColors[i * 3 + 2] = col.b;
  }

  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  dustGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

  const dustMaterial = new THREE.PointsMaterial({
    size: 0.04,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  });

  const particleDust = new THREE.Points(dustGeometry, dustMaterial);
  scene.add(particleDust);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x06b6d4, 3, 10);
  pointLight1.position.set(3, 3, 3);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x8b5cf6, 3, 10);
  pointLight2.position.set(-3, -3, 2);
  scene.add(pointLight2);

  // Mouse Interactivity
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;
  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;

  function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.0015;
    mouseY = (event.clientY - windowHalfY) * 0.0015;
  }
  window.addEventListener('mousemove', onMouseMove, { passive: true });

  // Touch Support
  function onTouchMove(event) {
    if (event.touches.length > 0) {
      mouseX = (event.touches[0].clientX - windowHalfX) * 0.0015;
      mouseY = (event.touches[0].clientY - windowHalfY) * 0.0015;
    }
  }
  window.addEventListener('touchmove', onTouchMove, { passive: true });

  // Click pulse/burst effect
  let burstScale = 1;
  container.addEventListener('click', () => {
    burstScale = 1.35;
    if (window.soundManager) window.soundManager.playClick();
  });

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Smooth dampening towards target rotation
    targetRotationX += (mouseY - targetRotationX) * 0.05;
    targetRotationY += (mouseX - targetRotationY) * 0.05;

    coreGroup.rotation.x = targetRotationX + Math.sin(elapsedTime * 0.5) * 0.1;
    coreGroup.rotation.y += 0.008 + targetRotationY * 0.2;

    // Orbiting rings individual rotations
    ring1.rotation.z += 0.012;
    ring2.rotation.x -= 0.015;
    ring3.rotation.y += 0.01;

    // Pulsing inner crystal
    const pulse = 1 + Math.sin(elapsedTime * 3) * 0.1;
    innerCrystal.scale.set(pulse, pulse, pulse);
    innerCrystal.rotation.y -= 0.02;
    innerCrystal.rotation.z += 0.015;

    // Burst scale decay
    if (burstScale > 1) {
      burstScale += (1 - burstScale) * 0.08;
      icosahedron.scale.set(burstScale, burstScale, burstScale);
      vertexPoints.scale.set(burstScale, burstScale, burstScale);
    }

    // Slow ambient rotation of starfield dust
    particleDust.rotation.y = elapsedTime * 0.03;
    particleDust.rotation.x = elapsedTime * 0.015;

    renderer.render(scene, camera);
  }

  animate();

  // Resize Handler
  function onWindowResize() {
    if (!container) return;
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  window.addEventListener('resize', onWindowResize);
})();
