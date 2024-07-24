<script setup>
import { ref, onMounted, watch } from 'vue';
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LPopup, LCircle } from '@vue-leaflet/vue-leaflet';
import axios from 'axios';

const props = defineProps (['doRefreshClick']);

// env data
const bikeData = ref({});
const areaInfoList = ref([]);

const bikeJsonUrl =
    "https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json";
var lastDownloadTime = 0;
const downloadPeriod = 5000; // 5 second

const encapsulateData = (item, epoch) => {
    return {
        "sno": item.sno,
        "sna": item.sna.replace('YouBike2.0_', ''),
        "available_rent_bikes": item["available_rent_bikes"],
        "position": [item["latitude"], item["longitude"]],
        "epoch": epoch,
    };
};

const parseData = () => {
    if ((Date.now() - lastDownloadTime) < downloadPeriod) {
        console.log ("Bike Station Map: Update too quickly");
        return;
    }
    axios.get(bikeJsonUrl)
        .then((response) => {
            lastDownloadTime = Date.now();
            const areaInfoListLocal = []
            response.data.forEach((item) => {
                areaInfoListLocal.push(
                    encapsulateData(item, lastDownloadTime));
                // use sno as key for bikeData
                bikeData[item.sno] = {
                    ...item,
                    sna: item.sna.replace('YouBike2.0_', ''),
                    position: [item.latitude, item.longitude],
                };
            });
            areaInfoList.value = areaInfoListLocal;
            console.log ("Bike Station Map: refresh it");
        })
        .catch((error) => {
            console.log ('error: ', error);
        })
}

// for map
const center = ref([25.04, 121.53]);
const zoom = ref(14);
const radius = ref(30);
const strokeWidth = ref(5);
const fill = ref(true);

const getUrl = () => {
  return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
};

const getPointColor = (item) => {
    if (item["available_rent_bikes"] > 10) {
        return "green";
    } else if (item["available_rent_bikes"] > 0) {
        return "orange";
    } else {
        return "red";
    }
};

onMounted (() => {
    parseData();
});

watch (() => props.doRefreshClick, () => {
    parseData();
});
</script>

<template>
    <div class="shadow-md shadow-slate-900 dark:shadow-slate-100
                rounded-lg mx-auto my-5 w-3/4 max-w-8xl border-2
                dark:border-zinc-600 dark:bg-zinc-800">
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