<script setup>

// update to correct path
import qualityData from "../airqualityData.json";
import SimpleTable from "./SimpleTable.vue";
import { reactive } from 'vue';
import SimpleCircleMap from "./SimpleCircleMap.vue";

const dataUrl = "https://data.gov.tw/dataset/40448";

const monitorData = reactive(
  qualityData.records.map((item) => {return item})
);

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

const mapDataInfo = reactive (
  monitorData.map((item) => {
    const obj = {};
    obj["lat"] = item.latitude;
    obj["lon"] = item.longitude;

    if (item.pollutant) {
      obj["fillColor"] = "red"
      obj["color"] = "red"

    }
    else
    {
      obj["fillColor"] = "green";
      obj["color"] = "green";
    }
    obj["radius"] = 200;
    obj["weight"] = 6;

    obj["message"] = item.sitename + "測站 (" + item.status + ")";

    return obj;
  })
)

const tableDataRecord = reactive(
  monitorData.map ((item) => {
    const obj = {};
    for (const header of tableDataHeader) {
      if (header.key in item) {
        obj[header.key] = tryToConvertToNumer(item[header.key]);
      }
      else {
        obj[header.key] = "-"
      }
    }
    return obj;
}));
</script>

<template>
  <div class="w-9/10 mx-auto pb-8">
    <div class="text-3xl font-bold underline py-6">
      Air Quality Data
    </div>

    <!-- card view -->
    <div class="map-card bg-white h-160 rounded">
      <SimpleCircleMap
        :mapCenterLat="24.05"
        :mapCenterLon="121.05"
        :mapZoom = 7
        :mapCircleData = mapDataInfo
      />
    </div>

    <div class="table-card bg-white h-180 rounded-lg">
      <SimpleTable
        :columns="tableDataHeader"
        :data="tableDataRecord"
        tableWidth = "200px"
        class="p-3"
      />
      <p class="pt-2 pb-2">
        Source: <a :href="dataUrl"> opendata </a>
      </p>
    </div>
  </div>
</template>

<style scoped>
</style>
