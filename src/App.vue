<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
html,
body {
  height: 100%;
  width: 100%;
  margin: 0px;
  padding: 0px;
}

#app {
  min-height: 100%;
}

.wind-layer {
  height: 100%;
  width: 100%;
  display: none;
  background: transparent;
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  /* z-index: 100; */
  pointer-events: none;
}
</style>
