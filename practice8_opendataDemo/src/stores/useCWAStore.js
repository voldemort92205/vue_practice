import { reactive, ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import { Buffer } from 'buffer';

export const useCWAStore = defineStore("opendataCWA", () => {
    const dataUrlSrc = "https://data.gov.tw/";

    const isJsonDownloading = ref(false);
    const isFigureDownloading = ref(false);

    const isDownloading = ref (false);
    const changeDownloadingState = (value) => {
        if (typeof value !== "boolean") return;
        isDownloading.value = value;
    }

    const isRainfallDownloading = ref(false);
    const isWeatherMonitorDownloading = ref(false);

    const refreshTimeRainfall = ref("Null");
    const refreshTimeWeatherMonitor = ref("Null");
    const refreshTimeResource = ref("Null");
    const refreshTimeFigures = ref("Null");

    const dataSetPre = reactive([
        {
            class: "氣溫和降雨資料",
            webSrc: "https://data.gov.tw/dataset/17123",
            jsonUrls: [
                "https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/O-A0038-001?Authorization=rdec-key-123-45678-011121314&format=JSON",
            ]
        },
        {
            class: "氣溫和降雨資料",
            webSrc: "https://data.gov.tw/dataset/30374",
            jsonUrls: [
                "https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/O-A0040-002?Authorization=rdec-key-123-45678-011121314&format=JSON",
            ]
        },
        {
            class: "氣溫和降雨資料",
            webSrc: "https://data.gov.tw/dataset/30373",
            jsonUrls: [
                "https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/O-A0040-001?Authorization=rdec-key-123-45678-011121314&format=JSON",
            ]
        },
        {
            class: "氣溫和降雨資料",
            webSrc: "https://data.gov.tw/dataset/30373",
            jsonUrls: [
                "https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/F-C0035-015?Authorization=rdec-key-123-45678-011121314&format=JSON",
                "https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/F-C0035-017?Authorization=rdec-key-123-45678-011121314&format=JSON",
                "https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/F-C0035-023?Authorization=rdec-key-123-45678-011121314&format=JSON",
                "https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/F-C0035-024?Authorization=rdec-key-123-45678-011121314&format=JSON",
            ]
        },
        {
            class: "雷達回波",
            webSrc: "https://data.gov.tw/dataset/75125",
            jsonUrls: [
                "https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/O-A0058-003?Authorization=rdec-key-123-45678-011121314&format=JSON",
                "https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/O-A0058-004?Authorization=rdec-key-123-45678-011121314&format=JSON",
                "https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/O-A0058-001?Authorization=rdec-key-123-45678-011121314&format=JSON",
                "https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/O-A0058-002?Authorization=rdec-key-123-45678-011121314&format=JSON",
            ],
        },
        {
            class: "衛星雲圖",
            webSrc: "https://data.gov.tw/dataset/33678",
            jsonUrls: [
                "https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/O-C0042-002?Authorization=rdec-key-123-45678-011121314&format=JSON",
            ]
        },
        {
            class: "衛星雲圖",
            webSrc: "https://data.gov.tw/dataset/9211",
            jsonUrls: [
                "https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/O-B0028-003?Authorization=rdec-key-123-45678-011121314&format=JSON",
            ],
        },
        {
            class: "衛星雲圖",
            webSrc: "https://data.gov.tw/dataset/9313",
            jsonUrls: [
                "https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/O-B0029-003?Authorization=rdec-key-123-45678-011121314&format=JSON",
            ],
        },
        {
            class: "衛星雲圖",
            webSrc: "https://data.gov.tw/dataset/8349",
            jsonUrls: [
                "https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/O-B0032-003?Authorization=rdec-key-123-45678-011121314&format=JSON",
            ]
        },
        {
            class: "衛星雲圖",
            webSrc: "https://data.gov.tw/dataset/8350",
            jsonUrls: [
                "https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/O-B0032-004?Authorization=rdec-key-123-45678-011121314&format=JSON",
            ]
        },
        {
            class: "衛星雲圖",
            webSrc: "https://data.gov.tw/dataset/8192",
            jsonUrls: [
                "https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/O-B0032-001?Authorization=rdec-key-123-45678-011121314&format=JSON",
            ]
        },
        {
            class: "衛星雲圖",
            webSrc: "https://data.gov.tw/dataset/8193",
            jsonUrls: [
                "https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/O-B0032-002?Authorization=rdec-key-123-45678-011121314&format=JSON",
            ]
        },
        {
            class: "衛星雲圖",
            webSrc: "https://data.gov.tw/dataset/9209",
            jsonUrls: [
                "https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/O-B0028-001?Authorization=rdec-key-123-45678-011121314&format=JSON",
            ]
        },
        {
            class: "衛星雲圖",
            webSrc: "https://data.gov.tw/dataset/33681",
            jsonUrls: [
                "https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/O-C0042-005?Authorization=rdec-key-123-45678-011121314&format=JSON",
            ]
        },
        {
            class: "衛星雲圖",
            webSrc: "https://data.gov.tw/dataset/33677",
            jsonUrls: [
                "https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/O-C0042-001?Authorization=rdec-key-123-45678-011121314&format=JSON",
            ]
        },

    ])

    const dataSetRainfall = reactive([
        {
            class: "自動雨量站-雨量觀測資料",
            webSrc: "https://data.gov.tw/dataset/9177",
            jsonUrl: "https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/O-A0002-001?Authorization=rdec-key-123-45678-011121314&format=JSON",
            dataset: reactive([]),
        },
    ])

    const dataSetWeatherMonitor = reactive({
        class: "氣象觀測資料",
        webSrc: [
            "https://data.gov.tw/dataset/9178",
            "https://data.gov.tw/dataset/9176",
        ],
        jsonUrls: [
            "https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/O-A0003-001?Authorization=rdec-key-123-45678-011121314&format=JSON",
            "https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/O-A0001-001?Authorization=rdec-key-123-45678-011121314&format=JSON",
        ],
        dataset: reactive([]),
    })
    const dataSet = reactive([]);
    function initFigureDataSet () {
        for (const item of dataSetPre)
        {
            for (const jsonUrl of item.jsonUrls)
            {
                dataSet.push({
                    class: item.class,
                    figSrc: "",
                    webSrc: item.webSrc,
                    jsonUrl: jsonUrl,
                })
            }
        }
    }

    function getResourceKey (dataset)
    {   
        if ("resource" in dataset)
            return "resource"
        else
            return "Resource"
    }
    function getDescKey (dataset)
    {
        if ("ResourceDesc" in dataset)
            return "ResourceDesc"
        else
            return "resourceDesc"
    }
    function getDatasetKey(data)
    {
        if ("Dataset" in data)
            return "Dataset";
        else
            return "dataset";
    }
    async function fetchFigureResource (forceUpdate = false)
    {
        /* query figure url from json */
        if (!forceUpdate && refreshTimeResource.value !== "Null") {
            console.log ("Last Resource RefreshTime: ", refreshTimeResource.value);
            return;
        }
        if (isJsonDownloading.value) {
            console.log ("There is a resource download process, skip this time...");
            return;
        }
        isJsonDownloading.value = true;
        changeDownloadingState(true);

        if (dataSet.length == 0)
        {
            initFigureDataSet();
        }
        const requests = dataSet.map((item) => {
            return axios.get(item.jsonUrl);
        })
        await Promise.all(requests).then((responses) => {
            responses.forEach((item, index) => {
                const datasetKey = getDatasetKey (item.data.cwaopendata);
                const dataset = item.data.cwaopendata[datasetKey];
                const resourceKey = getResourceKey(dataset);
                const descKey = getDescKey(dataset[resourceKey])
                dataSet[index]["figUrl"] = dataset[resourceKey]["ProductURL"]
                dataSet[index]["title"] = dataset[resourceKey][descKey]
            })
            refreshTimeResource.value = new Date().toLocaleString();
            isJsonDownloading.value = false;
            changeDownloadingState(false);
        })
        .catch(error => {
            console.log ("Update dataset fail: ", error);
            isJsonDownloading.value = false;
            changeDownloadingState(false);
        });
    }
    async function fetchRainfallData (forceUpdate = false)
    {
        /* data is from json, directly download it */
        if (!forceUpdate && refreshTimeRainfall.value !== "Null") {
            console.log ("Last Resource RefreshTime: ", refreshTimeRainfall.value);
            return;
        }
        if (isRainfallDownloading.value) {
            console.log ("There is a resource download process, skip this time...");
            return;
        }
        isRainfallDownloading.value = true;
        //changeDownloadingState(true);

        const requests = dataSetRainfall.map((item) => {
            return axios.get(item.jsonUrl);
        })
        await Promise.all(requests).then((responses) => {
            responses.forEach((item, index) => {
                const dataset = item.data.cwaopendata.dataset.Station;
                dataSetRainfall[index].dataset.splice(0, dataSetRainfall[index].dataset.length);
                dataset.forEach((item) => {
                    dataSetRainfall[index].dataset.push(item)
                })
            })
            refreshTimeRainfall.value = new Date().toLocaleString();
            isRainfallDownloading.value = false;
            //changeDownloadingState(false);
        })
        .catch(error => {
            console.log ("Update dataset fail: ", error);
            isRainfallDownloading.value = false;
            //changeDownloadingState(false);
        });
    }
    async function fetchWeatherMonitorData (forceUpdate = false)
    {
        /* data is from json, directly download it */
        if (!forceUpdate && refreshTimeWeatherMonitor.value !== "Null") {
            console.log ("Last Resource RefreshTime: ", refreshTimeWeatherMonitor.value);
            return;
        }
        if (isWeatherMonitorDownloading.value) {
            console.log ("There is a resource download process, skip this time...");
            return;
        }
        isWeatherMonitorDownloading.value = true;

        const requests = dataSetWeatherMonitor.jsonUrls.map((jsonUrl) => {
            return axios.get(jsonUrl);
        })

        dataSetWeatherMonitor.dataset.splice(0, dataSetWeatherMonitor.dataset.length);
        await Promise.all(requests).then((responses) => {
            responses.forEach((item) => {
                const dataset = item.data.cwaopendata.dataset.Station;
                dataset.forEach((item) => {
                    dataSetWeatherMonitor.dataset.push(item)
                })
            })
            refreshTimeWeatherMonitor.value = new Date().toLocaleString();
            isWeatherMonitorDownloading.value = false;
        })
        .catch(error => {
            console.log ("Update dataset fail: ", error);
            isWeatherMonitorDownloading.value = false;
        });
    }
    async function fetchFigures (forceUpdate = false)
    {
        /* query figures */
        if (!forceUpdate && refreshTimeFigures.value !== "Null") {
            console.log ("Last Figure RefreshTime: ", refreshTimeFigures.value);
            return;
        }
        if (isFigureDownloading.value) {
            console.log ("There is a figure download process, skip this time...");
            return;
        }
        if (dataSet.length == 0)
        {
            // fetchFigureResource fail before???
            await fetchFigureResource();
        }
        isFigureDownloading.value = true;
        changeDownloadingState(true);
        const requests = dataSet.map((item) => {
            return axios.get(item.figUrl, {responseType: "arraybuffer"});
        })
        await Promise.all(requests).then((responses) => {
            responses.forEach((response, index) => {
                const buffer = Buffer.from(response.data).toString("base64");
                dataSet[index]["figSrc"] = "data:image/png;base64," + buffer;
            })
            refreshTimeFigures.value = new Date().toLocaleString();
            isFigureDownloading.value = false;
            changeDownloadingState(false);
            console.log ("Figures are downloaded on ", refreshTimeFigures.value);
        }).catch((error) => {
            console.log ("Download figure error: ", error);
            isFigureDownloading.value = false;
            changeDownloadingState(false);
        });
    }
    async function initFetchSet (forceUpdate = false) {
        await fetchFigureResource (forceUpdate);
        await fetchFigures (forceUpdate);
        await fetchRainfallData (forceUpdate);
        await fetchWeatherMonitorData (forceUpdate);
    }

    return {initFetchSet, fetchFigures, fetchRainfallData, fetchWeatherMonitorData,
            refreshTimeFigures, refreshTimeRainfall, refreshTimeWeatherMonitor,
            dataSet, dataSetRainfall, dataUrlSrc, dataSetWeatherMonitor
    }
})
