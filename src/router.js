import {createRouter, createWebHistory} from 'vue-router';
import Home from './views/Home';
import users_routes from './users/router';

let routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/tmp',
    name: 'tmp',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ './users/views/Login.vue'),
  },
];

routes = [...routes, ...users_routes];

console.log('>>>>>>>>>>>>>>>>>', routes);

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
