<template>
  <div class="pageContainer">
    <!-- QUERY SELECTOR -->
    <div id="discQueryHolder">
      <!-- TYPE SELECTOR -->
      <fieldset>
        <legend>type</legend>
        <span>
          <input type="radio" id="all" value="" v-model="type" />
          <label for="all">ALL</label>
          <br />
        </span>
        <span v-for="typeList in typeLists" :key="typeList"
          ><input type="radio" v-bind:value="typeList" v-model="type" />
          <label
            v-bind:for="typeList"
            v-bind:class="'type-' + typeList"
          ></label>
          <br />
        </span>
      </fieldset>
      <!-- ELEMENT SELECTOR -->
      <fieldset>
        <legend>element</legend>
        <span>
          <input type="radio" id="all" value="" v-model="element" />
          <label for="all">all</label>
          <br />
        </span>
        <span v-for="elementList in elementLists" :key="elementList">
          <label v-bind:for="elementList"
            ><input
              type="radio"
              v-bind:value="elementList"
              v-model="element"
            />{{ elementList }}</label
          >
          <br />
        </span>
      </fieldset>
      <!-- RARITY SELECTOR -->
      <fieldset>
        <legend>rarity</legend>
        <span>
          <input type="radio" id="all" value="" v-model="rarity" />
          <label for="all">all</label>
          <br />
        </span>
        <span v-for="rarityList in rarityLists" :key="rarityList">
          <label v-bind:for="rarityList"
            ><input type="radio" v-bind:value="rarityList" v-model="rarity" />{{
              rarityList
            }}</label
          >
          <br />
        </span>
      </fieldset>
      <!-- SPECIAL TAG SELECTOR -->

      <!-- DISC GRID -->
    </div>
    <div class="discGrid">
      <div class="disc" v-for="disc in filterdisc" :key="disc.id">
        <div class="discName">{{ disc.nameEN }}</div>
        <div class="discSkill">{{ disc.descriptionEN }}</div>
        <div class="discRarity">{{ disc.rarity }}</div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.type {
  &-atk-l:before {
    content: "ATK (Long Distance)";
  }
  &-atk-s:before {
    content: "ATK (Short Distance)";
  }
  &-atk-r:before {
    content: "ATK (Rush)";
  }
  &-atk-c:before {
    content: "ATK (Circumference)";
  }
  &-warp:before {
    content: "WARP";
  }
  &-move:before {
    content: "MOVE";
  }
  &-heal:before {
    content: "HEAL";
  }
  &-trap:before {
    content: "TRAP";
  }
}
#discQueryHolder {
  display: flex;
  flex-direction: row;
  fieldset {
    display: inline-block;
  }
}
.discGrid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
}
</style>
<script>
import axios from "axios";
import _ from "lodash";
export default {
  data() {
    return {
      typeLists: [
        "atk-l",
        "atk-s",
        "atk-c",
        "atk-r",
        "warp",
        "move",
        "trap",
        "heal"
      ],
      elementLists: ["fire", "water", "wind"],
      rarityLists: ["ur", "sr", "r", "n"],
      rarity: "",
      type: "",
      element: "",
      discs: []
    };
  },
  async created() {
    try {
      const res = await axios.get("json/discs.json");
      this.discs = res.data.discs;
      console.log(res.data);
    } catch (e) {
      console.error(e);
    }
  },
  computed: {
    filterdisc() {
      var vm = this,
        discs = vm.discs;
      return _.filter(discs, function(query) {
        var rarity = vm.rarity ? query.rarity == vm.rarity : true,
          type = vm.type ? query.type == vm.type : true,
          element = vm.element ? query.element == vm.element : true;

        return type && element && rarity;
      });
    }
  }
};
</script>
