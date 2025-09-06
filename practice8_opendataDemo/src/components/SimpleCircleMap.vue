<script setup>
import { onMounted, reactive, ref, watch, onBeforeUnmount } from 'vue';
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
  zoomInRadius: {
    type: Object,
    default: {},
  },
  mapCircleData: Array,
  mapId: {
    type: String,
    required: true,
  },
  mapLegends: Array,
  onClick: {
    type: Function,
    default: null,

  }
})

const mapContainer = ref(null);
let mapInstance = null;

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
  const currentZoom = mapInstance.getZoom();
  const anotherZoom = currentZoom in props.zoomInRadius;

  mapData.value = props.mapCircleData.map((item) => {
    const obj = {};
    obj["latlon"] = [item.lat, item.lon];
    obj["color"] = item.color;
    obj["radius"] = anotherZoom ? props.zoomInRadius[currentZoom]: item.radius;

    obj["fill"] = false;
    obj["fillColor"] = "white";
    if (item.fillColor) {
      obj["fill"] = true;
      obj["fillColor"] = item.fillColor;
    }

    obj["weight"] = item.weight;

    // assume there is message
    obj["message"] = item.message;

    obj["original"] = item;

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

const refreshMap = () => {
  if (mapInstance)
  {
    mapDataIcons.forEach((item) => {
      if (mapInstance.hasLayer(item))
      {
        item.remove();
      }
    })
  }
  mapDataIcons.splice(0, mapDataIcons.length);
  updateMapData();
  mapData.value.forEach((item) => {
    const localIcon = L.circleMarker(item.latlon, {
      radius: item.radius,
      stroke: true,
      color: item.color,
      fillColor: item.fillColor,
      fill: item.fill,
      weight: item.weight,
      opacity: 0.9,
      fillOpacity: 0.9,
    })
    .bindTooltip(item.message).openTooltip()
    .addTo(mapInstance);


    if (props.onClick)
    {
      localIcon.on("click", (e) => {
        props.onClick(item.original);
      })
    }

    mapDataIcons.push(localIcon);
  });
}

const initMap = () => {
  if (!mapContainer.value)
  {
    console.log ("map container is not initialized...");
    return;
  }
  // update Map
  mapInstance = L.map(mapContainer.value, {
    center: center.value,
    zoom: zoom.value,
    scrollWheelZoom: false,
  })
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(mapInstance);

  mapInstance.on("zoomend", refreshMap);
}

onMounted (() => {
  updateLegend();
  initMap();
});

onBeforeUnmount (() => {
  if (mapInstance)
  {
    mapInstance.remove();
    mapInstance = null;
  }
})

const legendColors = reactive([]);
const updateLegend = () => {
  legendColors.splice(0, legendColors.length);
  props.mapLegends.forEach((colorInfo) => {
    const obj = {...colorInfo};
    const key = colorInfo.color;
    if (key in colorMap)
    {
      obj["colorPredefined"] = colorMap[key];
      obj["color"] = "";
    }
    else
    {
      obj["colorPredefined"] = "";
    }
    legendColors.push(obj)
  })
}

watch(() => props.mapLegends, () => {
  updateLegend();
}, {deep: true})

</script>

<template>
  <div class="w-full h-full relative">
    <!-- legend -->
    <div class="absolute flex flex-col top-0 right-0 z-2 bg-slate-50/60" v-if="props.mapLegends">
      <div class="flex flex-row mx-2" v-for="legend in legendColors">
        <div class="w-3 h-3 rounded-full my-auto" :class="legend.colorPredefined"
            :style="'background-color:' + legend.color"></div>
        <div class="mx-1 text-slate-700">{{ legend.name }}</div>
      </div>
    </div>
    <!-- map -->
    <div class="relative w-full h-full z-1" :id="props.mapId" ref="mapContainer"></div>
  </div>
</template>

<style scoped>
</style>