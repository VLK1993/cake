<template>
  <div>
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
  name:'app',
  data(){
    return{
      todos:[]
    }
  },
  created(){
    try{
      const res = axios.get();
      
    }

  }
}
</script>