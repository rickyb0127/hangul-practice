<template>
  <NavBar />
  <div class="container">
    <DrawSurface />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';
import DrawSurface from './components/DrawSurface.vue';

export default {
  name: 'App',
  components: {
    NavBar,
    DrawSurface
  }
}
</script>

<style>
</style>
