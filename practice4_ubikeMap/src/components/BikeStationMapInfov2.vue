<script setup>
import {ref} from 'vue';
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LPopup, LCircle } from '@vue-leaflet/vue-leaflet';

const props = defineProps (['bikeRawData']);

// for data
let bikeData = ref({});
let areaInfoList = [];

const encapsulateData = (item) => {
    return {
        "sno": item.sno,
        "sna": item.sna.replace('YouBike2.0_', ''),
        "available_rent_bikes": item["available_rent_bikes"],
        "position": [item["latitude"], item["longitude"]],
    };
};

props.bikeRawData.forEach ((item) => {
    areaInfoList.push(encapsulateData(item));

    // use sno as key for bikeData
    bikeData[item.sno] = {
        ...item,
        sna: item.sna.replace('YouBike2.0_', ''),
        position: [item.latitude, item.longitude],
    };
})

// for map
const center = ref([25.04, 121.53]);
const zoom = ref(14);
const radius = ref(30);
const strokeWidth = ref(5);
const fill = ref(true);

const getUrl = () => {
  return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
}

const getPointColor = (item) => {
    if (item["available_rent_bikes"] > 10) {
        return "green";
    } else if (item["available_rent_bikes"] > 0) {
        return "orange";
    } else {
        return "red";
    }
}
</script>

<template>
    <div class="shadow-2xl shadow-slate-600 rounded-lg
                mx-auto my-10 w-3/4 max-w-8xl">
        <div class="text-4xl py-4 font-black"> Map</div>
        <div class="p-4 w-full" style="height:600px">
            <l-map
                :zoom="zoom"
                :center="center">
                <l-tile-layer
                    :url="getUrl()"
                    layer-type="base">
                </l-tile-layer>
                <div v-for="item in areaInfoList" :key="item['sno']">
                    <l-circle
                        :lat-lng="item['position']"
                        :color="getPointColor(item)"
                        :radius="radius"
                        :fill="fill"
                        fill-color="white"
                        :weight="strokeWidth"
                        >
                        <l-popup class="text-base">
                            Name: {{item['sna']}}<br>
                            Available rent: {{item['available_rent_bikes']}}
                        </l-popup>
                    </l-circle>
                </div>
            </l-map>
        </div>
    </div>
</template>

<style scoped>
</style>