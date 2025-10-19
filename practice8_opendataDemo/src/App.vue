<script setup>
import Header from './components/HeaderWithRouter.vue';
import Footer from './components/Footer.vue';

import { reactive } from 'vue';

const navLists = reactive([
  {
    name: "Home",
    linkUrl: "/"
  },
  {
    name: "AirQuality",
    linkUrl: "/airquality"
  },
  {
    name: "YouBike",
    linkUrl: "/youbikemap",
  },
  {
    name: "Weather",
    linkUrl: "/cwadataset",
  },
  {
    name: "FinancialIndex",
    linkUrl: "/financialview",
  }
])
</script>

<template>
  <div class="app-bgImage"></div>
  <Header
        headerMessage="Opendata Display"
        :routerInfo="navLists"
  />
  <div class="w-5/6 mx-auto rounded mt-3">
    <RouterView />
  </div>
  <Footer />
</template>

<style scoped>
</style>
