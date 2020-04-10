<template>
  <div class="pageContainer">
    <button v-on:click="goTop()" id="buttonGoTop" title="Go to top">Top</button>
    <!-- QUERY SELECTOR -->
    <div id="discQueryHolder">
      <!-- TYPE SELECTOR -->
      <div class="field fieldType">
        <div class="fieldLabel">Type</div>
        <div class="buttonAll">
          <input
            type="radio"
            id="filter_type_all"
            value
            v-model="filterting_type"
          />
          <label for="filter_type_all">ALL</label>
        </div>
        <div v-for="typeList in typeLists" :key="typeList">
          <input
            type="radio"
            v-bind:id="'filter_type_' + typeList"
            v-bind:value="typeList"
            v-model="filterting_type"
          />
          <label
            v-bind:for="'filter_type_' + typeList"
            v-bind:class="'type-' + typeList"
          ></label>
        </div>
      </div>
      <!-- ELEMENT SELECTOR -->
      <div class="field fieldElement">
        <div class="fieldLabel">Element</div>
        <div>
          <input
            type="radio"
            id="filter_element_all"
            value
            v-model="filterting_element"
          />
          <label for="filter_element_all">All</label>
        </div>
        <div v-for="elementList in elementLists" :key="elementList">
          <label v-bind:for="'filter_element_' + elementList">
            <input
              type="radio"
              v-bind:id="'filter_element_' + elementList"
              v-bind:value="elementList"
              v-model="filterting_element"
            />
            {{ elementList }}
          </label>
        </div>
      </div>
      <!-- RARITY SELECTOR -->
      <div class="field fieldRarity">
        <div class="fieldLabel">Rarity</div>
        <div>
          <input
            type="radio"
            id="filter_rarity_all"
            value
            v-model="filterting_rarity"
          />
          <label for="filter_rarity_all">All</label>
        </div>
        <div v-for="rarityList in rarityLists" :key="rarityList">
          <label v-bind:for="'filter_rarity_' + rarityList">
            <input
              type="radio"
              v-bind:id="'filter_rarity_' + rarityList"
              v-bind:value="rarityList"
              v-model="filterting_rarity"
            />
            {{ rarityList }}
          </label>
        </div>
      </div>
      <!-- SPECIAL TAG SELECTOR -->
    </div>

    <!-- DISC GRID -->
    <div class="discGridContainer">
      <div class="discGrid">
        <div
          class="discWrapper"
          v-for="discData in discs"
          :key="discData.id"
          v-bind:data-nameid="discData.id"
          v-bind:data-numberid="discData.numberID"
          v-on:click.capture="getDisc($event)"
        >
          <div class="discName">{{ discData.nameEN }}</div>
          <div class="discType">
            <span v-bind:class="'type-' + discData.type"></span>
          </div>
          <!-- 
                <div class="discRarity">{{discData.rarity}}</div>
                <div class="discElement">{{discData.element}}</div>
          -->
          <div class="discImage">
            <img v-bind:src="'img/disc/icon/' + discData.id + '.png'" />
          </div>
          <div class="discSkill">{{ discData.descriptionEN }}</div>
        </div>
      </div>
    </div>
    <div class="deckBuilderContainer">
      <button v-clipboard:copy="deckURL">Spawn URL</button>
      <button v-on:click="clearDeck($event)">Clear All deck</button>
      <div class="deckBuilder">
        <div
          class="discSlot"
          data-position="p1"
          v-on:click.capture="assignDisc($event)"
        ></div>
        <div
          class="discSlot"
          data-position="p2"
          v-on:click.capture="assignDisc($event)"
        ></div>
        <div
          class="discSlot"
          data-position="p3"
          v-on:click.capture="assignDisc($event)"
        ></div>
        <div
          class="discSlot"
          data-position="p4"
          v-on:click.capture="assignDisc($event)"
        ></div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "./DiscDeck.scss";
</style>
<script>
import DiscDeckCode from "./DiscDeck.js";
export default DiscDeckCode;
</script>
