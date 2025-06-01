<script setup>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import BikeStationInfo from './components/BikeStationInfo.vue';

</script>

<template>
  <div class="app-bgImage"></div>
  <Header />
  <div class="w-full mx-auto">
    <BikeStationInfo />
  </div>
  <Footer class="relative bottom-0 mx-auto w-5/6 bg-white/30" />
</template>

<style scoped>
</style>
