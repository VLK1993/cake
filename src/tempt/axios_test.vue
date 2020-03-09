<template>
  <div id="app-todo">
    <h1>Todos</h1>
      <ul>
        <li v-for="valk of valks" :key="valk.id">
          <div class="character">
            <ul>
              <li v-for="character of valk.characters" :key="character.id">
                <div class="characterImage">
                  <img v-bind:src="'/img/list/'+valk.id+'_'+character.id+'.png'">
                </div>
                <div class="characterType">{{character.type}}</div>
              </li>
            </ul>
            <div class="characterName">{{valk.name}}</div>
          </div>
          
        </li>

      </ul>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name:'app-todo',
  data(){
    return{
      valks:[]
    }
  },
  async created(){
    try{
      const res = await axios.get('https://vlk1993.github.io/cake/docs/json/kickers.json');
      this.valks = res.data.valks;
    }
    catch(e){
      console.error(e);
    }
  }

  
}
</script>