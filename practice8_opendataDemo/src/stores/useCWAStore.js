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
    const dataSet = reactive([]);
    function initDataSet () {
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
    async function fetchResource (forceUpdate = false)
    {
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
            initDataSet();
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
    async function fetchFigures (forceUpdate = false) {
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
            // fetchResource fail before???
            await fetchResource();
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
        await fetchResource (forceUpdate);
        await fetchFigures (forceUpdate);
    }

    return {initFetchSet, refreshTimeFigures, dataSet, dataUrlSrc, fetchFigures}
})
