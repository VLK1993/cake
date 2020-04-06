<template>
  <div class="pageContainer">
    <button v-on:click="goTop()" id="buttonGoTop" title="Go to top">Top</button>
    <!-- QUERY SELECTOR -->
    <div id="discQueryHolder">
      <!-- TYPE SELECTOR -->
      <div class="field fieldType">
        <div class="fieldLabel">Type</div>
        <div class="buttonAll">
          <input type="radio" id="filter_type_all" value v-model="type" />
          <label for="filter_type_all">ALL</label>
        </div>
        <div v-for="typeList in typeLists" :key="typeList">
          <input
            type="radio"
            v-bind:id="'filter_type_' + typeList"
            v-bind:value="typeList"
            v-model="type"
          />
          <label v-bind:for="'filter_type_' + typeList" v-bind:class="'type-' + typeList"></label>
        </div>
      </div>
      <!-- ELEMENT SELECTOR -->
      <div class="field fieldElement">
        <div class="fieldLabel">Element</div>
        <div>
          <input type="radio" id="filter_element_all" value v-model="element" />
          <label for="filter_element_all">All</label>
        </div>
        <div v-for="elementList in elementLists" :key="elementList">
          <label v-bind:for="'filter_element_' + elementList">
            <input
              type="radio"
              v-bind:id="'filter_element_' + elementList"
              v-bind:value="elementList"
              v-model="element"
            />
            {{ elementList }}
          </label>
        </div>
      </div>
      <!-- RARITY SELECTOR -->
      <div class="field fieldRarity">
        <div class="fieldLabel">Rarity</div>
        <div>
          <input type="radio" id="filter_rarity_all" value v-model="rarity" />
          <label for="filter_rarity_all">All</label>
        </div>
        <div v-for="rarityList in rarityLists" :key="rarityList">
          <label v-bind:for="'filter_rarity_' + rarityList">
            <input
              type="radio"
              v-bind:id="'filter_rarity_' + rarityList"
              v-bind:value="rarityList"
              v-model="rarity"
            />
            {{
            rarityList
            }}
          </label>
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
  background-color: #ffdc00;
  color: black;
  text-transform: uppercase;
  border: solid 1.5px rgb(5, 5, 5);
  cursor: pointer;
  padding: 10px;
  font-weight: bold;
  border-radius: 10px;
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
    font-size: calc(13px + (15 - 13) * ((100vw - 300px) / (1600 - 300)));
  }
}
@media screen and (max-width: 769px) {
  .discGrid {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media screen and (max-width: 426px) {
  .discGrid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media screen and (max-width: 426px) {
  .discGrid {
    .discWrapper .discImage img {
      height: 175px;
    }
  }
  .discSkill {
    text-align: left;
  }
}
@media screen and (max-width: 376px) {
  .type {
    &-atk-l:before {
      content: "ATK (Long)";
    }
    &-atk-s:before {
      content: "ATK (Short)";
    }
    &-atk-c:before {
      content: "ATK (Circle)";
    }
  }
}
@media screen and (max-width: 376px) {
  #discQueryHolder {
    .field {
      display: flex;
      flex-direction: column;
      .fieldLabel {
        left: 0;
      }
    }

    .fieldRarity,
    .fieldElement {
      min-width: initial;
    }
  }
}
@media screen and (max-width: 321px) {
  .discGrid {
    grid-template-columns: repeat(1, 1fr);
    .discWrapper .discImage img {
      height: 200px;
    }
  }
}
</style>
<script>
import axios from "axios";
import _ from "lodash";
export default {
  data() {
    return {
      typeLists: [],
      elementLists: [],
      rarityLists: [],
      rarity: "",
      type: "",
      element: "",
      discs: []
    };
  },
  async created() {
    try {
      const res = await axios.get("json/discs.json");

      // cook the list of elements on the fly
      const disc = res.data.discs,
        elementLists = this.elementLists,
        rarityLists = this.rarityLists,
        typeLists = this.typeLists;

      const function_dataCooker = function(discData, propertyName) {
        if (discData.hasOwnProperty(propertyName)) {
          const data = discData[propertyName];
          if (!this.includes(data)) {
            this.push(data);
          }
        }
      };

      for (const discData of disc) {
        function_dataCooker.call(elementLists, discData, "element");
        function_dataCooker.call(rarityLists, discData, "rarity");
        function_dataCooker.call(typeLists, discData, "type");
      }
      // Finished cooking.
      // This is to ensure that all the elements, rarities and types that fetched from the JSON data. Will be listed in the variables.
      // In the future, in case you add more elements or rarities or types, it will just appear in the variable without code changes.

      this.discs = disc;
      console.log(res.data);
    } catch (e) {
      console.error(e);
    }
  },
  computed: {
    filterdisc() {
      let vm = this;

      // Let's use an array of comparer. Why?
      // - This will make it that we only "check for the current filter's param is null or not" once, then add the comparer to the list.
      // Then the we will invoke all the comparers in the list in the filter function. With this, we eliminated the null-check per-filter's query.

      const comparisions = [];
      if (this.rarity) {
        comparisions.push(function() {
          // "this" here is the item that is being tested to the filter.
          return this.rarity === vm.rarity;
        });
      }
      if (this.type) {
        comparisions.push(function() {
          // "this" here is the item that is being tested to the filter.
          return this.type === vm.type;
        });
      }
      if (this.element) {
        comparisions.push(function() {
          // "this" here is the item that is being tested to the filter.
          return this.element === vm.element;
        });
      }
      const totalComparision = comparisions.length;
      if (totalComparision === 0) {
        return vm.discs;
      } else {
        return _.filter(vm.discs, function(query) {
          let result = true;
          for (let i = 0; i < totalComparision; i++) {
            result &= comparisions[i].call(query);
          }
          return result;
        });
      }
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
