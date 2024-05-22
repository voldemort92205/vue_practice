<script setup>
import {ref, watch} from 'vue'
const props = defineProps (['bikeRawData']);

let bikeData = ref({});
let areaDownList = {};
const stationInfo = ref('TBD');
const availableBorrow = ref(0);
const availableReturn = ref(0);
const searchResultList = ref([]);
const searchKeyWord = ref("");
const searchResultCount = ref(0);

const encapsulateData = (item) => {
    let output = {
        "sno": item.sno,
        "sna": item.sna.replace('YouBike2.0_', ''),
    };
    return output;
};
props.bikeRawData.forEach ((item) => {
    const area = item.sarea;
    if (area in areaDownList) {
        areaDownList[area].value.push(encapsulateData(item))
    } else {
        areaDownList[area] = ref([encapsulateData(item)]);
    }

    // use sno as key for bikeData
    bikeData[item.sno] = {
        ...item,
        sna: item.sna.replace('YouBike2.0_', ''),
    };
})

const showSelectInfo = (itemId) => {
    const item = bikeData[itemId];
    stationInfo.value = item["sarea"] + " - " + item["sna"] + '(' + item["ar"]+ ')';
    availableBorrow.value = item["available_rent_bikes"];
    availableReturn.value = item["available_return_bikes"];
};

const updateResult = (key) => {
    searchResultList.value = [];
    if (key !== "") {
        props.bikeRawData.forEach((item) => {
            if (item["ar"].includes(key) ||
                item["sna"].includes(key))
            {
                searchResultList.value.push(encapsulateData(item))
            }
        })
    }
    searchResultCount.value = searchResultList.value.length;
}

watch (searchKeyWord, () => {
    updateResult(searchKeyWord.value);
})
</script>

<template>
    <div class="container shadow-lg rounded m-5 ms-auto me-auto">
        <div class="fs-1 pt-4"> Station Information </div>
        <div class="bikeinfo-content fs-4 mt-3 mb-3">
            <p class="fw-bold">Name</p>: {{ stationInfo}} <br>
            <p class="fw-bold">Available Rent/ Return</p>: 
                {{ availableBorrow }}/ {{ availableReturn }}
        </div>
        <hr>
        <div class="row pt-4 pb-4">
            <div class="dropend m-2 ms-auto me-auto col-2"
                 v-for="area in Object.keys(areaDownList)"
                 :key="area"
                >
                <button class="btn btn-secondary dropdown-toggle fs-5 p-2"
                        type="button"
                        :id="'dropdownMenu-' + area"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                    {{ area }}
                </button>

                <div class="dropdown-menu overflow-scroll"
                    style="max-height: 250px;"
                    :labelledby="'dropdownMenu-'+area"
                    role="menu"
                    >
                    <a v-for="item in areaDownList[area].value"
                        class="dropdown-item fs-5"
                        href="#"
                        @click="() => showSelectInfo(item['sno'])"
                        >
                        {{ item["sna"] }}
                    </a>
                </div>
            </div>
        </div>
        <hr>
        <button class="btn btn-primary mt-2 mb-4 fs-5"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#searchList"
                aria-expanded="false"
                aria-controls="collapseExample"
            >
            Quick Search
        </button>
        <div class="collapse pt-4 pb-4"
             style="height: 100px;"
             id="searchList">
            <div class="searchList-container row d-flex align-items-center">
                <div class="serchInputSection col-5 justify-content-center">
                    <label for="searchInput" class="fs-5">Keyword: </label>
                    <input type="text"
                           id="searchInput"
                           placeholder="keyword for station or road"
                           v-model.trim="searchKeyWord"
                           class="fs-5"
                    >
                </div>
                <div class="searchResultSection col-6 dropend d-flex justify-content-center">
                    <button class="btn dropdown-toggle fs-5 p-2"
                        :class="{'btn-secondary': searchResultCount,}"
                        type="button"
                        id="dropdownMenu-searchResult"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                    Result ({{ searchResultCount }})
                    </button>
                    <div class="dropdown-menu overflow-scroll"
                         style="max-height: 200px;"
                         labelledby="dropdownMenu-searchResult"
                        role="menu"
                        >
                        <a v-for="item in searchResultList"
                            class="dropdown-item fs-5"
                            href="#"
                            @click="() => showSelectInfo(item['sno'])"
                            >
                            {{ item["sna"] }}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>