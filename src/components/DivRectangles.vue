<template>
    <div class="div-container" ref="container">
      <!-- Back button in the top right -->
      <button class="back-button" @click="goHome">Back to Home</button>
      <!-- Stats.js panel will be appended here -->
      <div ref="statsContainer"></div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
  import { useRouter } from 'vue-router';
  import GUI from 'lil-gui';
  import Stats from 'three/examples/jsm/libs/stats.module.js';
  
  interface Rectangle {
    x: number;
    y: number;
    color: string;
    el: HTMLElement;
  }
  
  // Helper to generate a random hex color.
  function getRandomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0');
  }
  
  export default defineComponent({
    name: 'DivRectangles',
    setup() {
      const container = ref<HTMLDivElement | null>(null);
      const statsContainer = ref<HTMLDivElement | null>(null);
      const router = useRouter();
      let stats: Stats;
      let gui: GUI;
      let animationId: number;
  
      // Plain array to store rectangle objects.
      let rectangles: Rectangle[] = [];
  
      // Configuration for rectangle count, speed, and size.
      const config = {
        rectCount: 10,      // Starting number of rectangles.
        speed: 2,           // Pixels per frame.
        rectWidth: 50,      // Width in pixels.
        rectHeight: 30,     // Height in pixels.
      };
  
      // Update the rectangles array to match config.rectCount.
      // New rectangles are created as div elements appended to the container.
      const updateRectangles = () => {
        if (!container.value) return;
        const currentCount = rectangles.length;
        if (config.rectCount > currentCount) {
          // Create new rectangle divs.
          for (let i = 0; i < config.rectCount - currentCount; i++) {
            const x = Math.random() * container.value.clientWidth;
            const y = Math.random() * (container.value.clientHeight - config.rectHeight);
            const color = getRandomColor();
            const el = document.createElement('div');
            el.style.position = 'absolute';
            el.style.width = config.rectWidth + 'px';
            el.style.height = config.rectHeight + 'px';
            el.style.backgroundColor = color;
            el.style.border = '1px solid red';
            // Use translate3D for positioning.
            el.style.transform = `translate3D(${x}px, ${y}px, 0)`;
            el.style.willChange = 'transform';
            container.value.appendChild(el);
            rectangles.push({ x, y, color, el });
          }
        } else if (config.rectCount < currentCount) {
          // Remove extra rectangle divs.
          for (let i = currentCount - 1; i >= config.rectCount; i--) {
            const rect = rectangles[i];
            container.value.removeChild(rect.el);
            rectangles.pop();
          }
        }
      };
  
      // The animation loop updates each rectangle's position and repositions if needed.
      const renderLoop = () => {
        stats.begin();
        if (container.value) {
          const containerWidth = container.value.clientWidth;
          const containerHeight = container.value.clientHeight;
          // Use a standard for loop to update each rectangle.
          for (let i = 0; i < rectangles.length; i++) {
            const rect = rectangles[i];
            rect.x -= config.speed;
            // When the rectangle exits completely on the left, reposition it on the right.
            if (rect.x + config.rectWidth < 0) {
              rect.x = containerWidth;
              rect.y = Math.random() * (containerHeight - config.rectHeight);
            }
            // Update the div's transform using translate3D.
            rect.el.style.transform = `translate3D(${rect.x}px, ${rect.y}px, 0)`;
          }
        }
        stats.end();
        animationId = requestAnimationFrame(renderLoop);
      };
  
      onMounted(() => {
        // Initialize stats.js.
        stats = new Stats();
        stats.dom.id = "performance-stats";
        stats.showPanel(0);
        if (statsContainer.value) {
          statsContainer.value.appendChild(stats.dom);
        }
  
        // Set up lil-gui for interactive controls.
        gui = new GUI();
        gui.add(config, 'rectCount', 0, 20000, 1).onChange(() => {
          updateRectangles();
        });
        gui.add(config, 'speed', 0, 10, 0.1);
  
        // Initialize rectangles.
        updateRectangles();
  
        // Start the animation loop.
        renderLoop();
      });
  
      onBeforeUnmount(() => {
        cancelAnimationFrame(animationId);
        gui.destroy();
      });
  
      const goHome = () => {
        router.push('/');
      };
  
      return { container, statsContainer, goHome };
    },
  });
  </script>
  
  <style scoped>
  .div-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    background-color: #121212; /* Dark background */
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
  