<script setup>
import { onMounted, reactive, ref, watch } from 'vue';

import SimpleCircleMap from './SimpleCircleMap.vue';
import SimpleProgressBarCircle from './SimpleProgressBarCircle.vue';

const props = defineProps ({
  dataset: {
    type: Array,
    default: [],
  },
  refreshTime: {
    type: String,
    default: "Null",
  },
});

const rainfallLevelDesc = [
    "無雨： 24小時累積雨量為0毫米",
    "小雨： 24小時累積雨量達0.01毫米以上 (自定義)",
    "中雨： 24小時累積雨量達30毫米以上 (自定義)",
    "大雨： 24小時累積雨量達80毫米以上",
    "豪雨： 24小時累積雨量達200毫米以上",
    "大豪雨： 24小時累積雨量達350毫米以上",
    "超大豪雨： 24小時累積雨量達500毫米以上",
]

/* rainfall level
量範圍（mm）	顏色代碼	顏色說明
0            white     沒下雨
0.001 - 30	#4575b4	藍色（小雨）
30 - 80	#91cf60	綠色（中雨）
80 - 200	#fee08b	黃色（大雨）
200 - 350	#fc8d59	橘色（豪雨）
350 - 500	#d73027	紅色（大豪雨）
> 500	#7f0000	深紅（超大豪雨）
*/

const rainfallLevelClass = {
    "無雨": {color: "#505050", level: 0},
    "小雨": {color: "#4575b4", level: 0.001},
    "中雨": {color: "#91cf60", level: 30},
    "大雨": {color: "#fee08b", level: 80},
    "豪雨": {color: "#fc8d59", level: 200},
    "大豪雨": {color: "#d73027", level: 350},
    "超大豪雨": {color: "#7f0000", level: 500},
}

const rainfallLevelLegend = Object.keys(rainfallLevelClass).map((key) => {
    return {
        "color": rainfallLevelClass[key].color,
        "name": key,
    };
}).filter((item) => item.name !== "無雨")

const rainfallLevelList = reactive({});
const rainfallLevelMapInfo = reactive([]);
const rainfallLevelProgressInfo = reactive([]);
const refreshTime = ref("Null");

const zoomInRadius = reactive({
    9: 6,
    10: 7,
    11: 7,
    12: 9,
    13: 9,
    14: 10,
    15: 11,
})

const updatDataset = () => {
    const rainfallKey = "Past24hr";
    const remoteData = props.dataset;
    const nData = remoteData.length

    for (const key in rainfallLevelList)
    {
        delete rainfallLevelList[key];
    }
    for (const key in rainfallLevelClass)
    {
        const level = rainfallLevelClass[key];
        rainfallLevelList[key] = reactive({
            dataset:[],
            class: key,
            color: level.color,
            totalCount: remoteData.length,
        })
    }

    const reversedKey = Object.keys(rainfallLevelClass).reverse();
    remoteData.forEach((item) => {
        const rainfall = item.RainfallElement[rainfallKey].Precipitation;
        let rainLevel = "無雨"
        for (const key of reversedKey)
        {
            if (rainfall === 0.0)
            {
                break;
            }
            if (rainfall >= rainfallLevelClass[key].level)
            {
                rainLevel = key;
                break;
            }
        }
        rainfallLevelList[rainLevel]["dataset"].push({
            StationName: item.StationName,
            StationId: item.StationId,
            GeoInfo: item.GeoInfo,
            y: rainfall,
        })
    })

    rainfallLevelMapInfo.splice(0, rainfallLevelMapInfo.length);
    Object.keys(rainfallLevelClass).forEach((key) => {
        if (key === "無雨")
            return;
        rainfallLevelList[key].dataset.forEach((item) => {
            const obj = {};

            obj["lat"] = item.GeoInfo.Coordinates[0].StationLatitude;
            obj["lon"] = item.GeoInfo.Coordinates[0].StationLongitude;
            obj["fillColor"] = rainfallLevelList[key].color;
            obj["color"] = rainfallLevelList[key].color;
            obj["color"] = "black"
            obj["message"] = item.GeoInfo.CountyName + "/" + item.GeoInfo.TownName + " (rainfall: " + item.y + ")";
            obj["radius"] = 5;
            obj["weight"] = 1;

            rainfallLevelMapInfo.push(obj)
        })
    })

    rainfallLevelProgressInfo.splice(0, rainfallLevelProgressInfo.length);
    Object.keys(rainfallLevelClass).forEach((key) => {
        rainfallLevelProgressInfo.push({
            "legend": key,
            "value": rainfallLevelList[key].dataset.length,
            "total": nData,
            "color": rainfallLevelClass[key].color,
        })
    });

    refreshTime.value = props.refreshTime;
}

onMounted (() => {
    updatDataset();
});

watch (() => props, () => {
    updatDataset();
}, {deep: true});

const isCommentOpen = ref(false);

</script>

<template>
    <div class="my-5 py-5">
        <div class="text-3xl font-semibold">
            雨量觀測站
        </div>
        <div class="text-lg">
            Last Refresh Time: {{ refreshTime }}
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 py-5">
            <div class="h-140 w-120 mx-auto">
                <SimpleCircleMap
                    :mapCenterLat="23.6"
                    :mapCenterLon="121.05"
                    :mapZoom = 7
                    :mapCircleData=rainfallLevelMapInfo
                    :mapLegends = rainfallLevelLegend
                    mapId = "rainfallLevelContainer"
                    :zoomInRadius = zoomInRadius
                    class="border border-white"
                    >
                </SimpleCircleMap>
            </div>

            <div class="grid grid-cols-3 md:grid-cols-2 xl:grid-cols-4 mx-auto my-5">
                <SimpleProgressBarCircle
                    v-for="(item, key) in rainfallLevelProgressInfo" :key="key+'-progress'"
                    :imageId="item.legend + '-progressbar-circle'"
                    :currentProgress=item.value
                    :totalProgress=item.total
                    :title=item.legend
                    :color=item.color
                    class="mx-5 my-auto "
                    >
                </SimpleProgressBarCircle>
            </div>
        </div>

        <div class="my-5 text-left flex flex-col justify-center">
            <div class="mx-auto w-100">
                <div class="mx-auto text-center text-lg hover:bg-slate-200 rounded cursor-pointer hover:dark:bg-slate-500"
                     type="button" @click="isCommentOpen = !isCommentOpen"
                >
                        注1: 雨量定義
                </div>
                <transition name="expand-fade">
                <div v-show="isCommentOpen">
                    <div class="">降雨強度為以過去 24hr 的累積雨量做分類。</div>
                    <ul class="list-disc list-inside">
                        <li v-for="desc in rainfallLevelDesc"
                            class="cursor-pointer rounded  hover:bg-slate-200 hover:dark:bg-slate-500">
                            {{ desc }}
                        </li>
                    </ul>
                </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<style scoped>
.expand-fade-enter-active,
.expand-fade-leave-active {
  transition: all 1s ease;
  overflow: hidden;
}

.expand-fade-enter-from,
.expand-fade-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-fade-enter-to,
.expand-fade-leave-from {
  opacity: 1;
  max-height: 500px; /* larger than the content */
}
</style>