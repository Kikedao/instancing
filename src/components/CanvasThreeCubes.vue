<template>
  <div class="three-container" ref="container">
    <button class="back-button" @click="goHome">Back to Home</button>
    <!-- Stats.js panel will be appended here -->
    <div ref="statsContainer"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'stats.js';
import GUI from 'lil-gui';

export default defineComponent({
  name: 'ThreeCubes',
  setup() {
    const container = ref<HTMLDivElement | null>(null);
    const statsContainer = ref<HTMLDivElement | null>(null);
    const router = useRouter();

    let animationId: number;
    let stats: Stats;
    let gui: GUI;
    let controls: OrbitControls;

    // Configuration options for the scene.
    const config = {
      cubeCount: 10,       // Starting number of cubes.
      rotationSpeed: 0.0, // Radians per frame.
      cubeSize: 1,         // Cube edge length.
    };

    // Array to hold the cube meshes.
    let cubes: THREE.Mesh[] = [];

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;

    // Create or remove cubes to match config.cubeCount.
    const updateCubes = () => {
      // Add cubes if needed.
      while (cubes.length < config.cubeCount) {
        const geometry = new THREE.BoxGeometry(config.cubeSize, config.cubeSize, config.cubeSize);
        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(Math.random(), Math.random(), Math.random()),
        });
        const cube = new THREE.Mesh(geometry, material);
        // Enable shadows on the cube.
        cube.castShadow = true;
        cube.receiveShadow = true;
        // Place the cube at a random position with double the spread.
        cube.position.set(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        );
        scene.add(cube);
        cubes.push(cube);
      }
      // Remove extra cubes if needed.
      while (cubes.length > config.cubeCount) {
        const cube = cubes.pop();
        if (cube) {
          scene.remove(cube);
          cube.geometry.dispose();
          if (Array.isArray(cube.material)) {
            cube.material.forEach(mat => mat.dispose());
          } else {
            cube.material.dispose();
          }
        }
      }
    };

    // Render loop: animate cube rotation and render the scene.
    const renderLoop = () => {
      stats.begin();
      if(config.rotationSpeed > 0){
        for (let i = 0; i < cubes.length; i++) {
          cubes[i].rotation.x += config.rotationSpeed;
          cubes[i].rotation.y += config.rotationSpeed;
        }
      }
      // Update orbit controls.
      controls.update();
      renderer.render(scene, camera);
      stats.end();
      animationId = requestAnimationFrame(renderLoop);
    };

    // Update camera and renderer on window resize.
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    onMounted(() => {
      // Set up the scene.
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x121212);
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      // Enable shadows in the renderer.
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      if (container.value) {
        container.value.appendChild(renderer.domElement);
      }

      // Add OrbitControls.
      controls = new OrbitControls(camera, renderer.domElement);
      controls.autoRotate = true;
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;

      // Add lighting.
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(5, 10, 5);
      directionalLight.castShadow = true;
      // Adjust shadow camera properties.
      directionalLight.shadow.camera.left = -20;
      directionalLight.shadow.camera.right = 20;
      directionalLight.shadow.camera.top = 20;
      directionalLight.shadow.camera.bottom = -20;
      directionalLight.shadow.mapSize.width = 1024;
      directionalLight.shadow.mapSize.height = 1024;
      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = 50;
      scene.add(directionalLight);

      // Initialize stats.js.
      stats = new Stats();
      stats.dom.id = "performance-stats";
      stats.showPanel(0);
      if (statsContainer.value) {
        statsContainer.value.appendChild(stats.dom);
      }

      // Set up lil-gui for interactive controls.
      gui = new GUI();
      gui.add(config, 'cubeCount', 1, 10000, 1).onFinishChange(() => {
        updateCubes();
      });
      gui.add(config, 'rotationSpeed', 0, 0.1, 0.001);

      // Create the initial cubes.
      updateCubes();

      // Start the animation loop.
      renderLoop();

      window.addEventListener('resize', onWindowResize, false);
    });

    onBeforeUnmount(() => {
      cancelAnimationFrame(animationId);
      gui.destroy();
      window.removeEventListener('resize', onWindowResize);
      controls.dispose();
      renderer.dispose();
    });

    const goHome = () => {
      router.push('/');
    };

    return { container, statsContainer, goHome };
  },
});
</script>

<style scoped>
.three-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #121212;
  overflow: hidden;
}

.back-button {
    position: absolute;
    top: initial;
    bottom: 20px;
    right: 20px;
    padding: 0.5rem 1rem;
    background-color: #2c2c2c;
    border: none;
    border-radius: 4px;
    color: #fff;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    z-index: 10;
    transition: background-color 0.3s ease;
  }

.back-button:hover {
  background-color: #3c3c3c;
}

#performance-stats {
  right: initial !important;
  top: initial !important;
  bottom: 0 !important;
  left: 0 !important;
}
</style>
