import { reactive, ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export const useYoubikeStore = defineStore("youbikeAQI", () => {
    const dataUrlJson = "https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json";
    const dataUrlSrc = "https://data.taipei/dataset/detail?id=c6bc8aed-557d-41d5-bfb1-8da24f78f2fb";
    const isDownloading = ref(false);

    const refreshTime = ref("Null");
    const dataSet = reactive([]);

    async function fetchData (forceUpdate = false) {
        if (!forceUpdate && refreshTime.value !== "Null") {
            console.log ("Last refreshTime: ", refreshTime.value);
            return;
        }
        if (isDownloading.value) {
            console.log ("There is a download process, skip this time...");
            return;
        }
        isDownloading.value = true;
        await axios.get(dataUrlJson)
            .then((response) => {
                dataSet.splice(0, dataSet.length);
                response.data.forEach((item) => {
                    dataSet.push(item)
                })
                refreshTime.value = new Date().toLocaleString();
                console.log ("Download Complete!!");
                isDownloading.value = false;
            })
            .catch(error => {
                console.log ("error: ", error.message);
                isDownloading.value = false;
            })
    }
    return {fetchData, refreshTime, dataSet, dataUrlSrc}
})
