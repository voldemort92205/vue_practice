<script setup>
import { onMounted, reactive, watch, ref } from 'vue';

import SimpleIconMap from './SimpleIconMap.vue';
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

const weatherTypeSet = reactive([]);
const weatherTypeProgressInfo = reactive([]);
const refreshTime = ref("Null");

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

    case "陰有雨":
      iconHtml = `
        <div style="position: relative;">
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
      iconHtml = `<i class="fas fa-question" style="color:#CC0000;font-size:${size}px;"></i>`;
  }
  return iconHtml;
}

const getWeatherColor = (weatherType) => {
    if (weatherType.startsWith("晴"))
    {
        return "orange";
    }
    else if (weatherType.startsWith("多雲"))
    {
        return "gray";
    }
    else
    {
        return "black";
    }
}

const weatherType = ["晴", "晴有靄", "晴有雷", "多雲", "多雲有靄",  "多雲有雨", "多雲有雷雨", "多雲有雷", "陰", "陰有雨", "陰有雷雨", "陰有雷"];
const weatherLegends = reactive([]);

const updatDataset = () => {
    const typeStatistic = {};
    weatherType.forEach((item) => {
        typeStatistic[item] = {count: 0};
    })

    weatherTypeSet.splice(0, weatherTypeSet.length);
    props.dataset.forEach((item) => {
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

        if (weatherKey in typeStatistic)
        {
            typeStatistic[weatherKey].count += 1;
        }
        else
        {
            console.log ("Unspport type: ", weatherKey);
            typeStatistic[weatherKey] = {count: 1,}
        }
    });

    let total = 0;
    Object.keys(typeStatistic).forEach((key) => {
        total += typeStatistic[key].count;
    });

    weatherTypeProgressInfo.splice(0, weatherTypeProgressInfo.length);
    Object.keys(typeStatistic).forEach((key) => {
        weatherTypeProgressInfo.push({
            legend: key,
            value: typeStatistic[key].count,
            total: total,
            color: getWeatherColor(key)
        });
    });

    // add known icons
    weatherType.forEach((key) => {
      weatherLegends.push({
        iconStr: getWeatherIcon(key),
        name: key,
      })
    });
    // add unknonwn icons
    Object.keys(typeStatistic).forEach((key) => {
      if (! weatherType.includes(key))
      {
        weatherLegends.push({
          iconStr: getWeatherIcon(key),
          name: key,
        })
      }
    })

    refreshTime.value = props.refreshTime;
}

onMounted (() => {
    updatDataset();
});

watch (() => props, () => {
    updatDataset();
}, {deep: true});

</script>

<template>
    <div class="my-5 py-5">
        <div class="text-3xl font-semibold">
            天氣狀態
        </div>
        <div class="text-lg">
            Last Refresh Time: {{ refreshTime }}
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
</template>