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
            {{ rarityList }}
          </label>
        </div>
      </div>
      <!-- SPECIAL TAG SELECTOR -->

      <!-- DISC GRID -->
    </div>
    <div class="discGridContainer">
      <div class="discGrid">
        <div class="discWrapper" v-for="disc in filterdisc" :key="disc.id" v-bind:data-nameid="disc.id" v-bind:data-numberid="disc.numberID" v-on:click.capture="getDisc($event)">
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
    <div class="deckBuilderContainer">
        <button v-clipboard:copy="deckURL">Spawn URL</button>
        <button v-on:click="clearDeck($event)" >Clear All deck</button>
        <div class="deckBuilder">
            <div class="discSlot" data-position="p1" v-on:click.capture="assignDisc($event)"></div>
            <div class="discSlot" data-position="p2" v-on:click.capture="assignDisc($event)"></div>
            <div class="discSlot" data-position="p3" v-on:click.capture="assignDisc($event)"></div>
            <div class="discSlot" data-position="p4" v-on:click.capture="assignDisc($event)"></div>

        </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>

.deckBuilderContainer {
    position:fixed;
    right:0;
    left:0;
    bottom:0;
    z-index: 2;
}
.deckBuilder {
    width:95%;
    margin:0 auto;
    
    display:grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap:10px;
    background-color:rgba(50,50,50,0.85);
    .discSlot {
        background-color:rgb(150, 150, 150);
        height:120px;
        min-width:0;
        min-height:0;
        ::v-deep img {
            width:100%;
        }
    }
} 



.pageContainer {
    position:relative;

}
#buttonGoTop {
  display: none;
  position: fixed;
  bottom: 120px;
  right: 30px;
  z-index: 99;
  font-size: 18px;
  border: none;
  outline: none;
  background-color: #ffdc00;
  color: black;
  text-transform:uppercase;
  border:solid 1.5px rgb(5, 5, 5);
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
  position:relative;
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
    font-size:calc(13px + (15 - 13) * ((100vw - 300px)/(1600 - 300)));;
  }
  &.active {
    .discImage{
    background-color:yellow !important;
    }
  }
  &::before {
    position:absolute;
    left:0; right:0; top:0; bottom:0;
    background-color:rgba(50,50,50,0.5);
    content:"";
    display:none;
  }
  &::after {
    content:"Already In Deck";
    color:red;
    position:absolute;
    top:50%; left:50%;
    transform:translate(-50%,-50%);
    display:none;
  }
  &.inDeck::before {
    display:block;
  }
  &.inDeck::after {
    display:block;
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
      height:175px;
    }
  }
  .discSkill {
    text-align:left;
  }
}
@media screen and (max-width:376px) {
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
      display:flex;
      flex-direction:column;
      .fieldLabel {
      left:0;
    }
    }
    
    .fieldRarity, .fieldElement {min-width:initial;}
  }
}
@media screen and (max-width: 321px) {
  .discGrid {
    grid-template-columns: repeat(1, 1fr);
    .discWrapper .discImage img { 
      height:200px;
    }
  }
}
</style>
<script>
import axios from "axios";
import _ from "lodash";
import $ from "jquery";
export default {
  data() {
    return {
      typeLists: [],
      elementLists: [],
      rarityLists: [],
      rarity: "",
      type: "",
      element: "",
      discs: [],
      activeDiscValue:{},
      deck:{},
      chooseDisc:true,
      deckURL:""
    };
  },
  async created() {
       /*
       *A. GET JSON FILE and form filter around it
       */
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
    };
       /*
        * B. FETCH URL, get Position and Value then put it back to Deck Slot
        * Update into DECK{}
        */
        var deckURLString = new URL(window.location.href).toString();
        deckURLString = deckURLString.replace("#/","");
        /*
         * Find "?" in URL to check if shared disc link or not
         */
        var checkURL = deckURLString.search("\\?"); //I dont know why ? is \\?
        if( checkURL != -1){
          var deckURL = new URL(deckURLString); 
          //Convert URL Param into OBJ
          var deckParams = new URLSearchParams(deckURL.search.slice(1));

          var deckInfo = {}; //Deck Information including Value and Position -> returns Object
          for(let pair of deckParams.entries()) {
              deckInfo[pair[0]] = pair[1]    //push keys/values to object
          }
          
          var deckInfoValue = Object.values(deckInfo); //Deck Info Value = numberID - use to look up Disc from disc -> returns Array
          var deckInfoPos = Object.keys(deckInfo); //Deck Info Position - use to bind with disc info later -> returns Array


          var discs = this.discs;
          var filtered = discs.filter(function(item) {
              return deckInfoValue.indexOf(item.numberID) !== -1 ;
          });

          var deckIndex = 0;
          for (deckIndex; deckIndex < deckInfoPos.length; deckIndex++) {
            var value = deckInfoValue[deckIndex];
            var nameID = filtered[deckIndex].id;
            var position = deckInfoPos[deckIndex];

            //WHY WONT YOU WORK
            $(`.discWrapper[data-numberid="${value}"]`).addClass("inDeck");
            console.log(`.discWrapper[data-numberid="${value}"]`);


            $(".deckBuilder").find(`[data-position='${position}']`).html(`
              <img src="img/disc/icon/${nameID}.png" />
            `);

            

          };
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
          for (let i = 0; i < totalComparision; i++) {
            if (!comparisions[i].call(query)) {
              return false;
            }
          }
          return true;
        });
      }
    }
  },
  methods: {
    goTop() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    },
    /*
     * Function making Discs go YELLOW on CLICK 
     */
    getDisc: function(event) {
            
            var activeDisc = $(event.target).parents(".discWrapper");
            $(activeDisc).parent().children(".discWrapper").removeClass("active");
            $(activeDisc).addClass("active");

            
            var activeDiscNumberID = $(activeDisc).data("numberid");
            var activeDiscNameID = $(activeDisc).data("nameid");
            var chooseDisc = this.chooseDisc = false;
            var activeDiscValue = this.activeDiscValue = {
                activeDiscNameID: activeDiscNameID,
                activeDiscNumberID: activeDiscNumberID
            };
            
            
            return activeDiscValue && chooseDisc;
    },
    /*
     * 1. RECORD ACTIVE DISC TO DECK
     * 2. UPDATE DECK {}
     * 3. SPAWN URL BASED ON DECK {}
     */
    assignDisc:function(event) {
        var activeDiscValue = this.activeDiscValue;
        var chooseDisc = this.chooseDisc;

       
        /*
         * chooseDisc = fault -> after clicking on Disc Area
         * chooseDisc = true  -> after clicking on Deck Area 
         */
        if(chooseDisc == false ) {
            var deckSlot = event.target;
            var deckSlotPosition = deckSlot.dataset.position;

            $(".discWrapper.active").addClass("inDeck");
            $(".discWrapper.active").removeClass("active");

            deckSlot.innerHTML = `
            <img src="img/disc/icon/${activeDiscValue.activeDiscNameID}.png" />
            `;
            var deck = this.deck; //get current deck object from data
            var updateDeck = {
                [deckSlotPosition]:activeDiscValue.activeDiscNumberID
            }; //get current position and disc
            deck = this.deck = Object.assign(deck, updateDeck); //merge dem 
            chooseDisc = this.chooseDisc = true;

            var deckURL = window.location.href.split('?')[0] + "?" + $.param(deck); // MAKE DECK URL BASED ON DECK
            this.deckURL = deckURL;
            
            console.log(deck);
            console.log(deckURL);
            return deck & chooseDisc & deckURL;
        }
       
    },
    clearDeck:function(){
      $(".discSlot").empty();
      var deck = this.deck = {};
      var deckURL = this.deckURL = "";
      $(".discWrapper.active").removeClass("active");
      $(".discWrapper.inDeck").removeClass("inDeck");
      var chooseDisc = this.chooseDisc = true;


      console.log("deck URL Removed");
      return deck & deckURL & chooseDisc;


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
    };

    
    
    
  }
};
</script>
