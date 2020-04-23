<template>
    <div class="pageContainer">
        <button v-on:click="goTop()" id="buttonGoTop" title="Go to top" :class="{'moveDown': hideDeck}">▲</button>
        <div id="discQueryHolder">
          <!-- TYPE SELECTOR -->
          <div class="field fieldType">
            <div class="fieldLabel">Type</div>
            <div class="buttonAll buttonFilter"
            v-on:click="typeFilter('all')"
            >ALL</div>
            <div 
            class="buttonFilter"
            v-for="typeList in typeLists" :key="typeList" 
            v-on:click="typeFilter(typeList)"
            v-bind:class="'type-' + typeList"
            >           
            </div>
          </div>
          
          <!-- ELEMENT SELECTOR -->
          <div class="field fieldElement">
            <div class="fieldLabel">Element</div>
            <div class="buttonAll buttonFilter"
            v-on:click="elementFilter('all')"
            >ALL</div>
            <div 
            class="buttonFilter"
            v-for="elementList in elementLists" :key="elementList" 
            v-on:click="elementFilter(elementList)"
            >      
            {{elementList}}
            </div>
          </div>

          <!-- RARITY SELECTOR -->
          <div class="field fieldRarity">
            <div class="fieldLabel">Rarity</div>
            <div class="buttonAll buttonFilter"
            v-on:click="rarityFilter('all')"
            >ALL</div>
            <div 
            class="buttonFilter"
            v-for="rarityList in rarityLists" :key="rarityList" 
            v-on:click="rarityFilter(rarityList)"
            >      
            {{rarityList}}
               
            </div>
          </div>



        </div>
        <div class="discGridContainer">
            <div class="discGrid">
                <div 
                class="discWrapper"
                v-for="discData in discs"
                :key="discData.id"
                v-bind:data-nameid="discData.id"
                v-bind:data-numberid="discData.numberID"
                v-bind:data-type="discData.type"
                v-bind:data-rarity="discData.rarity"
                v-bind:data-element="discData.element"
                v-on:click.capture="clickDisc($event)"              
                >
                    <div class="discName">{{ discData.nameEN }}</div>
                    <div class="discType">
                        <span v-bind:class="'type-' + discData.type"></span>
                    </div>
                    <div class="discImage">
                        <img v-bind:src="'img/disc/icon/' + discData.id + '.png'" />
                    </div>
                    <div class="discSkill">{{ discData.descriptionEN }}</div>                

                </div>


            </div>


        </div>
    <div class="hideDeckBuilder" @click="hideDeck = !hideDeck"  :class="{'active': hideDeck}"  >D</div>
    <div class="deckBuilderContainer " :class="{'hideDeckBuilder': hideDeck}">
      
      <div class="btnContainer">
        <div class="messageModal"></div>
        <button class="copyDeckBtn" v-on:click="copyDeckURL"><div>Copy Deck URL</div></button>
        <button class="clearDeckBtn" v-on:click="clearDeck($event)"><div>Clear Deck</div></button>
      </div>
      <div class="deckBuilderWrapper">
        <div class="deckBuilder">
          <div
            class="deckSlot"
            data-position="p1"
            data-numberid="0"
            data-nameid="empty"
            v-on:click.capture="clickDeck($event)"
          ><img src="img/disc/icon/empty.png" /></div>
          <div
            class="deckSlot"
            data-position="p2"
            data-numberid="0"
            data-nameid="empty"    
            v-on:click.capture="clickDeck($event)"
          ><img src="img/disc/icon/empty.png" /></div>
          <div
            class="deckSlot"
            data-position="p3"
            data-numberid="0"
            data-nameid="empty"
            v-on:click.capture="clickDeck($event)"
          ><img src="img/disc/icon/empty.png" /></div>
          <div
            class="deckSlot"
            data-position="p4"
            data-numberid="0"
            data-nameid="empty"
            v-on:click.capture="clickDeck($event)"
          ><img src="img/disc/icon/empty.png" /></div>
        </div>
      </div>
    </div>
    </div>
</template>
<style lang="scss" scoped>
@import "./DiscDeckJS.scss";
</style>
<script>
import DiscDeckJSCode from "./DiscDeckJS.js"
export default DiscDeckJSCode;
</script>