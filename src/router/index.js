import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../components/Home.vue";
import Kicker from "../components/Kicker.vue";
import Disc from "../components/Disc.vue";
import showDiscTag from "../tempt/showDiscTag.vue";
import sortDiscTag from "../tempt/sortDiscTag.vue";
import DiscDeck from "../components/DiscDeck.vue";


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    metaInfo: {
      title: "Kick-Flight Wiki",
      meta: [
        { name: "description", content: "Fan-made Kick-Flight Wiki" },
        { name: "keywords", content: "mobile-game,kick-Flight" }
        //you can also add open graph tags here
      ]
    },
  },
  {
    path: "/kicker",
    name: "Kicker",
    component: Kicker,
    metaInfo: {
      title: "Kickers | Kick-Flight Wiki",
      meta: [
        { name: "description", content: "Contains Kickers information including Kicker Skill, Special Skill, Disc Compability" },
        { name: "keywords", content: "Kick-Flight, kicker, kicker skill, special skill, disc compability" }
        //you can also add open graph tags here
      ]
    },
  },
  {
    path: "/disc",
    name: "Disc",
    component: Disc,
    metaInfo: {
      title: "Disc | Kick-Flight Wiki",
      meta: [
        { name: "description", content: "Contains Discs information, with filter through type, rarity and elements" },
        { name: "keywords", content: "Kick-Flight, disc, ATK, BUFF, HEAL, WARP, TRAP, MOVE" }
        //you can also add open graph tags here
      ]
    }
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
  }
];

const router = new VueRouter({
  routes
});

export default router;
