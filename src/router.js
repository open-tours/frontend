import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home";
import NotFound404 from "./views/NotFound404";
import users_routes from "./users/router";
import tours_routes from "./tours/router";

let routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/tmp",
    name: "tmp",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "./users/views/Login.vue")
  },
  { path: "/404", name: "404", component: NotFound404 }
];

// add users routes
routes = [...routes, ...users_routes, ...tours_routes];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
