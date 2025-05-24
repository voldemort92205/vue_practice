<script setup>
import AirQualityView from './components/AirQuality.vue';
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <div class="app-bgImage"></div>
  <Header class="sticky top-0 h-16"/>
  <div class="w-4/5 mx-auto rounded mt-3">
    <AirQualityView />
  </div>

  <Footer class="relative bottom-0 mx-auto w-5/6 bg-white/50" />
</template>

<style scoped>
</style>
