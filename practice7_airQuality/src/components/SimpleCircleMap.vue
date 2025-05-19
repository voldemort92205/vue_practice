<script setup>
import { onMounted, ref } from 'vue';
import L from "leaflet";
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
  mapId: {
    type: String,
    required: true,
  }
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

const zoom = ref(props.mapZoom);
const center = ref([props.mapCenterLat, props.mapCenterLon]);

const refreshMap = () => {
  updateMapData();

  // update Map
  const map = L.map(props.mapId, {
    center: center.value,
    zoom: zoom.value,
    scrollWheelZoom: false,
  })
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  mapData.value.forEach((item) => {
    L.circleMarker(item.latlon, {
      radius: item.radius,
      color: item.color,
      fillColor: item.fillColor,
      fill: item.fill,
      weight: item.weight,
      opacity: 0.9
    })
    .bindTooltip(item.message).openTooltip()
    .addTo(map);
  })
}

onMounted (() => {
  refreshMap();
})
</script>

<template>
    <div class="w-full h-full" :id="props.mapId"></div>
</template>


<style scoped>
</style>