<template>
    <div class="pageContainer">
        <button v-on:click="goTop()" id="buttonGoTop" title="Go to top">Top</button>
        <div id="discQueryHolder"></div>
        <div class="discGridContainer">
            <div class="discGrid">
                <div 
                class="discWrapper"
                v-for="discData in discs"
                :key="discData.id"
                v-bind:data-nameid="discData.id"
                v-bind:data-numberid="discData.numberID"
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
    <div class="deckBuilderContainer">
      <div class="btnContainer">
        <button class="copyDeckBtn" v-clipboard:copy="deckURL"><div>Copy Deck URL</div></button>
        <button class="clearDeckBtn" v-on:click="clearDeck($event)"><div>Clear Deck</div></button>
      </div>
      <div class="deckBuilderWrapper">
        <div class="deckBuilder">
          <div
            class="deckSlot"
            data-position="p1"
            data-numberid="0"
            v-on:click.capture="clickDeck($event)"
          >0</div>
          <div
            class="deckSlot"
            data-position="p2"
            data-numberid="0"    
            v-on:click.capture="clickDeck($event)"
          >0</div>
          <div
            class="deckSlot"
            data-position="p3"
            data-numberid="0"
            v-on:click.capture="clickDeck($event)"
          >0</div>
          <div
            class="deckSlot"
            data-position="p4"
            data-numberid="0"
            v-on:click.capture="clickDeck($event)"
          >0</div>
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