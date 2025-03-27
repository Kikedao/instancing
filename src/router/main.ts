import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import CanvasOne from '../components/CanvasOne.vue';
import CanvasTwo from '../components/CanvasTwo.vue';
import CanvasThree from '../components/CanvasThree.vue';
import DivRectangles from '../components/DivRectangles.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/div-rectangles', name: 'DivRectangles', component: DivRectangles },
  { path: '/canvas-one', name: 'CanvasOne', component: CanvasOne },
  { path: '/canvas-two', name: 'CanvasTwo', component: CanvasTwo },
  { path: '/canvas-three', name: 'CanvasThree', component: CanvasThree },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
