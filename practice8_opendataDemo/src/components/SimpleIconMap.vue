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
  dataset: Array,
  imageId: {
    type: String,
    required: true,
  },
  mapLegends: {
    type: Array,
    default: [],
  },
  mapIconSize: {
    type: Number,
    default: 25,
  }
})

const mapContainer = ref(null);
let mapInstance = null;

// pre-defined variables
// TODO: support more colors
const mapData = reactive([]);
const iconObjs = reactive({});

const updateMapData = () => {
  if (! mapInstance)
  {
    console.log ("map instance is not initialized...");
    return ;
  }

  mapData.splice(0, mapData.length);

  props.dataset.forEach((item) => {
    const obj = {};
    obj["latlon"] = [item.lat, item.lon];
    const iconStr = item.iconStr;
    if (! (iconStr in iconObjs))
    {
      iconObjs[item.iconStr] = L.divIcon({
        html: iconStr,
        class: 'weather-icon',
        iconSize: [props.mapIconSize, props.mapIconSize]
      });
    }
    obj["iconDiv"] = iconObjs[iconStr];
    obj["message"] = item.message;
    mapData.push(obj);
  })
};

watch (() => props.dataset, () => {
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

  mapData.forEach((item) => {
    const localIcon = L.marker(item.latlon, {
      icon: item.iconDiv,
    })
    .bindTooltip(item.message).openTooltip()
    .addTo(mapInstance);

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

  /*
  L.tileLayer("https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; <a href='https://www.stadiamaps.com/'>Stadia Maps</a> &copy; <a href='https://openmaptiles.org/'>OpenMapTiles</a>",
  }).addTo(mapInstance);
  */
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
  props.mapLegends.forEach((info) => {
    const obj = {...info};
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
        <!--
        <div class="w-3 h-3 rounded-full my-auto" :class="legend.colorPredefined"
            :style="'background-color:' + legend.color"></div>
        -->
        <div v-html="legend.iconStr"></div>
        <div class="mx-1 text-slate-700">{{ legend.name }}</div>
      </div>
    </div>
    <!-- map -->
    <div class="relative w-full h-full z-1" :id="props.imageId" ref="mapContainer"></div>
  </div>
</template>

<style scoped>

:deep(.leaflet-div-icon) {
  background: transparent !important;
  border: none !important;
}
</style>