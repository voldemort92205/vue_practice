<script setup>
import SimpleFigureView from './SimpleFigureView.vue';
import SimpleTitleDisplay from './SimpleTitleDisplay.vue';
import { onMounted, reactive, ref } from 'vue';
import { useCWAStore } from '../stores/useCWAStore.js';
import SimpleSourceView from './SimpleSourceView.vue';
import SimpleLoadingEffect from './SimpleLoadingEffect.vue';
import SimpleProgressBarCircle from './SimpleProgressBarCircle.vue';
import SimpleCircleMap from './SimpleCircleMap.vue';
import SimpleIconMap from './SimpleIconMap.vue';

const cwaStore = useCWAStore();

// change refresh time
const isStoreUpdate = ref(false);
const webRefreshTime = ref("TBD");
const preDownload = () => {
    isStoreUpdate.value = true;
    webRefreshTime.value = "Refreshing...";
}
const postDownload = (timeStamp = "Null") => {
    isStoreUpdate.value = false;
    webRefreshTime.value = timeStamp;
}

const figureLists = reactive({});
const updateFigureLists = (timeStamp = "Null") => {
    for (const key in figureLists){
        delete figureLists[key];
    }
    cwaStore.dataSet.forEach ((item) => {
        const key = item.class;
        const output = {
            figSrc: item.figSrc,
            title: item.title
        };

        if (key in figureLists)
        {
            figureLists[key].push(output);
        }
        else
        {
            figureLists[key] = [output]
        }
    })
    postDownload(timeStamp);
}

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

const handleRainfallLevel = () => {
    const rainfallKey = "Past24hr";
    const remoteData = cwaStore.dataSetRainfall[0].dataset;
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
    })
}

const updateRainfallList = (timeStamp = "Null") => {
    handleRainfallLevel();
};

const weatherTypeSet = reactive([]);
const weatherTypeProgressInfo = reactive([]);
const getWeatherIcon = (weatherType) => {
  const size = 17;
  let iconHtml = "";

  switch (weatherType) {
    case "晴":
      iconHtml = `<i class="fas fa-sun" style="color:#FFA500;font-size:${size}px;"></i>`;
      break;

    case "晴有靄":
      iconHtml = `
        <div style="position: relative;">
          <i class="fas fa-smog" style="color:#B0BEC5;font-size:${size - 4}px; position:absolute; left:2px; top:14px;"></i>
          <i class="fas fa-sun" style="color:#FFA500;font-size:${size}px;"></i>
        </div>`;
      break;

    case "多雲":
      iconHtml = `<i class="fas fa-cloud" style="color:#90A4AE;font-size:${size}px;"></i>`;
      break;

    case "陰":
      iconHtml = `<i class="fas fa-cloud" style="color:#37474F;font-size:${size}px;"></i>`;
      break;

    case "多雲有靄":
      iconHtml = `
        <div style="position: relative;">
          <i class="fas fa-smog" style="color:#B0BEC5;font-size:${size - 4}px; position:absolute; left:2px; top:14px;"></i>
          <i class="fas fa-cloud" style="color:#90A4AE;font-size:${size}px;"></i>
        </div>`;
      break;

    case "多雲有雨":
      iconHtml = `<i class="fas fa-cloud-showers-heavy" style="color:#90A4AE;font-size:${size}px;"></i>`;
      break;

    case "多雲有雷雨":
      iconHtml = `
        <div style="position: relative;">
          <i class="fas fa-bolt" style="color:#FF9800;font-size:${size - 4}px; position:absolute; left:6px; top:14px;"></i>
          <i class="fas fa-cloud-showers-heavy" style="color:#90A4AE;font-size:${size}px;"></i>
        </div>`;
      break;

    case "多雲有雷":
      iconHtml = `
        <div style="position: relative;">
          <i class="fas fa-bolt" style="color:#FF9800;font-size:${size - 4}px; position:absolute; left:6px; top:14px;"></i>
          <i class="fas fa-cloud" style="color:#90A4AE;font-size:${size}px;"></i>
        </div>`;
      break;

    case "陰有雷雨":
      iconHtml = `
        <div style="position: relative;">
          <i class="fas fa-bolt" style="color:#FF9800;font-size:${size - 4}px; position:absolute; left:6px; top:14px;"></i>
          <i class="fas fa-cloud-showers-heavy" style="color:#37474F;font-size:${size}px;"></i>
        </div>`;
      break;

    case "晴有雷":
      iconHtml = `
        <div style="position: relative;">
          <i class="fas fa-bolt" style="color:#FF9800;font-size:${size - 6}px; position:absolute; left:10px; top:14px;"></i>
          <i class="fas fa-sun" style="color:#FFA500;font-size:${size}px;"></i>
        </div>`;
      break;

    case "陰有雷":
      iconHtml = `
        <div style="position: relative;">
          <i class="fas fa-bolt" style="color:#FF9800;font-size:${size - 4}px; position:absolute; left:6px; top:14px;"></i>
          <i class="fas fa-cloud" style="color:#37474F;font-size:${size}px;"></i>
        </div>`;
      break;

    default:
      iconHtml = `<i class="fas fa-question" style="color:#AAAAAA;font-size:${size}px;"></i>`;
  }
  return iconHtml;
}

const weatherType = ["晴","晴有靄", "晴有雷", "多雲", "多雲有靄",  "多雲有雨", "多雲有雷雨", "多雲有雷", "陰", "陰有雷雨", "陰有雷"]
const weatherLegends = weatherType.map((kind) => {
    return {
        iconStr: getWeatherIcon(kind),
        name: kind,
    };
});


const handleWeatherData = () => {
    const elements = new Set();

    const typeStatistic = {};
    weatherType.forEach((item) => {
        typeStatistic[item] = {count: 0};
    })

    weatherTypeSet.splice(0, weatherTypeSet.length);
    cwaStore.dataSetWeatherMonitor.dataset.forEach((item) => {
        if (item.WeatherElement.Weather === "-99")
        {
            return;
        }
        const weatherKey = item.WeatherElement.Weather;
        weatherTypeSet.push({
            lat: item.GeoInfo.Coordinates[0].StationLatitude,
            lon: item.GeoInfo.Coordinates[0].StationLongitude,
            //weather: item.WeatherElement.Weather,
            iconStr: getWeatherIcon(weatherKey),
            iconSize: [30, 30],
            name: item.GeoInfo.CountyName + "-" + item.GeoInfo.TownName,
            message: item.GeoInfo.CountyName + "-" + item.StationName + ": " + item.WeatherElement.Weather,
        });

        typeStatistic[weatherKey].count += 1;
        elements.add(item.WeatherElement.Weather);
    });

    let total = 0;
    weatherType.forEach((item) => {
        total += typeStatistic[item].count;
    });

    weatherTypeProgressInfo.splice(0, weatherTypeProgressInfo.length);
    weatherType.forEach((item) => {
        weatherTypeProgressInfo.push({
            legend: item,
            value: typeStatistic[item].count,
            total: total,
            color: "blue"
        });
    });
    console.log (elements);
}

const updateWeatherMonitorList = (timeStamp = "Null") => {
    handleWeatherData();
}

async function fetchDataSet(forceUpdate = false) {
    await cwaStore.initFetchSet(forceUpdate);
    updateFigureLists(cwaStore.refreshTimeFigures);
    updateRainfallList(cwaStore.refreshTimeRainfall);
    updateWeatherMonitorList(cwaStore.refreshTimeWeatherMonitor);
}

async function fetechFigures() {
    await cwaStore.fetchFigures(true);
    await cwaStore.fetchRainfallData(true);
    await cwaStore.fetchWeatherMonitorData(true);
    updateFigureLists(cwaStore.refreshTimeFigures);
    updateRainfallList(cwaStore.refreshTimeRainfall);
    updateWeatherMonitorList(cwaStore.refreshTimeWeatherMonitor);
}

const refreshDataSet = (forceUpdate = false) => {
    preDownload();
    fetchDataSet (forceUpdate);
}

const toUpdateData = () => {
    preDownload();
    fetechFigures();
}


onMounted (() => {
    refreshDataSet();
})
</script>

<template>
    <div class="relative">
        <SimpleTitleDisplay h1Title="CWA Dataset" />
        <div class="text-xl">
            Last Refresh Time: {{ webRefreshTime }}
        </div>
        <SimpleLoadingEffect :isLoading="isStoreUpdate" />
        <div>
            <button type="button"
                class="mt-4 mb-2 mx-auto md:absolute md:top-10 md:right-5 
                        flex flex-row rounded p-1 text-white sm:top-30"
                style="cursor: pointer;"
                :class="[isStoreUpdate ? 'bg-slate-300' : 'bg-slate-600']"
                @click="toUpdateData"
            >
                <i class="fa-solid fa-arrows-rotate my-auto mx-1"></i>
                <p class="mx-1 my-auto">Reload</p>
            </button>
        </div>

        <!-- TODO: handle this with createWebHashHistory()
        <div class="mx-auto my-3 flex justify-center">
            <a v-for="key in Object.keys(figureLists)" :key="key"
                    type="button" :href="'#'+key" style="cursor: pointer;"
                    class="btn_class hover:text-slate-800 border
                            mx-3 hover:bg-slate-200 hover:dark:bg-slate-700">
                {{ key }}
            </a>
        </div>
        -->

        <div class="my-5">
            <div class="text-3xl font-semibold">
                雨量觀測站 - 降雨分佈 和 降雨數量統計
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
                <div class="w-150 mx-auto">
                <p>說明: 降雨強度為以過去 24hr 的累積雨量做分類。分類如下</p>
                <ul class="list-disc list-inside">
                    <li v-for="desc in rainfallLevelDesc">{{ desc }}</li>
                </ul>
                </div>
            </div>
        </div>
        <div class="my-5">
            <div class="text-3xl font-semibold">
                天氣狀態
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 py-5">
                <div class="h-140 w-120 mx-auto ">
                    <SimpleIconMap
                        imageId="weather-icon"
                        :dataset="weatherTypeSet"
                        :mapCenterLat="23.6"
                        :mapCenterLon="121.05"
                        :mapZoom = 7
                        :mapLegends="weatherLegends"
                        class="border border-white"
                    >
                    </SimpleIconMap>
                </div>

                <div class="grid grid-cols-3 md:grid-cols-2 xl:grid-cols-4 mx-auto my-5">
                    <SimpleProgressBarCircle
                        v-for="(item, key) in weatherTypeProgressInfo" :key="key+'-progress-weather'"
                        :imageId="item.legend + '-progressbar-circle-weather'"
                        :currentProgress=item.value
                        :totalProgress=item.total
                        :title=item.legend
                        :color=item.color
                        class="mx-5 my-auto "
                        >
                    </SimpleProgressBarCircle>
                </div>
            </div>
        </div>
        <div v-for="(items, key) in figureLists" :key="key" :id="key"
                class="my-5">
            <div class="text-3xl font-semibold">
                {{ key }}
            </div>
            <div class="pt-3 pb-5 grid grid-cols-1 md:grid-cols-2
                        xl:grid-cols-3 gap-y-4">
                <SimpleFigureView v-for="item in items" :key="item.title"
                        :figSrc="item.figSrc"
                        :title="item.title"
                        imgClass="h-95 p-2"
                        titleClass="text"
                        class="w-90 mx-auto rounded"
                />
            </div>
        </div>
        <SimpleSourceView :dataSrc="cwaStore.dataUrlSrc" />
    </div>
</template>

<style scoped>
</style>