<template>
  <div class="row">
    <h1>Hi Axios</h1>

    <div class="col4">
      <button v-on:click="changeColor">Change Color</button>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
export default {
  name: "changebackground",
  methods: {
    changeColor() {
      $("body").removeClass();
      $("body").addClass("bg-dark");
    }
  }
};
</script>
<style>
.bg-dark {
  background-color: black;
}
</style>
