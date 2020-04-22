import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../components/Home.vue";
import Kicker from "../components/Kicker.vue";
import Disc from "../components/Disc.vue";
import showDiscTag from "../tempt/showDiscTag.vue";
import sortDiscTag from "../tempt/sortDiscTag.vue";

//
import DiscDeck from "../components/DiscDeck/DiscDeck.vue";

//Alternative for DiscDeck with Simpler Filter
import DiscDeckJS from "../components/DiscDeckJS/DiscDeckJS.vue";

//For testing Axios in methods
import AxiosTest from "../tempt/axios_test/axios_test.vue";


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    
  },
  {
    path: "/kicker",
    name: "Kicker",
    component: Kicker,
    
  },
  {
    path: "/disc",
    name: "Disc",
    component: Disc,
    
  },
  {
    path: "/showDiscTag",
    name: "showDiscTag",
    component: showDiscTag
  },
  {
    path: "/sortDiscTag",
    name: "sortDiscTag",
    component: sortDiscTag
  },
  {
    path: "/discDeck",
    name: "DiscDeck",
    component: DiscDeck
  },
  //For testing Downgraded filter, apply swap cycle
  {
    path: "/discDeckJS",
    name: "DiscDeckJS",
    component: DiscDeckJS
  },
  //For testing running axios in methods
  {
    path:"/axiostest",
    name:"AxiosTest",
    component: AxiosTest
  }
];

const router = new VueRouter({
  routes
});

export default router;
