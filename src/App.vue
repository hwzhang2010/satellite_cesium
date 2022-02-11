<template>
  <div id="app">
    <!-- 
	<div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> 
	-->
    <router-view/>
  </div>
</template>

<style scoped lang="less">
html,
body,
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
  color: #2c3e50;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
</style>
