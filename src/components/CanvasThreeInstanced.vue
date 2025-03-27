<template>
  <div class="three-container" ref="container">
    <button class="back-button" @click="goHome">Back to Home</button>
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

interface InstanceData {
  position: THREE.Vector3;
  rotation: THREE.Euler;
}

export default defineComponent({
  name: 'ThreeInstancedCubes',
  setup() {
    const container = ref<HTMLDivElement | null>(null);
    const statsContainer = ref<HTMLDivElement | null>(null);
    const router = useRouter();

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;
    let stats: Stats;
    let gui: GUI;
    let animationId: number;

    const config = {
      cubeCount: 10,
      rotationSpeed: 0.0,
      cubeSize: 1,
    };

    let cubeCount = 10;

    let instanceData: InstanceData[] = [];
    let instancedMesh: THREE.InstancedMesh;
    const tempObject = new THREE.Object3D();

    const createInstancedMesh = () => {
      cubeCount = config.cubeCount;

      if (instancedMesh) {
        scene.remove(instancedMesh);
        instancedMesh.geometry.dispose();
        if (Array.isArray(instancedMesh.material)) {
          instancedMesh.material.forEach(mat => mat.dispose());
        } else {
          instancedMesh.material.dispose();
        }
      }

      instanceData = [];
      const geometry = new THREE.BoxGeometry(config.cubeSize, config.cubeSize, config.cubeSize);
      const material = new THREE.MeshStandardMaterial({ vertexColors: true });

      instancedMesh = new THREE.InstancedMesh(geometry, material, config.cubeCount);
      instancedMesh.castShadow = true;
      instancedMesh.receiveShadow = true;

      for (let i = 0; i < config.cubeCount; i++) {
        const pos = new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        );
        const rot = new THREE.Euler(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          0
        );
        instanceData.push({ position: pos, rotation: rot });

        const color = new THREE.Color(Math.random(), Math.random(), Math.random());
        instancedMesh.setColorAt(i, color);

        tempObject.position.copy(pos);
        tempObject.rotation.copy(rot);
        tempObject.updateMatrix();
        instancedMesh.setMatrixAt(i, tempObject.matrix);
      }

      instancedMesh.instanceMatrix.needsUpdate = true;
      instancedMesh.instanceColor!.needsUpdate = true;
      scene.add(instancedMesh);
    };

    const renderLoop = () => {
      stats.begin();
      if(config.rotationSpeed > 0){
        for (let i = 0; i < cubeCount; i++) {
          instanceData[i].rotation.x += config.rotationSpeed;
          instanceData[i].rotation.y += config.rotationSpeed;
          tempObject.position.copy(instanceData[i].position);
          tempObject.rotation.copy(instanceData[i].rotation);
          tempObject.updateMatrix();
          instancedMesh.setMatrixAt(i, tempObject.matrix);
        }
        instancedMesh.instanceMatrix.needsUpdate = true;
      }
      controls.update();
      renderer.render(scene, camera);
      stats.end();
      animationId = requestAnimationFrame(renderLoop);
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    onMounted(() => {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x121212);
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.value?.appendChild(renderer.domElement);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.autoRotate = true;
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(5, 10, 5);
      directionalLight.castShadow = true;
      directionalLight.shadow.camera.left = -20;
      directionalLight.shadow.camera.right = 20;
      directionalLight.shadow.camera.top = 20;
      directionalLight.shadow.camera.bottom = -20;
      directionalLight.shadow.mapSize.width = 1024;
      directionalLight.shadow.mapSize.height = 1024;
      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = 50;
      scene.add(directionalLight);

      stats = new Stats();
      stats.dom.id = 'performance-stats';
      stats.showPanel(0);
      statsContainer.value?.appendChild(stats.dom);

      gui = new GUI();
      gui.add(config, 'cubeCount', 1, 1000000, 1).onFinishChange(createInstancedMesh);
      gui.add(config, 'rotationSpeed', 0, 0.1, 0.001);

      createInstancedMesh();
      renderLoop();

      window.addEventListener('resize', onWindowResize);
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
