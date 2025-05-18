<script setup>
import { onMounted, ref } from 'vue';
import { LMap, LTileLayer, LCircle, LTooltip, LCircleMarker } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';

const props = defineProps ({
  mapCenterLat: {
    type: Number,
    default: 25.05,
  },
  mapCenterLon: {
    type: Number,
    default: 121.05,
  },
  mapZoom: {
    type: Number,
    default: 9,
  },
  mapCircleData: Array,
})

const mapData = ref([])

const updateMapData = () => {
  // use input data...
  mapData.value = props.mapCircleData.map((item) => {
    const obj = {};
    obj["latlon"] = [item.lat, item.lon];
    obj["color"] = item.color;
    obj["radius"] = item.radius;

    obj["fill"] = false;
    obj["fillColor"] = "white";
    if (item.fillColor) {
      obj["fill"] = true;
      obj["fillColor"] = item.fillColor;
    }

    obj["weight"] = item.weight;

    // assume there is message
    obj["message"] = item.message;

    return obj;
  })
}


onMounted (() => {
  updateMapData();
})


const zoom = ref(props.mapZoom);
const center = ref([props.mapCenterLat, props.mapCenterLon]);

// for map url
const tileUrl = ref('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
</script>

<template>
    <div class="w-full h-full p-4">
      <l-map :zoom="zoom" :center="center" :use-global-leaflet="false">
        <l-tile-layer :url="tileUrl"></l-tile-layer>
        <div v-for="(item, index) in mapData" :key="index">
          <l-circle-marker
            :lat-lng="item['latlon']"
            :radius="item.radius"
            :color="item.color"
            :fill-color="item.fillColor"
            :fill = "item.fill"
            :weight = "item.weight"
            :fillOpacity="0.8"
          >
          <l-tooltip class="text-base rounded-2xl">{{ item.message }}</l-tooltip>
          </l-circle-marker>
        </div>
      </l-map>
    </div>
</template>


<style scoped>
</style>