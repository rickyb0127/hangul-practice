<template>
  <NavBar />
  <div class="container">
    <div class="welcome-text">
      <h2>Welcome to Hangul Practice</h2>
      <p>The goal of this application is to help with writing Hangul. To start, click the Audio button and listen for the word or phrase being spoken. Use your mouse to draw the correct characters inside the green box and then check your results.</p>
    </div>
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

<style scoped>
.welcome-text {
  color: white;
}
</style>
