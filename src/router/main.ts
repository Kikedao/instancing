import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import DivRectangles from '../components/DivRectangles.vue';
import CanvasRectangles from '../components/CanvasRectangles.vue';
import CanvasThreeCubes from '../components/CanvasThreeCubes.vue';
import CanvasThreeInstanced from '../components/CanvasThreeInstanced.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/div-rectangles', name: 'DivRectangles', component: DivRectangles },
  { path: '/canvas-rectangles', name: 'CanvasRectangles', component: CanvasRectangles },
  { path: '/canvas-three-cubes', name: 'CanvasThreeCubes', component: CanvasThreeCubes },
  { path: '/canvas-three-instanced', name: 'CanvasThreeInstanced', component: CanvasThreeInstanced },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
