import { reactive, ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export const useAQIStore = defineStore("opendataAQI", () => {
    const dataUrlJson = "https://data.moenv.gov.tw/api/v2/aqx_p_432?api_key=58d6040c-dca7-407f-a244-d0bfdfa8144a";
    const dataUrlSrc = "https://data.gov.tw/dataset/40448";
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
                response.data.records.forEach((item) => {
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
