import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Orbit Controls for Interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Central "Sun" Object
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700 });
const sun = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), sunMaterial);
scene.add(sun);

// Geometric Shapes as "Planets"
const geometryOptions = [
  {
    geometry: new THREE.BoxGeometry(),
    color: 0x44aa88,
    orbitRadius: 2,
    speed: 0.01,
    name: "Cube",
  },
  {
    geometry: new THREE.SphereGeometry(0.5, 32, 32),
    color: 0xaa8844,
    orbitRadius: 3,
    speed: 0.008,
    name: "Sphere",
  },
  {
    geometry: new THREE.ConeGeometry(0.5, 1, 32),
    color: 0x8844aa,
    orbitRadius: 4,
    speed: 0.006,
    name: "Cone",
  },
  {
    geometry: new THREE.TorusGeometry(0.5, 0.2, 32, 64),
    color: 0xaa4444,
    orbitRadius: 5,
    speed: 0.005,
    name: "Torus",
  },
];

const shapes = geometryOptions.map((opt) => {
  const material = new THREE.MeshBasicMaterial({
    color: opt.color,
    wireframe: true,
  });
  const shape = new THREE.Mesh(opt.geometry, material);
  shape.userData = {
    name: opt.name,
    orbitRadius: opt.orbitRadius,
    speed: opt.speed,
    angle: Math.random() * Math.PI * 2,
  };
  scene.add(shape);
  return shape;
});

// Lighting
const light = new THREE.PointLight(0xffffff, 2, 100);
light.position.set(0, 0, 0); // Light from the sun
scene.add(light);

// Positioning the Camera
camera.position.set(0, 6, 10);
camera.lookAt(0, 0, 0);

// Resize Handling
const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener("resize", onWindowResize);

// Raycaster for Hover Detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// HTML Tooltip for Hovered Shape Name
const tooltip = document.createElement("div");
tooltip.style.position = "absolute";
tooltip.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
tooltip.style.color = "white";
tooltip.style.padding = "5px";
tooltip.style.display = "none";
tooltip.style.borderRadius = "5px";
tooltip.style.pointerEvents = "none";
document.body.appendChild(tooltip);

// Handle Mouse Movement for Hover
window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(shapes);

  if (intersects.length > 0) {
    const hoveredShape = intersects[0].object;
    tooltip.textContent = hoveredShape.userData.name;
    tooltip.style.left = `${event.clientX + 10}px`;
    tooltip.style.top = `${event.clientY + 10}px`;
    tooltip.style.display = "block";
  } else {
    tooltip.style.display = "none";
  }
});

// Animation Loop
const animate = () => {
  requestAnimationFrame(animate);

  // Orbit the shapes around the sun
  shapes.forEach((shape) => {
    shape.userData.angle += shape.userData.speed; // Increment angle
    shape.position.x =
      Math.cos(shape.userData.angle) * shape.userData.orbitRadius;
    shape.position.z =
      Math.sin(shape.userData.angle) * shape.userData.orbitRadius;
    shape.rotation.x += 0.01; // Rotate the shape itself
    shape.rotation.y += 0.01;
  });

  // Update controls
  controls.update();

  renderer.render(scene, camera);
};

animate();
