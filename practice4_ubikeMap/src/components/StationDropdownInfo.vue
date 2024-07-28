<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import axios from 'axios';

const props = defineProps (['doRefreshClick']);

// env data
const bikeData = reactive({});
const areaDownList = reactive({});
const stationInfo = ref('TBD');
const availableBorrow = ref(0);
const availableReturn = ref(0);
const lastUpdateTimeStamp = ref('TBD');
const searchResultList = ref([]);
const searchKeyWord = ref("");
const searchResultCount = ref(0);
const selectedItemId = ref('');

const bikeJsonUrl =
    "https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json";
var lastDownloadTime = 0;
const downloadPeriod = 5000; // 5 second

const resetAreaDownList = (lastEpoch) => {
    Object.keys(areaDownList).forEach ((area) => {
        areaDownList[area] =
            areaDownList[area].filter ((item) => {
                return item.epoch == lastEpoch;
            })
    })
};

const parseData = () => {
    if ((Date.now() - lastDownloadTime) < downloadPeriod) {
        console.log ("Station Dropdown Menu: Update too quickly");
        return;
    }
    axios.get(bikeJsonUrl)
        .then((response) => {
            lastDownloadTime = Date.now();
            response.data.forEach((item) => {
                const area = item.sarea;
                if (area in areaDownList){
                    areaDownList[area].push(
                        encapsulateData(item, lastDownloadTime));
                } else {
                    areaDownList[area] =
                        [encapsulateData(item, lastDownloadTime)];
                }
                // use sno as key for bikeData
                bikeData[item.sno] = {
                    ...item,
                    sna: item.sna.replace('YouBike2.0_', ''),
                };
            });
            resetAreaDownList(lastDownloadTime);
            updateSelectInfo();
            console.log ("Station Dropdown Menu: refresh it");
        })
        .catch((error) => {
            console.log ('error: ', error);
        })
};

const encapsulateData = (item, epoch) => {
    let output = {
        "sno": item.sno,
        "sna": item.sna.replace('YouBike2.0_', ''),
        "epoch": epoch,
    };
    return output;
};

const updateSelectInfo = () => {
    if (selectedItemId.value !== '') {
        const item = bikeData[selectedItemId.value];
        stationInfo.value = item["sarea"] + " - " + item["sna"] +
            '(' + item["ar"]+ ')';
        availableBorrow.value = item["available_rent_bikes"];
        availableReturn.value = item["available_return_bikes"];
        lastUpdateTimeStamp.value = item["updateTime"];
    }
};

const showSelectInfo = (itemId) => {
    selectedItemId.value = itemId;
    updateSelectInfo();
};

const updateResult = (keyword) => {
    searchResultList.value = [];
    if (keyword !== "") {
        Object.keys(bikeData).forEach((key) => {
            const item = bikeData[key]
            if (item["ar"].includes(keyword) ||
                item["sna"].includes(keyword))
            {
                searchResultList.value.push(item)
            }
        })
    }
    searchResultCount.value = searchResultList.value.length;
}

onMounted (() => {
    parseData();
});

watch (() => props.doRefreshClick, () => {
    parseData();
});

watch (searchKeyWord, () => {
    updateResult(searchKeyWord.value);
});
</script>

<template>
    <div class="shadow-md shadow-slate-900 dark:shadow-slate-100
                rounded-lg mx-auto my-5 w-3/4 max-w-8xl border-2
                dark:border-zinc-600 dark:bg-zinc-800">
        <div class="text-4xl py-4 font-black"> Station Information </div>
        <div class="bikeinfo-content md:text-xl my-4">
            <p class="font-bold">Name</p>: {{ stationInfo}} <br>
            <p class="font-bold">Available Rent/ Return</p>: 
                {{ availableBorrow }}/ {{ availableReturn }} <br>
            <p class="font-bold">Last update</p>:
                {{ lastUpdateTimeStamp }}
        </div>
        <div class="grid grid-cols-3 md:grid-cols-5 mb-5 px-2">
            <div v-for="area in Object.keys(areaDownList)"
                    :key="area"
                    >
                <Menu as="div" class=" my-2">
                    <div>
                        <MenuButton class="bg-gray text-gray-1000 py-2 px-4 my-2
                                        border border-gray-500 rounded-md shadow
                                        font-semibold inline-flex">
                            {{ area }}
                            <ChevronDownIcon class="-mr-1 h-5 w-5 text-gray-600" aria-hidden="true" />
                        </MenuButton>
                    </div>
                    <transition enter-active-class="transition ease-out duration-100"
                                enter-from-class="transform opacity-0 scale-95"
                                enter-to-class="transform opacity-100 scale-100"
                                leave-active-class="transition ease-in duration-75"
                                leave-from-class="transform opacity-100 scale-100"
                                leave-to-class="transform opacity-0 scale-95"
                        >
                        <MenuItems class="mt-2 rounded-md bg-white w-40
                                         ring-1 ring-black h-40 overflow-auto
                                         absolute">
                            <div v-for="item in areaDownList[area]"
                                    class="py-1">
                                <MenuItem>
                                    <a class="mx-1 py-1 block rounded
                                            text-slate-600 hover:text-slate-100 hover:bg-gray-700"
                                        @click="() => showSelectInfo(item['sno'])">
                                        {{ item["sna"] }}
                                    </a>
                                </MenuItem>
                            </div>
                        </MenuItems>
                    </transition>
                    </Menu>
                </div>
            </div>
        <hr>
        <div class="py-4 px-3"
             style="height: 100px;"
             id="searchList">
            <div class="flex flex-row justify-evenly py-2">
                <div class="">
                    <label for="searchInput"
                            class="font-bold text-lg"
                    >
                        Keyword:
                    </label>
                    <input type="text"
                           id="searchInput"
                           placeholder="keyword for station or road"
                           v-model.trim="searchKeyWord"
                           class="shadow border rounded py-1 px-2 mx-2 my-1
                                    text-gray-700 border-stone-400"
                    >
                </div>
                <Menu as="div" class="">
                    <div>
                        <MenuButton class="bg-gray text-gray-1000 py-2 px-2 mx-2
                                        border border-gray-500 rounded-md shadow
                                        font-semibold inline-flex">
                            Result ({{ searchResultCount }})
                            <ChevronDownIcon class="-mr-1 h-5 w-5 text-gray-600" aria-hidden="true" />
                        </MenuButton>
                    </div>
                    <transition enter-active-class="transition ease-out duration-100"
                                enter-from-class="transform opacity-0 scale-95"
                                enter-to-class="transform opacity-100 scale-100"
                                leave-active-class="transition ease-in duration-75"
                                leave-from-class="transform opacity-100 scale-100"
                                leave-to-class="transform opacity-0 scale-95"
                        >
                        <MenuItems class="mt-2 rounded-md bg-white w-40
                                         ring-2 ring-black h-40 overflow-auto
                                         -translate-y-full -translate-x-3/4 absolute
                                         md:-translate-y-3/4 md:translate-x-3/4"
                                    anchor="top start">
                            <div v-for="item in searchResultList"
                                class="py-1"
                            >
                                <MenuItem>
                                    <a class="mx-1 py-1 block rounded
                                            text-slate-600 hover:text-slate-100 hover:bg-gray-700"
                                        @click="() => showSelectInfo(item['sno'])"
                                    >
                                        {{ item["sna"] }}
                                    </a>
                                </MenuItem>
                            </div>
                        </MenuItems>
                    </transition>
                </Menu>
            </div>
        </div>
    </div>
</template>

<style scoped>
.debug {
    border: solid black;
}
</style>