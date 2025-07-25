<script setup>
import SimpleFigureView from './SimpleFigureView.vue';
import SimpleTitleDisplay from './SimpleTitleDisplay.vue';
import { onMounted, reactive, ref } from 'vue';
import { useCWAStore } from '../stores/useCWAStore.js';
import SimpleSourceView from './SimpleSourceView.vue';
import SimpleLoadingEffect from './SimpleLoadingEffect.vue';

const cwaStore = useCWAStore();

// change refresh time
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

const figureLists = reactive({});
const updateFigureLists = (timeStamp = "Null") => {
    for (const key in figureLists){
        delete figureLists[key];
    }
    cwaStore.dataSet.forEach ((item) => {
        const key = item.class;
        const output = {
            figSrc: item.figSrc,
            title: item.title
        };

        if (key in figureLists)
        {
            figureLists[key].push(output);
        }
        else
        {
            figureLists[key] = [output]
        }
    })
    postDownload(timeStamp);
}

async function fetchDataSet(forceUpdate = false) {
    await cwaStore.initFetchSet(forceUpdate);
    updateFigureLists(cwaStore.refreshTimeFigures);
}

async function fetechFigures() {
    await cwaStore.fetchFigures(true);
    updateFigureLists(cwaStore.refreshTimeFigures);
}

const refreshDataSet = (forceUpdate = false) => {
    preDownload();
    fetchDataSet (forceUpdate);
}

const toUpdateData = () => {
    preDownload();
    fetechFigures();
}

onMounted (() => {
    refreshDataSet();
})
</script>

<template>
    <div class="relative">
        <SimpleTitleDisplay h1Title="CWA Dataset" />
        <div class="text-xl">
            Last Refresh Time: {{ webRefreshTime }}
        </div>
        <SimpleLoadingEffect :isLoading="isStoreUpdate" />
        <div>
            <button type="button"
                class="mt-4 mb-2 mx-auto md:absolute md:top-10 md:right-5 
                        flex flex-row rounded p-1 text-white sm:top-30"
                style="cursor: pointer;"
                :class="[isStoreUpdate ? 'bg-slate-300' : 'bg-slate-600']"
                @click="toUpdateData"
            >
                <i class="fa-solid fa-arrows-rotate my-auto mx-1"></i>
                <p class="mx-1 my-auto">Reload</p>
            </button>
        </div>

        <!-- TODO: handle this with createWebHashHistory()
        <div class="mx-auto my-3 flex justify-center">
            <a v-for="key in Object.keys(figureLists)" :key="key"
                    type="button" :href="'#'+key" style="cursor: pointer;"
                    class="btn_class hover:text-slate-800 border
                            mx-3 hover:bg-slate-200 hover:dark:bg-slate-700">
                {{ key }}
            </a>
        </div>
        -->

        <div v-for="(items, key) in figureLists" :key="key" :id="key"
                class="my-5">
            <div class="text-3xl font-semibold">
                {{ key }}
            </div>
            <div class="pt-3 pb-5 grid grid-cols-1 md:grid-cols-2
                        xl:grid-cols-3 gap-y-4">
                <SimpleFigureView v-for="item in items" :key="item.title"
                        :figSrc="item.figSrc"
                        :title="item.title"
                        imgClass="h-95 p-2"
                        titleClass="text"
                        class="w-90 mx-auto rounded"
                         />
            </div>
        </div>
        <SimpleSourceView :dataSrc="cwaStore.dataUrlSrc" />
    </div>
</template>


<style scoped>
</style>