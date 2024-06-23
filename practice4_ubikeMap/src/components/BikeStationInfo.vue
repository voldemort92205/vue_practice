<script setup>
import StationDropdownInfo from './StationDropdownInfo.vue';
//import BikeStationMapInfo from './BikeStationMapInfo.vue';
import BikeStationMapInfov2 from './BikeStationMapInfov2.vue';

// for local usage
import bikeRawData from '../assets/ubike.json';


</script>

<template>
    <StationDropdownInfo :bikeRawData="bikeRawData"/>
    <BikeStationMapInfov2 :bikeRawData="bikeRawData" />
</template>

<style scoped>
</style>