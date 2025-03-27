<template>
  <div class="canvas-container">
    <!-- Full viewport canvas -->
    <canvas ref="canvasRef" class="full-canvas"></canvas>
    <!-- Back button in the top right -->
    <button class="back-button" @click="goHome">Back to Home</button>
    <!-- Stats.js will be appended here -->
    <div ref="statsContainer"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import Stats from 'stats.js';

export default defineComponent({
  name: 'CanvasTwo',
  setup() {
    const canvasRef = ref<HTMLCanvasElement | null>(null);
    const statsContainer = ref<HTMLDivElement | null>(null);
    const router = useRouter();
    let stats: Stats;
    let animationId: number;

    const renderLoop = () => {
      stats.begin();
      // Custom drawing: clear the canvas with dark background
      if (canvasRef.value) {
        const ctx = canvasRef.value.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#121212';
          ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height);
        }
      }
      stats.end();
      animationId = requestAnimationFrame(renderLoop);
    };

    onMounted(() => {
      // Ensure the canvas fills the viewport
      if (canvasRef.value) {
        canvasRef.value.width = window.innerWidth;
        canvasRef.value.height = window.innerHeight;
      }
      // Initialize stats.js and attach it to the container
      stats = new Stats();
      stats.dom.id = "performance-stats";
      stats.showPanel(0); // FPS panel

      /* If you wish to double the size:
      stats.dom.style.transformOrigin = 'bottom left';
      stats.dom.style.transform = 'scale(2)';
      */

      if (statsContainer.value) {
        statsContainer.value.appendChild(stats.domElement);
      }

      renderLoop();
    });

    onBeforeUnmount(() => {
      cancelAnimationFrame(animationId);
    });

    const goHome = () => {
      router.push('/');
    };

    return { canvasRef, statsContainer, goHome };
  },
});
</script>

<style>
.canvas-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #121212; /* Dark background */
}

.full-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

/* Back button styled to appear in the top right */
.back-button {
  position: absolute;
  top: 20px;
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
