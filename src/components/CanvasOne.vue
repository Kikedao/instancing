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
import GUI from 'lil-gui';

interface Rectangle {
  x: number;
  y: number;
  color: string;
}

// Helper function to generate a random hex color.
function getRandomColor(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

export default defineComponent({
  name: 'CanvasOne',
  setup() {
    const canvasRef = ref<HTMLCanvasElement | null>(null);
    const statsContainer = ref<HTMLDivElement | null>(null);
    const router = useRouter();
    let stats: Stats;
    let gui: GUI;
    let animationId: number;

    // Plain array to store rectangles
    let rectangles: Rectangle[] = [];

    // Configuration for the rectangles and animation
    const config = {
      rectCount: 10,      // Starting number of rectangles
      speed: 2,           // Movement speed (pixels per frame)
      rectWidth: 50,      // Rectangle width
      rectHeight: 30,     // Rectangle height
    };

    // Update the rectangles array to match config.rectCount.
    const updateRectangles = () => {
      const currentCount = rectangles.length;
      if (config.rectCount > currentCount) {
        // Add new rectangles with random positions and a random color.
        for (let i = 0; i < config.rectCount - currentCount; i++) {
          rectangles.push({
            x: Math.random() * (canvasRef.value!.width),
            y: Math.random() * (canvasRef.value!.height - config.rectHeight),
            color: getRandomColor(),
          });
        }
      } else if (config.rectCount < currentCount) {
        // Remove extra rectangles.
        rectangles.splice(config.rectCount);
      }
    };

    // The render loop updates rectangle positions and draws them.
    const renderLoop = () => {
      stats.begin();

      if (canvasRef.value) {
        const ctx = canvasRef.value.getContext('2d');
        if (ctx) {
          // Clear the canvas with a dark background.
          ctx.fillStyle = '#121212';
          ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height);

          // Update and draw each rectangle using a for loop.
          for (let i = 0; i < rectangles.length; i++) {
            const rect = rectangles[i];
            rect.x -= config.speed;
            // When the rectangle is completely off the left side,
            // reset its x to reappear on the right side.
            if (rect.x + config.rectWidth < 0) {
              rect.x = canvasRef.value.width;
              rect.y = Math.random() * (canvasRef.value.height - config.rectHeight);
              // Optionally, assign a new color upon re-entry:
              // rect.color = getRandomColor();
            }
            // Draw the rectangle with its unique fill color.
            ctx.fillStyle = rect.color;
            ctx.fillRect(rect.x, rect.y, config.rectWidth, config.rectHeight);
            // Draw a red border.
            ctx.strokeStyle = 'red';
            ctx.strokeRect(rect.x, rect.y, config.rectWidth, config.rectHeight);
          }
        }
      }

      stats.end();
      animationId = requestAnimationFrame(renderLoop);
    };

    onMounted(() => {
      // Set canvas dimensions to fill the viewport.
      if (canvasRef.value) {
        canvasRef.value.width = window.innerWidth;
        canvasRef.value.height = window.innerHeight;
      }

      // Initialize stats.js for FPS monitoring.
      stats = new Stats();
      stats.dom.id = "performance-stats";
      stats.showPanel(0);
      if (statsContainer.value) {
        statsContainer.value.appendChild(stats.domElement);
      }

      // Create a lil-gui panel to adjust rectangle count and speed.
      gui = new GUI();
      gui.add(config, 'rectCount', 0, 20000, 1).onChange(() => {
        updateRectangles();
      });
      gui.add(config, 'speed', 0, 10, 0.1);

      // Initialize the rectangles array.
      updateRectangles();

      renderLoop();
    });

    onBeforeUnmount(() => {
      cancelAnimationFrame(animationId);
      gui.destroy();
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

.back-button {
  position: absolute;
  top: initial;
  bottom: 20px;
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
