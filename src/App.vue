<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/kicker">Kicker</router-link>
      <router-link to="/disc">Disc</router-link>
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 20px;
  background-color:rgb(50,50,50);
  a {
    font-weight: bold;
    color: rgb(150,150,150);
    text-transform:uppercase;
    padding-left:2vw;
    padding-right:2vw;
    font-weight:bold;
    text-decoration: none;
    font-family:Verdana;
    font-size: calc(20px + (25 - 20) * ((100vw - 300px) / (1600 - 300)));
    &.router-link-exact-active {
      color: rgb(250,250,250);
    }
  }
}
</style>
