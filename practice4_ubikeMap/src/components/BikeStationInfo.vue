<script setup>
import StationDropdownInfo from './StationDropdownInfo.vue';

// for local usage
import bikeRawData from '../assets/ubike.json';


</script>

<template>
    <h1>YouBike Information</h1>
    <StationDropdownInfo :bikeRawData="bikeRawData"/>
</template>

<style scoped>
</style>