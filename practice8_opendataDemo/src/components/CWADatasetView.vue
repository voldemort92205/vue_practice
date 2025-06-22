<script setup>
import SimpleFigureView from './SimpleFigureView.vue';
import SimpleTitleDisplay from './SimpleTitleDisplay.vue';
import { onMounted, reactive } from 'vue';
import { useCWAStore } from '../stores/useCWAStore.js';

const cwaStore = useCWAStore();

const figureLists = reactive({});
const updateFigureLists = () => {
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
}

async function fetchDataSet(forceUpdate = false) {
    await cwaStore.initFetchSet(forceUpdate);
    updateFigureLists();
}

async function fetechFigures() {
    await cwaStore.fetchFigures(true);
    updateFigureLists();
}

const refreshDataSet = (forceUpdate = false) => {
    fetchDataSet (forceUpdate);
}

const toUpdateData = () => {
    fetechFigures();
}

onMounted (() => {
    refreshDataSet();
})
</script>

<template>
    <div class="w-9/10 mx-auto relative">
        <SimpleTitleDisplay h1Title="CWA Report" />
        <div>
            Last Refresh Time: {{ cwaStore.refreshTimeFigures }}
        </div>
        <div>
            <button type="button"
                class="mt-4 mb-2 mx-auto md:absolute md:top-10 md:right-5 
                        flex flex-row rounded p-1 text-white sm:top-30"
                style="cursor: pointer;"
                :class="[cwaStore.isDownloading ? 'bg-slate-300' : 'bg-slate-600']"
                @click="toUpdateData"
            >
                <i class="fa-solid fa-arrows-rotate my-auto mx-1"></i>
                <p class="mx-1 my-auto">Reload</p>
            </button>
        </div>

        <div class="mx-auto my-3 flex w-full">
            <a v-for="key in Object.keys(figureLists)" :key="key"
                    type="button" :href="'#'+key" style="cursor: pointer;"
                    class="rounded border py-1 px-2 shadow shadow-slate-500
                            mx-3 hover:bg-slate-200 hover:dark:bg-slate-600">
                {{ key }}
            </a>
        </div>

        <div v-for="(items, key) in figureLists" :key="key" :id="key"
                class="my-5 bg-white/50 dark:bg-black/50 rounded shadow-slate-600 shadow">
            <div class="text-xl pb-1 pt-3 font-mono font-semibold">
                {{ key }}
            </div>
            <div class="pt-3 pb-5 rounded overflow-auto grid grid-cols-1 md:grid-cols-2
                        2xl:grid-cols-3 gap-y-4 ">
                <SimpleFigureView v-for="item in items" :key="item.title"
                        :figSrc="item.figSrc"
                        :title="item.title"
                        imgClass="h-95 rounded p-2"
                        class="w-90 rounded shadow shadow-slate-400 mx-auto"
                         />
            </div>
        </div>
        <p class="pt-1 pb-1 text-slate-200">
            Source: <a :href="cwaStore.dataUrlSrc" class="text-slate-200"> opendata </a>
        </p>
    </div>
</template>


<style scoped>
</style>