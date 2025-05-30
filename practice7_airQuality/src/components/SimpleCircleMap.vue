<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
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
  },
  mapLegends: Array,
})

// pre-defined variables
// TODO: support more colors
const colorMap = {
  "green": "bg-green-500",
  "red": "bg-red-500",
  "orange": "bg-orange-500",
}

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
};

watch (() => props.mapCircleData, () => {
    refreshMap();
  }, {deep: true}
);

const zoom = ref(props.mapZoom);
const center = ref([props.mapCenterLat, props.mapCenterLon]);
const mapDataIcons = reactive([]);
const map = ref(null);

const refreshMap = () => {
  updateMapData();
  mapDataIcons.splice(0, mapDataIcons.length);
  mapData.value.forEach((item) => {
    const localIcon = L.circleMarker(item.latlon, {
      radius: item.radius,
      color: item.color,
      fillColor: item.fillColor,
      fill: item.fill,
      weight: item.weight,
      opacity: 0.9,
      fillOpacity: 0.9,
    })
    .bindTooltip(item.message).openTooltip()
    .addTo(map.value);

    mapDataIcons.push(localIcon);
  });
}

const initMap = () => {
  // update Map
  map.value = L.map(props.mapId, {
    center: center.value,
    zoom: zoom.value,
    scrollWheelZoom: false,
  })
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map.value);
}

onMounted (() => {
  initMap();
})
</script>

<template>
  <div class="w-full h-full relative">
    <!-- legend -->
    <div class="absolute flex flex-col top-0 right-0 z-2 bg-slate-50/60" v-if="props.mapLegends">
      <div class="flex flex-row mx-2" v-for="legend in props.mapLegends">
        <div class="w-3 h-3 rounded-full my-auto" :class="colorMap[legend.color]"></div>
        <div class="mx-1 text-slate-700">{{ legend.name }}</div>
      </div>
    </div>
    <!-- map -->
    <div class="relative w-full h-full z-1" :id="props.mapId"></div>
  </div>
</template>


<style scoped>
</style>