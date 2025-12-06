import { reactive, ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export const useYoubikeStore = defineStore("youbikeAQI", () => {
    const dataUrlSrc = "https://data.taipei/dataset/detail?id=c6bc8aed-557d-41d5-bfb1-8da24f78f2fb";
    const isDownloading = ref(false);

    // Download from local backend service
    const taipeiYoubikeUrl = "http://localhost:3000/bikeInfo/TaipeiCity"
    const taichungYoubikeUrl = "http://localhost:3000/bikeInfo/Taichung";

    const refreshTime = ref("Null");
    const dataSet = reactive([]);

    const removeAllElement = (key, targetVal) => {
        while (true)
        {
            const index = dataSet.findIndex((item) => item[key] === targetVal);
            if (index === -1)
            {
                break;
            }
            dataSet.splice(index, 1);
        }
    }

    async function fetchTaipeiYoubike(params) {
        await axios.get(taipeiYoubikeUrl)
            .then((response) => {
                removeAllElement("city", "台北市");
                response.data.forEach((item) => {
                    dataSet.push(item);
                })
            })
            .catch((error) => {
                console.log ("Download Taipei Youbike Error: ", error.message);
            })
    }

    async function fetchTaiChungYoubike(params) {
        await axios.get(taichungYoubikeUrl)
            .then((response) => {
                removeAllElement("city", "台中市");
                response.data.forEach((item) => {
                    dataSet.push(item)
                })
            })
            .catch((error) => {
                console.log ("Download TaiChung Youbike Error: ", error.message);
            })
    }

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
        await fetchTaipeiYoubike();
        await fetchTaiChungYoubike();

        refreshTime.value = new Date().toLocaleString();
        console.log ("Download Complete!!");
        isDownloading.value = false;
    }
    return {fetchData, refreshTime, dataSet, dataUrlSrc}
})
