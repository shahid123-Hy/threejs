import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import { computeMorphedAttributes } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { gsap } from 'gsap/gsap-core';
import LocomotiveScroll from 'locomotive-scroll';

const locomotiveScroll = new LocomotiveScroll();



// === Scene ===
const scene = new THREE.Scene();

// === Camera ===
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 4;

// === Renderer ===
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('canvas'),
  antialias: true,
  alpha: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputColorSpace = THREE.SRGBColorSpace;

// === OrbitControls ===
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;

// === PMREM Generator for HDR ===
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

// === Load HDRI Environment ===
new RGBELoader().load(
  'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/pond_bridge_night_1k.hdr',
  (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    // scene.background = texture;
    renderer.toneMappingExposure = 1.0;
  }
);

let model;

// === Load GLTF Model ===
const loader = new GLTFLoader();
loader.load(
  '/model/DamagedHelmet.gltf',
  (gltf) => {
    model = gltf.scene;
    scene.add(model);
  },
  undefined,
  (error) => {
    console.log('Error loading GLTF model:', error);
  }
);

// === Postprocessing Setup ===
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.uniforms['amount'].value = 0.0020; // adjust intensity
composer.addPass(rgbShiftPass);


window.addEventListener('mousemove',(e)=>{
  if(model){
    const rotationX = (e.clientX / window.innerWidth - .5) * (Math.PI * .12);
    const rotationY = (e.clientY / window.innerHeight - .5) * (Math.PI * .12);
    gsap.to(model.rotation,{
      x: rotationY,
      y: rotationX,
      duration: 0.5,
      ease: "power2.out"
    });

  }
})



  

// === Animate Loop ===
function animate() {
  requestAnimationFrame(animate);
  // controls.update();
  composer.render();
}
animate();

// === Resize Handling ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

document.getElementById('form').addEventListener('submit', async function (event) {
  event.preventDefault();
  const form = this;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  const responseE1 = document.getElementById('response');
  const submitbtn = form.querySelector('button[type="submit"]');

  submitbtn.disabled = true;
  responseE1.textContent = 'submitting...'

  console.log('Sending data to backend:', data);

  try {
    const response = await fetch('https://threejs-backend-baoa.onrender.com/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });


    const result = await response.json();
    if (!response.ok) {
      // If backend returns an error status, get the error message
      responseE1.textContent = `Error: ${errorData.error || 'Unknown error'}`;
      return;
    }



    // Show a success message — customize based on your backend response structure
    responseE1.textContent = 'Form submitted successfully!';
    form.reset();

  } catch (error) {
    
    responseE1.textContent = 'network error. Please try again.';
  } finally{
    submitbtn.disabled = false;
  }
});




