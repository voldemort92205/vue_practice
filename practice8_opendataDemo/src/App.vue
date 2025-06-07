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
    name: "Air Quality",
    linkUrl: "/airquality"
  },
  {
    name: "You Bike Map",
    linkUrl: "/youbikemap",
  }
])
</script>

<template>
  <div class="app-bgImage"></div>
  <Header class="sticky top-0 h-16"
        headerMessage="Opendata Display"
        :routerInfo="navLists"
  />
  <div class="w-4/5 mx-auto rounded mt-3">
    <RouterView />
  </div>
  <Footer class="relative bottom-0 mx-auto w-5/6 bg-white/50" />
</template>

<style scoped>
</style>
