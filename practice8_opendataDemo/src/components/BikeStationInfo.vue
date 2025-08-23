<script setup>
import { ref, reactive, onMounted } from 'vue';
import SimpleCircleMap from "./SimpleCircleMap.vue";
import SimpleDropdownMenu from './SimpleDropdownMenu.vue';
import { useYoubikeStore } from '../stores/useYouBikeStore';
import SimpleTitleDisplay from './SimpleTitleDisplay.vue';
import SimpleSourceView from './SimpleSourceView.vue';
import SimpleLoadingEffect from './SimpleLoadingEffect.vue';

const youbikeStore = useYoubikeStore();

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

const bikeRawData = reactive([]);

const stationInfo = ref('TBD');
const availableBorrow = ref(0);
const availableReturn = ref(0);
const lastUpdateTimeStamp = ref('TBD');


/*** For map card - begin ***/
const bikeMapData = reactive ([]);

const centerLat = ref(25.06);
const centerLon = ref(121.53);
const mapZoom = ref(12);

const getPointColor = (item) => {
    if (item["available_rent_bikes"] > 10) {
        return "green";
    } else if (item["available_rent_bikes"] > 0) {
        return "orange";
    } else {
        return "red";
    }
};

const encapsulateData = (item) => {
    const output = {};
    output["lat"] = item.latitude;
    output["lon"] = item.longitude;

    var message = item.sna.replace('YouBike2.0_', '')
                    + "站: " + item.available_rent_bikes;
    const pointColor = getPointColor(item);
    output["message"] = message;
    output["fillColor"] = pointColor;
    output["color"] = "black";
    output["radius"] = 5;
    output["weight"] = 1;
    return output;
}

const legendGroup = [
  {"color": "green", "name": "可借數量 > 10台"},
  {"color": "orange", "name": "可借數量 < 10台"},
  {"color": "red", "name": "可借數量為 0台"},
]

const handleMapData = () => {
    bikeMapData.slice(0, bikeMapData.length);
    bikeRawData.forEach ((item) => {
        bikeMapData.push(encapsulateData(item));
    })
}
/*** For map card - end ***/


/*** For Dropdown Card - begin ***/
const bikeDropdownData = reactive({});
const itemInformationName = ref("");

const encapsulateDropdownData = (item) => {
    const area = item.sarea;
    const data = {
        "className": item.sno,
        "itemName": item.sna,
    }
    return {
        "area": area, "data": data
    }
}

const handleDropdownData = () => {
    for (const key in bikeDropdownData) {
        delete bikeDropdownData[key]
    }
    bikeRawData.forEach((item) => {
        const {area, data} = encapsulateDropdownData(item)
        if (area in bikeDropdownData) {
            bikeDropdownData[area].push(data);
        }
        else
        {
            bikeDropdownData[area] = [data];
        }
    })
}

const updateSelectInfo = (item) => {
    stationInfo.value = item["sarea"] + " - " + item["sna"] +
        '(' + item["ar"]+ ')';
    availableBorrow.value = item["available_rent_bikes"];
    availableReturn.value = item["available_return_bikes"];
    lastUpdateTimeStamp.value = item["updateTime"];
};

const showItemInformation = (item) => {
    bikeRawData.forEach((element) => {
        if (element.sna === item.itemName)
        {
            updateSelectInfo(element)
            itemInformationName.value = item.itemName;
        }
    })
}

const handleItemInformation = () => {
    bikeRawData.forEach((element) => {
        if (element.sna === itemInformationName.value) {
            updateSelectInfo(element);
        }
    })
}
/*** For Dropdown Card - end ***/


const updateRawData = (data) => {
    bikeRawData.splice(0, bikeRawData.length);
    data.forEach ((item) => {
        const output = {
            ...item,
            "sna": item.sna.replace('YouBike2.0_', ''),
        };
        bikeRawData.push(output)
    })

    handleMapData();
    handleDropdownData();
    handleItemInformation();
}

async function updateBikeData (forceUpdate = false) {
    preDownload();
    await youbikeStore.fetchData(forceUpdate);
    updateRawData(youbikeStore.dataSet)
    postDownload(youbikeStore.refreshTime);
}

const doRefresh = (forceUpdate = false) => {
    updateBikeData(forceUpdate);
}

onMounted (() => {
    doRefresh();
});

const toUpdateData = () => {
  doRefresh(true);
}
</script>

<template>
    <div class="mx-auto relative">
        <div class="mx-auto flex justify-center items-center">
            <i class="fa-solid fa-bicycle fa-3x mx-2"></i>
            <SimpleTitleDisplay h1Title="YouBike - Taipei City"/>
        </div>
        <div class="text-xl">
            Last Refresh Time: {{ webRefreshTime }}
        </div>
        <SimpleLoadingEffect :isLoading="isStoreUpdate" />
        <div>
            <button type="button"
                class="mt-4 mb-2 mx-auto md:absolute md:top-10 md:right-5 flex flex-row rounded p-1 text-white sm:top-30"
                style="cursor: pointer;"
                :class="[isStoreUpdate ? 'bg-slate-300' : 'bg-slate-600']"
                @click="toUpdateData"
            >
                <i class="fa-solid fa-arrows-rotate my-auto mx-1"></i>
                <p class="mx-1 my-auto">Reload</p>
            </button>
            </div>

        <div class="container">
            <div class="text-3xl mb-2 mt-4">
                地圖 - 站點和可借數量
                <i class="fa-solid fa-map-location-dot fa-lg"></i>
            </div>
            <div class="h-160 rounded mx-auto p-1 w-full max-w-4xl">
                <SimpleCircleMap
                    :mapCenterLat="centerLat"
                    :mapCenterLon="centerLon"
                    :mapZoom = mapZoom
                    mapId = "mapContainer"
                    :mapCircleData = bikeMapData
                    :mapLegends = legendGroup
                    class="border border-white"
                />
            </div>
        </div>

        <div class="container">
            <div class="text-3xl mb-2 mt-4">
                車站資訊
            </div>
            <div class="text-xl w-fit px-6 mx-auto text-left">
                <p class="font-bold">車站</p>: {{ stationInfo}} <br>
                <p class="font-bold">可借數量/可還數量</p>:
                    {{ availableBorrow }}/ {{ availableReturn }} <br>
                <p class="font-bold">資料更新時間</p>:
                    {{ lastUpdateTimeStamp }}
                </div>
            <div class="w-full max-w-4xl bg-white rounded mx-auto my-6 dark:bg-slate-50">
                <div class="w-full mx-auto rounded dark:bg-slate-50 border">
                    <SimpleDropdownMenu
                        :dropdownData=bikeDropdownData
                        :onButtonClick="showItemInformation"
                    />
                </div>
            </div>
        </div>
        <SimpleSourceView :dataSrc="youbikeStore.dataUrlSrc" />
    </div>
</template>

<style scoped>
</style>
