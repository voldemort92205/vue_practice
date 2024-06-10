<script setup>
import StationDropdownInfo from './StationDropdownInfo.vue';
import BikeStationMapInfo from './BikeStationMapInfo.vue';

// for local usage
import bikeRawData from '../assets/ubike.json';


</script>

<template>
    <StationDropdownInfo :bikeRawData="bikeRawData"/>
    <!--
    <BikeStationMapInfo :bikeRawData="bikeRawData" />
    -->
</template>

<style scoped>
</style>