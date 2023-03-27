<template>
  <div class="navbar" id="navbar">
  </div>
</template>

<script>
export default {
  name: 'NavBar'
}
</script>

<style scoped>
.navbar {
  width: 100%;
  height: 68px;
  background-color: black;
  padding-left: 55px;
  padding-right: 55px;
  display: flex;
  align-items: center;
  color: white;
  position: absolute;
  top: 0;
  z-index: 1000;
}
</style>