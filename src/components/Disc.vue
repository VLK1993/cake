<template>
  <div class="pageContainer">
    <button v-on:click="goTop()" id="buttonGoTop" title="Go to top">Top</button>
    <!-- QUERY SELECTOR -->
    <div id="discQueryHolder">
      <!-- TYPE SELECTOR -->
      <div class="field fieldType">
        <div class="fieldLabel">Type</div>
        <div class="buttonAll">
          <input type="radio" id="all" value="" v-model="type" />
          <label for="all">ALL</label>
        </div>
        <div v-for="typeList in typeLists" :key="typeList">
          <input type="radio" v-bind:value="typeList" v-model="type" />
          <label
            v-bind:for="typeList"
            v-bind:class="'type-' + typeList"
          ></label>
        </div>
      </div>
      <!-- ELEMENT SELECTOR -->
      <div class="field fieldElement">
        <div class="fieldLabel">Element</div>
        <div>
          <input type="radio" id="all" value="" v-model="element" />
          <label for="all">All</label>
        </div>
        <div v-for="elementList in elementLists" :key="elementList">
          <label v-bind:for="elementList"
            ><input
              type="radio"
              v-bind:value="elementList"
              v-model="element"
            />{{ elementList }}</label
          >
        </div>
      </div>
      <!-- RARITY SELECTOR -->
      <div class="field fieldRarity">
        <div class="fieldLabel">Rarity</div>
        <div>
          <input type="radio" id="all" value="" v-model="rarity" />
          <label for="all">All</label>
        </div>
        <div v-for="rarityList in rarityLists" :key="rarityList">
          <label v-bind:for="rarityList"
            ><input type="radio" v-bind:value="rarityList" v-model="rarity" />{{
              rarityList
            }}</label
          >
        </div>
      </div>
      <!-- SPECIAL TAG SELECTOR -->

      <!-- DISC GRID -->
    </div>
    <div class="discGridContainer">
      <div class="discGrid">
        <div class="discWrapper" v-for="disc in filterdisc" :key="disc.id">
          <div class="discName">{{ disc.nameEN }}</div>
          <div class="discType">
            <span v-bind:class="'type-' + disc.type"></span>
          </div>
          <!-- 
                <div class="discRarity">{{disc.rarity}}</div>
                <div class="discElement">{{disc.element}}</div>
                -->
          <div class="discImage">
            <img v-bind:src="'img/disc/icon/' + disc.id + '.png'" />
          </div>
          <div class="discSkill">{{ disc.descriptionEN }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
#buttonGoTop {
  display: none;
  position: fixed;
  bottom: 20px;
  right: 30px;
  z-index: 99;
  font-size: 18px;
  border: none;
  outline: none;
  background-color: red;
  color: white;
  cursor: pointer;
  padding: 15px;
  border-radius: 4px;
  :hover {
    background-color: #555;
  }
}

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
  &-buff:before {
    content: "BUFF";
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
  flex-wrap: wrap;
  display: flex;
  flex-direction: row;
  justify-content: center;
  .field {
    display: grid;
    position: relative;
    padding: 20px 10px 10px 5px;
    text-align: start;
    border: solid 1.5px rgb(5, 5, 5);
    background-color: rgb(245, 245, 245);
    border-radius: 2px;
    margin-left: 5px;
    margin-right: 5px;
    margin-bottom: 15px;
    margin-top: 5px;
    input {
      margin: 0.4em;
    }
    .fieldLabel {
      background-color: rgb(5, 5, 5);
      color: rgb(250, 250, 250);
      padding: 3px 6px;
      position: absolute;
      top: -10px;
      left: 10px;
    }
  }
  .fieldType {
    grid-template-columns: 1fr 1fr;
    .buttonAll {
      grid-column: 1 / span 2;
    }
  }
  .fieldElement {
    min-width: 100px;
  }
  .fieldRarity {
    min-width: 100px;
  }
  .fieldElement label {
    text-transform: capitalize;
  }
  .fieldRarity label {
    text-transform: uppercase;
  }
}
@media screen and (max-width: 321px) {
  #discQueryHolder {
    .fieldType {
      grid-template-columns: 1fr;
      .buttonAll {
        grid-column: 1 / span 1;
      }
      width: 100%;
    }
  }
}
.discGridContainer {
  background-color: #f5f5f5;
}
.discGrid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  margin-top: 10px;
  padding: 10px;
  grid-gap: 5px;
}
.discWrapper {
  display: grid;
  background-color: rgb(250, 250, 250);
  grid-template-rows: 2em 2em 220px 1fr;
  grid-template-areas:
    "discName discName"
    "discType discType"
    "discImage discImage"
    "discSkill discSkill";
  .discName {
    grid-area: discName;
    background-color: rgb(5, 5, 5);
    color: rgb(245, 245, 245);
    font-weight: bold;
    line-height: 32px;
  }
  .discType {
    grid-area: discType;
    background-color: rgb(100, 100, 100);
    color: rgb(250, 250, 250);
    line-height: 32px;
  }
  .discElement {
    grid-area: discElement;
    text-transform: capitalize;
  }
  .discRarity {
    grid-area: discRarity;
    text-transform: uppercase;
  }
  .discImage {
    grid-area: discImage;
    background-color: rgb(230, 230, 230);
    height: 220px;
    padding-top: 10px;
    img {
      height: 200px;
    }
  }
  .discSkill {
    grid-area: discSkill;
    align-self: stretch;
    background-color: rgb(245, 245, 245);
    padding: 5px;
  }
}
@media screen and (max-width: 769px) {
  .discGrid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
}
@media screen and (max-width: 426px) {
  .discGrid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}
@media screen and (max-width: 321px) {
  .discGrid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
<script>
import axios from "axios";
import _ from "lodash";
export default {
  data() {
    return {
      typeLists: [
        "atk-r",
        "atk-l",
        "atk-s",
        "atk-c",
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
  },
  methods: {
    goTop() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  },
  mounted() {
    //Go TOP BUTTON
    var buttonGoTop = document.getElementById("buttonGoTop");
    window.onscroll = function() {
      scrollFunction();
    };

    function scrollFunction() {
      if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
      ) {
        buttonGoTop.style.display = "block";
      } else {
        buttonGoTop.style.display = "none";
      }
    }
  }
};
</script>
