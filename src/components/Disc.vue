<template>
<div class="pageContainer">
  <!-- QUERY SELECTOR -->
  <div id="discQueryHolder">
    <!-- TYPE SELECTOR -->
    <fieldset>
      <legend>type</legend>
        <span>
          <input type="radio" id="all" value="" v-model="type">
          <label for="all">ALL</label>
        <br>
        </span>
        <span  v-for="typeList in typeLists" :key="typeList" ><input type="radio" v-bind:value="typeList" v-model="type" >
          <label v-bind:for="typeList" v-bind:class="'type-' + typeList"></label>
          <br>
        </span>

    </fieldset>
    <!-- ELEMENT SELECTOR -->
    <fieldset>
      <legend>element</legend>
      <span>
      <input type="radio" id="all" value="" v-model="element">
      <label for="all">all</label>
      <br>
      </span>
      <span v-for="elementList in elementLists" :key="elementList">
        <label v-bind:for="elementList"><input type="radio" v-bind:value="elementList"  v-model="element">{{elementList}}</label>
        <br>
      </span>

    </fieldset>
    <!-- RARITY SELECTOR -->
    <fieldset>
      <legend>rarity</legend>
      <span>
        <input type="radio" id="all" value="" v-model="rarity">
        <label for="all">all</label>
        <br>
      </span>
      <span v-for="rarityList in rarityLists" :key="rarityList">
        <label v-bind:for="rarityList"><input type="radio" v-bind:value="rarityList"  v-model="rarity">{{rarityList}}</label>
        <br>
      </span>

    </fieldset>
    <!-- SPECIAL TAG SELECTOR -->

    <!-- DISC GRID -->
    </div>
    <div class="discGridContainer">
        <div class="discGrid">
        
            <div class="discWrapper" v-for="disc in filterdisc" :key="disc.id" >
                <div class="discName">{{disc.nameEN}}</div>
                <div class="discType"><span v-bind:class="'type-'+disc.type"></span></div>
                <!-- 
                <div class="discRarity">{{disc.rarity}}</div>
                <div class="discElement">{{disc.element}}</div>
                -->
                <div class="discImage"><img v-bind:src="'img/disc/icon/'+disc.id+'.png'"></div>
                <div class="discSkill">{{disc.descriptionEN}}</div>

            
            </div>
        
        </div>
    </div>
  
</div>
</template>
<style lang="scss" scoped>
.type{
 &-atk-l:before {content:'ATK (Long Distance)'}
 &-atk-s:before {content:'ATK (Short Distance)'}
 &-atk-r:before {content:'ATK (Rush)'}
 &-atk-c:before {content:'ATK (Circumference)'}
 &-warp:before {content:'WARP'}
 &-buff:before {content:'BUFF'}
 &-move:before {content:'MOVE'}
 &-heal:before {content:'HEAL'}
 &-trap:before {content:'TRAP'}
}
#discQueryHolder {
  display:flex;
  flex-direction: row;
  fieldset {
    display:inline-block;
  }
}
.discGridContainer {
    background-color:#f5f5f5;
}
.discGrid {
  display:grid;
  grid-template-columns: repeat(5, 1fr);
  margin-top:10px;
  padding:10px;
  grid-gap:5px;
}
.discWrapper {
    display:grid;
    background-color:rgb(250,250,250);
    .discName, .discType, .discElement, .discRarity, .discSkill {
          padding-top:5px; padding-bottom:5px;
    }
    grid-template-rows:2em 2em 220px 1fr;
    grid-template-areas: 
    "discName discName" 
    "discType discType" 
    "discImage discImage" 
    "discSkill discSkill";
    .discName { grid-area:discName;
        background-color:rgb(5,5,5);
        color:rgb(245,245,245);
        font-weight: bold;
    }
    .discType { grid-area:discType;
    }
    .discElement { 
        grid-area:discElement;
        text-transform:capitalize;}
    .discRarity { 
        grid-area:discRarity;
        text-transform:uppercase;
    }
    .discImage { 
        grid-area:discImage;
        background-color:rgb(230,230,230);
        height:220px;
        padding-top:10px;
        img {
            height:200px;
        }
    }
    .discSkill { grid-area:discSkill;
        align-self: stretch;
        background-color:rgb(245,245,245);
        padding-left:5px;
        padding-right:5px;
    
    }
    

}
@media screen and (max-width:769px) {
    .discGrid {
        display:grid;
        grid-template-columns: repeat(4, 1fr);
    }
}
@media screen and (max-width:426px) {
    .discGrid {
        display:grid;
        grid-template-columns: repeat(2, 1fr);
    }
}
@media screen and (max-width:321px) {
    .discGrid {
        display:grid;
        grid-template-columns: repeat(1, 1fr);
}


}
</style>
<script>
import axios from 'axios';
import _ from 'lodash';
export default {
      data(){
    return{
      typeLists:['atk-l','atk-s','atk-c','atk-r','warp','move','trap','heal'],
      elementLists:['fire','water','wind'],
      rarityLists:['ur','sr','r','n'],
      rarity:'',
      type: '',
      element: '',
      discs:[]
    }
  },
    async created(){
    try{
        const res = await axios.get('json/discs.json');
        this.discs = res.data.discs;
        console.log(res.data);
    }
    catch(e){
      console.error(e);
    }
  },
  computed:{
    filterdisc(){
      var vm = this, discs = vm.discs 
      return _.filter(discs, function(query){
        var 
            rarity = vm.rarity ? (query.rarity == vm.rarity) : true,
            type = vm.type ? (query.type == vm.type) : true,
            element = vm.element ? (query.element == vm.element) : true;
            
        return  type && element && rarity
      })
    }
  }




};


</script>