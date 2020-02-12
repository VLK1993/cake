import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../components/Home.vue";
import Valkyrja from "../components/Valkyrja.vue";
import Stigmata from "../components/Stigmata.vue";
import Weapon from "../components/Weapon.vue";
import axios_test from "../tempt/axios_test.vue";
import Test_parent from "../tempt/Test_parent.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/valkyrja",
    name: "Valkyrja",
    component: Valkyrja
  },
  {
    path: "/stigmata",
    name: "Stigmata",
    component: Stigmata
  },
  {
    path: "/weapon",
    name: "Weapon",
    component: Weapon
  },
  {
    path:"/axios_test",
    name:"axios_test",
    component: axios_test
  },
  {
    path:"/test_parent",
    name:"Test_parent",
    component: Test_parent
  }
];

const router = new VueRouter({
  routes
});

export default router;