<template>
  <div id="app-todo">
    <h1>Todos</h1>
      <ul>
        <li v-for="todo of todos" :key="todo.id">
          {{todo.name}}
        </li>

      </ul>
  </div>
</template>

<script>
import axios from 'axios';

//import todos from '/json/todos.json';

export default {
  name:'app-todo',
  data(){
    return{
      todos:[
        
      ]
    }
  },
  async created(){
    try{
      const res = await axios.get('https://vlk1993.github.io/cake/dist/json/todos.json');
      this.todos = res.data;

    }
    catch(e){
      console.error(e);
    }
  }

  
}
</script>