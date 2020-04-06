<template>
  <div class="pageContainer">
    <!--  THIS IS FOR TESTING ATK TYPE SORTING   -->
    <button v-on:click="goTop()" id="buttonGoTop" title="Go to top">Top</button>
    <!-- THERE WOULD NOT NEED TO BE A QUERY SELECTOR BUT A BUTTON TO GO BACK TO NORMAL DISC SELECTOR -->
    
    <div class="goBack">GO BACK</div>
    <div class="discAtkTypeContainer">
      <div class="discAtkTypeWrapper">

        <div  v-for="indexAtkType in indexAtkTypes" :key="indexAtkType">
          <div class="discAtkType" v-if="indexAtkType[0] != 'none'">
            <div class="atkTypeHeader">{{indexAtkType[0]}}</div>
          
          <div class="discWrapper" v-for="disc in indexAtkType[1]" :key="disc.id">
            <div class="discName">{{ disc.nameEN }}</div>
            <div class="discType">
              <span v-bind:class="'type-' + disc.type"></span>
            </div>
            
            <div class="discImage">
              <img v-bind:src="'img/disc/icon/' + disc.id + '.png'" />
            </div>
            <div class="discSkill">{{ disc.descriptionEN }}</div>

            
          </div>
          </div>
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

.discAtkTypeContainer {
  background-color: #f5f5f5;
}
.discAtkTypeWrapper {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  padding: 10px;
  grid-gap: 5px;
}
.discAtkType {
  display:grid;
  padding-top:30px;
  grid-template-columns: repeat(5, 1fr);
  position:relative;
  .atkTypeHeader {
    position:absolute;
    left:0;
    top:0;

  }
}
.discWrapper {
  .alt {
    position:absolute;
    top:0;
    left:0;
    color:red;
  }
  position:relative;
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
    font-size:calc(13px + (15 - 13) * ((100vw - 300px)/(1600 - 300)));;
  }
}















</style>
<script>
import axios from "axios";
import _ from "lodash";
export default {
  data() {
    return {
      discs: [],
      indexAtkTypes:[],
      indexAtkTypeDiscs:[]
    };
  },
  async created() {
    try {
      const res = await axios.get("json/discs.json");
      this.discs = res.data.discs;
      var groupDiscs = _.groupBy(this.discs, 'atkType');
      this.indexAtkTypes = Object.entries(groupDiscs);
      

      
      var indexAtkTypeDiscs = Object.values(groupDiscs);

    } catch (e) {
      console.error(e);
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
