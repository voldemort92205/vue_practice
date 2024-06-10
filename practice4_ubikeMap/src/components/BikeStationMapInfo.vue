<script setup>
import {ref} from 'vue';

const props = defineProps (['bikeRawData']);


// for data
let bikeData = ref({});
let areaInfoList = [];

const encapsulateData = (item) => {
    return {
        "sno": item.sno,
        "sna": item.sna.replace('YouBike2.0_', ''),
        "available_rent_bikes": item["available_rent_bikes"],
        "position": [item["longitude"], item["latitude"]],
    };
};

props.bikeRawData.forEach ((item) => {
    areaInfoList.push(encapsulateData(item));

    // use sno as key for bikeData
    bikeData[item.sno] = {
        ...item,
        sna: item.sna.replace('YouBike2.0_', ''),
        position: [item.longitude, item.latitude],
    };
})

// for map
const center = ref([121.55, 25.06]);
const projection = ref("EPSG:4326");
const zoom = ref(15);
const rotation = ref(0);
const radius = ref(6);
const strokeWidth = ref(3);
const stroke = ref("green");
const fill = ref("#ffffff");

</script>

<template>
    <div class="shadow-2xl shadow-slate-600 rounded-lg
                mx-auto my-10 w-3/4 max-w-8xl">
        <div class="text-4xl py-4 font-black"> Map</div>
        <div class="p-2 pb-3">
            <ol-map
                style="height: 600px; width: 100%;"
                >
                <ol-view
                    ref="view"
                    :center="center"
                    :rotation="rotation"
                    :zoom="zoom"
                    :projection="projection"
                />
                <ol-tile-layer>
                    <ol-source-osm />
                </ol-tile-layer>

                <ol-animated-clusterlayer
                    :animationDuration="500"
                    :distance="40"
                >
                    <ol-source-vector ref="vectorsource">
                        <ol-feature v-for="item in areaInfoList" :key="item['sno']">
                            <ol-geom-point
                                :coordinates="item['position']"
                            ></ol-geom-point>

                        </ol-feature>
                    </ol-source-vector>
                    <ol-style>
                        <ol-style-circle :radius="radius">
                            <ol-style-fill :color="fill"></ol-style-fill>
                            <ol-style-stroke
                                :color="stroke" :width="strokeWidth"
                                ></ol-style-stroke>
                        </ol-style-circle>
                    </ol-style>
                </ol-animated-clusterlayer>
            </ol-map>
        </div>
    </div>
</template>

<style scoped>
</style>