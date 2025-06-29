<script setup>
// update to correct path
import SimpleTable from "./SimpleTable.vue";
import { onMounted, reactive } from 'vue';
import SimpleCircleMap from "./SimpleCircleMap.vue";
import { useAQIStore } from "../stores/useAQIStore";
import SimpleTitleDisplay from "./SimpleTitleDisplay.vue";

const aqiStore = useAQIStore();

const tryToConvertToNumer = (input) => {
  // return empty data
  if (!input) return input;

  const output = Number(input);
  if (isNaN(output)) {
    return input;
  }
  return output;
}

const tableDataHeader = reactive([
  {"key": "sitename", "name": "測站名稱"}, 
  {"key": "county", "name": "縣市"},
  {"key": "publishtime", "name": "資料發布時間"},
  {"key": "status", "name": "狀態"},
  {"key": "aqi", "name": "空氣品質指標"},
  {"key": "pollutant", "name": "空氣污染指標物"},
  {"key": "so2", "name": "二氧化硫（ppb）"},
  {"key": "co", "name": "一氧化碳（ppm）"},
  {"key": "o3", "name": "臭氧（ppb）"},
  {"key": "o3_8hr", "name": "臭氧8小時移動平均（ppb）"},
  {"key": "pm10", "name": "懸浮微粒（μg\/m3）"},
  {"key": "pm2.5", "name": "細懸浮微粒（μg\/m3）"},
  {"key": "no2", "name": "二氧化氮（ppb）"},
  {"key": "nox", "name": "氮氧化物（ppb）"},
  {"key": "no", "name": "一氧化氮（ppb）"},
  {"key": "wind_speed", "name": "風速（m\/sec）"},
  {"key": "wind_direc", "name": "風向（degrees）"},
  {"key": "co_8hr", "name": "一氧化碳8小時移動平均（ppm）"},
  {"key": "pm2.5_avg", "name": "細懸浮微粒移動平均值（μg\/m3）"},
  {"key": "pm10_avg", "name": "懸浮微粒移動平均值（μg\/m3）"},
  {"key": "so2_avg", "name": "二氧化硫移動平均值（ppb）"},
]);

const mapDataInfo = reactive([]);
const updateMapDataInfo = (data) => {
  mapDataInfo.splice(0, mapDataInfo.length);

  data.forEach((item) => {
    const obj = {};
    obj["lat"] = item.latitude;
    obj["lon"] = item.longitude;

    var message = item.sitename + "測站 (";
    switch (item.status) {
      case "良好":
        obj["fillColor"] = "green";
        obj["color"] = "green";
        message += item.status + ")";
        break;
      case "普通":
        obj["fillColor"] = "orange";
        obj["color"] = "orange";
        message += item.status + ": " + item.pollutant + ")";
        break;
      default:
        obj["fillColor"] = "red";
        obj["color"] = "red";
        message += item.status + ": " + item.pollutant + ")";
        break;
    }
    obj["message"] = message;
    obj["radius"] = 5;
    obj["weight"] = 3;
    mapDataInfo.push(obj);
  });
}

const legendGroup = [
  {"color": "green", "name": "良好"},
  {"color": "orange", "name": "普通"},
  {"color": "red", "name": "對敏感族群不健康"},
]

const tableDataRecord = reactive([]);
const updateTableDataRecord = (data) => {
  tableDataRecord.splice(0, tableDataRecord.length);
  data.forEach ((item) => {
    const obj = {};
    for (const header of tableDataHeader) {
      if (header.key in item) {
        obj[header.key] = tryToConvertToNumer(item[header.key]);
      }
      else {
        obj[header.key] = "-"
      }
    }
    tableDataRecord.push(obj);
  })
}

const doRefresh = (forceUpdate = false) => {
  queryData(forceUpdate);
}
async function queryData (forceUpdate) {
  await aqiStore.fetchData(forceUpdate);
  updateTableDataRecord(aqiStore.dataSet);
  updateMapDataInfo(aqiStore.dataSet);
}

const toUpdateData = () => {
  doRefresh(true);
}

onMounted (() => {
  doRefresh();
})

</script>

<template>
  <div class="mx-auto relative">
    <SimpleTitleDisplay h1Title="空氣指標 (AQI)"/>
    <div>
      Last Refresh Time: {{ aqiStore.refreshTime }}
    </div>

    <div>
      <button type="button"
        class="mt-4 mb-2 mx-auto md:absolute md:top-10 md:right-5 flex flex-row rounded p-1 text-white sm:top-30"
        style="cursor: pointer;"
        :class="[aqiStore.isDownloading ? 'bg-slate-300' : 'bg-slate-600']"
        @click="toUpdateData"
      >
        <i class="fa-solid fa-arrows-rotate my-auto mx-1"></i>
        <p class="mx-1 my-auto">Reload</p>
      </button>
    </div>

    <!-- card view -->
    <div class="container ">
      <div class="text-3xl mb-2 mt-4">
        測站及空氣品質
        <i class="fa-solid fa-map-location-dot fa-lg"></i>
      </div>
      <div class="h-160 rounded mx-auto p-1 w-full max-w-4xl">
        <SimpleCircleMap
          :mapCenterLat="24.05"
          :mapCenterLon="121.05"
          :mapZoom = 7
          :mapCircleData = mapDataInfo
          :mapLegends = legendGroup
          mapId = "mapContainer"
          class="border border-white"
        />
      </div>
    </div>

    <div class="container">
      <div class="text-3xl mb-2 mt-4">
        測站資訊
      </div>
      <div class="bg-white h-180 rounded mx-auto my-6 p-1 max-w-5xl">
        <SimpleTable
          :columns="tableDataHeader"
          :data="tableDataRecord"
          tableWidth = "200px"
        />
      </div>
    </div>

    <p class="pt-1 pb-1 text-slate-200">
        Source: <a :href="aqiStore.dataUrlSrc" class="text-slate-200"> opendata </a>
    </p>
  </div>
</template>

<style scoped>
</style>
