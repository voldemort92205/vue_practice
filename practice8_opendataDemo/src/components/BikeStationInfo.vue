<script setup>
import { ref, reactive, onMounted } from 'vue';
import SimpleCircleMap from "./SimpleCircleMap.vue";
import SimpleDropdownMenu from './SimpleDropdownMenu.vue';
import { useYoubikeStore } from '../stores/useYouBikeStore';

const youbikeStore = useYoubikeStore();

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
    output["color"] = pointColor;
    output["radius"] = 5;
    output["weight"] = 3;
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
    await youbikeStore.fetchData(forceUpdate);
    updateRawData(youbikeStore.dataSet)
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
    <div class="w-9/10 mx-auto relative">
        <div class="text-3xl font-bold underline py-6 text-slate-600 dark:text-slate-200">
            YouBike Map - Taipei City
        </div>
        <div>
            Last Refresh Time: {{ youbikeStore.refreshTime }}
            </div>
        <div>
            <button type="button"
                class="mt-4 mb-2 mx-auto md:absolute md:top-10 md:right-5 flex flex-row rounded p-1 text-white sm:top-30"
                style="cursor: pointer;"
                :class="[youbikeStore.isDownloading ? 'bg-slate-300' : 'bg-slate-600']"
                @click="toUpdateData"
            >
                <i class="fa-solid fa-arrows-rotate my-auto mx-1"></i>
                <p class="mx-1 my-auto">Reload</p>
            </button>
            </div>

        <div class="map-card bg-white h-160 rounded mx-auto my-6 p-6 shadow-lg shadow-slate-400">
            <SimpleCircleMap
                :mapCenterLat="centerLat"
                :mapCenterLon="centerLon"
                :mapZoom = mapZoom
                mapId = "mapContainer"
                :mapCircleData = bikeMapData
                :mapLegends = legendGroup
            />
        </div>
        <div class="bg-white rounded mx-auto my-6 p-6 shadow-lg shadow-slate-400 dark:bg-slate-50">
            <div class="md:text-xl my-4 w-3/4 mx-auto text-slate-600">
                <p class="font-bold">Name</p>: {{ stationInfo}} <br>
                <p class="font-bold">Available Rent/ Return</p>:
                    {{ availableBorrow }}/ {{ availableReturn }} <br>
                <p class="font-bold">Last update</p>:
                    {{ lastUpdateTimeStamp }}
            </div>
            <div class="w-3/4 mx-auto shadow shadow-black rounded dark:bg-slate-50">
                <SimpleDropdownMenu 
                    :dropdownData=bikeDropdownData
                    :onButtonClick="showItemInformation"
                />
            </div>
        </div>
        <div class="my-2 mx-auto">
            source <a :href="youbikeStore.dataUrlSrc"> here</a>
        </div>
    </div>
</template>

<style scoped>
</style>