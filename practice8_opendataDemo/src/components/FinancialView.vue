<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useFinancialStore } from '../stores/useFinancialStore';

import SimpleTitleDisplay from "./SimpleTitleDisplay.vue";
import SimpleSourceView from "./SimpleSourceView.vue";
import SimpleLoadingEffect from './SimpleLoadingEffect.vue';

import SimpleLineChart from './SimpleLineChart.vue';

const financialStore = useFinancialStore();

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


const localDataset = reactive({});
const timeDataset = reactive([]);
const keyDataset = reactive([]);
const timeKey = financialStore.timeKey;
const updateLocalDataset = (dataset, keys) => {
    keys.forEach((key) => {
        // re-new local dataset
        delete localDataset[key]
        localDataset[key] = [];
    })
    timeDataset.splice(0, timeDataset.length);
    keyDataset.slice(0, keyDataset.length);
    keys.forEach((key) => {
        keyDataset.push(key)
    })

    dataset.forEach((data) => {
        Object.entries(data).forEach (([dataKey, dataValue]) => {
            if (keys.includes(dataKey))
            {
                const tmp = {...dataValue, ...dataValue["data"]};
                delete tmp["status"];
                localDataset[dataKey].push(tmp);
            }
            else if (dataKey === timeKey)
            {
                timeDataset.push(dataValue);
            }
        })
    })
}

const doRefresh = (forceUpdate = false) => {
    queryData (forceUpdate);
}

/*
plot several dataset (value) into
    one line chart figure with the title (key)
*/

const lineCharts = {
    "工資-月薪": {
        src: ["基本工資-月薪", "工業及服務業平均月薪資", "製造業平均月薪資"],
        imageSize: {width: 650, height: 400},
        imageMargin: { top: 60, right: 30, bottom: 50, left: 80 },
        yValueMargin: 1000,
        axisName: {x: "month", y: "月薪 (TWD/mon)"},
    },
    "物價指數": {
        src: ["生產者物價-指數", "消費者物價-指數"],
        imageSize: {width: 650, height: 400},
        imageMargin: { top: 60, right: 40, bottom: 50, left: 80 },
        yValueMargin: 3,
        axisName: {x: "month", y: "指數"},
    },
    "物價年增率": {
        src: ["生產者物價-年增率", "消費者物價-年增率"],
        imageSize: {width: 650, height: 400},
        imageMargin: { top: 60, right: 40, bottom: 50, left: 80 },
        yValueMargin: 2,
        axisName: {x: "month", y: "年增率 (%)"},
    },
};
const lineChartDataset = reactive({})

const getDataset = (key) => {
    const output = reactive([])
    if (keyDataset.includes(key)) {
        localDataset[key].forEach((item) => {
            output.push(item.value)
        })
    }
    return output;
}

const colorList = ["steelblue", "green", "brown"];
const updateLineChartDataset = () => {
    for (const key in lineChartDataset)
    {
        delete lineChartDataset[key]
    }

    for (const key1 in lineCharts)
    {
        lineChartDataset[key1] = reactive({
            dataY: lineCharts[key1].src.map((key2, i) => {
                return {
                    value: getDataset(key2),
                    legend: key2,
                    color: colorList[i]
                }
            }),
            imageSize: lineCharts[key1].imageSize,
            imageMargin: lineCharts[key1].imageMargin,
            yValueMargin: lineCharts[key1].yValueMargin,
            imageId: "lineChart-" + key1,
            title: key1,
            axisName: lineCharts[key1].axisName,
        });
    }
}

const updateFigureDataset = () => {
    updateLineChartDataset ();
}

async function queryData(forceUpdate) {
    preDownload();
    await financialStore.fetchData(forceUpdate);
    updateLocalDataset (financialStore.dataSet, financialStore.dataKey);
    updateFigureDataset ();
    postDownload(financialStore.refreshTime);
}

const toUpdateData = () => {
    doRefresh(true);
}

onMounted(() => {
    doRefresh();
})



</script>
<template>
    <div class="mx-auto relative">
        <SimpleTitleDisplay h1Title="經濟統計數據"/>
        <div class="text-xl">
            Last Refresh Time: {{ webRefreshTime }}
        </div>
        <SimpleLoadingEffect :isLoading="isStoreUpdate" />

        <div></div>
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

        <div class="mx-auto mt-6">
            <SimpleLineChart  v-for="(item, key) in lineChartDataset" :key="key"
                :tickX="timeDataset"
                :dataY=item.dataY
                :title="item.title"
                :imageId="item.imageId"
                :yValueMargin="item.yValueMargin"
                :imageSize = "item.imageSize"
                :imageMargin="item.imageMargin"
                :axisName="item.axisName"
                class="mx-auto w-180 my-5"
            />
        </div>

        <SimpleSourceView :dataSrc="financialStore.dataUrlSrc" />
    </div>
</template>