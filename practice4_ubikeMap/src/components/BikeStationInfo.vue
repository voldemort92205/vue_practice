<script setup>
import { ref } from 'vue';
import StationDropdownInfo from './StationDropdownInfo.vue';
//import BikeStationMapInfo from './BikeStationMapInfo.vue';
import BikeStationMapInfov2 from './BikeStationMapInfov2.vue';
import RefreshPage from './RefreshPage.vue';

const doRefreshClick = ref(false);

const handleRefresh = () => {
    doRefreshClick.value = !doRefreshClick.value;
};

</script>

<template>
    <StationDropdownInfo :doRefreshClick="doRefreshClick" />
    <BikeStationMapInfov2 :doRefreshClick="doRefreshClick" />
    <RefreshPage @handleRefresh="handleRefresh" />
</template>

<style scoped>
</style>