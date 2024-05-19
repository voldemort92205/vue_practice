<script setup>
import {ref} from 'vue'
const props = defineProps (['bikeRawData']);

let bikeData = ref({});
let areaDownList = {};
const stationInfo = ref('TBD');
const availableBorrow = ref(0);
const availableReturn = ref(0);

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
    stationInfo.value = item["sarea"] + " - " + item["sna"];
    availableBorrow.value = item["available_rent_bikes"];
    availableReturn.value = item["available_return_bikes"];
};
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
            <div class="dropdown m-2 ms-auto me-auto col-2"
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
                    style="max-height: 200px;"
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
    </div>
</template>

<style scoped>
</style>