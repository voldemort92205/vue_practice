<script setup>
import {ref, reactive, onMounted, watch} from "vue";
const props = defineProps ({
    dropdownData: Object,
    onButtonClick: {
        type: Function,
        default: (item) => console.log ("Default function call: ", item),
    },
})

/*** display - begin ***/
const displayList = reactive({});
const resultDisplay = "result";


const refreshDisplayList = () => {
    for (const key in displayList) {
        delete displayList[key];
    }
    for (const key in props.dropdownData) {
        displayList[key] = false;
    }
    displayList[resultDisplay] = false;
}

const updateDisplayList = (area) => {
    if (area in displayList) {
        // hide other buttons
        for (const key in displayList) {
            if (key !== area) {
                displayList[key] = false
            }
        }
        displayList[area] = !displayList[area];
    }
}

const hideAllDropdowns = () => {
    for (const key in displayList) {
        displayList[key] = false;
    }
}

const handleButtonClick = (item) => {
    props.onButtonClick(item);
    hideAllDropdowns();
}
/*** display - end ***/

/*** search - begin  ***/
const searchKeyWord = ref("");
const searchResultList = reactive([]);

const checkSearchResult = (keyword) => {
    searchResultList.splice(0, searchResultList.length);
    if (keyword !== "") {
        for (const key in props.dropdownData)
        {
            props.dropdownData[key].forEach((element) => {
                if (element.itemName.includes(keyword))
                {
                    searchResultList.push(element)
                }
            });
        }
    }
}
watch (searchKeyWord, () => {
    checkSearchResult (searchKeyWord.value);
})
/*** search - end  ***/


const getIdRef = (className) => "dropdownMenu-" + className;
const getButtonId = (item) => {
    const output = "button-" + item.className + "-" + item.itemName;
    return output;
}

onMounted(() => {
    refreshDisplayList();
})

watch (() => props.dropdownData, () => {
    refreshDisplayList();
}, {deep: true})

</script>



<template>
    <div class="relative" @click="hideAllDropdowns()">
        <div class="button-section grid grid-cols-2
                    md:grid-cols-4 lg:grid-cols-6 p-3 mx-auto">
            <div v-for="className in Object.keys(props.dropdownData)" :key="className"
                class="mx-auto my-auto p-2">
                <button class="flex flex-col btn_class text-slate-600"
                    type="button" :id="getIdRef(className)"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"
                    @click.stop="updateDisplayList(className)"
                >
                    {{ className }}<br>
                    <hr class="w-full mx-auto my-1"><br>
                    ({{ props.dropdownData[className].length }})
                </button>
                <div class="absolute mt-2 origin-top-right rounded bg-white shadow
                            ring-1 ring-black/5 overflow-auto w-50 h-50
                            -translate-x-1/5 border border-slate-400"
                    v-if="displayList[className]"
                    :aria-labelledby="getIdRef(className)" role="menu"
                    aria-orientation="vertical" tabindex="-1"
                >
                    <div v-for="item in props.dropdownData[className]" type="button"
                            role="menuitem" tabindex="-1" :id=getButtonId(item)
                            class="px-4 py-2 text-sm text-gray-700
                                    hover:text-slate-100 hover:bg-gray-600"
                            @click.stop="handleButtonClick(item)">
                        {{ item.itemName }}
                    </div>
                </div>
            </div>
        </div>
        <hr class="w-8/9 mx-auto border-slate-400">
        <!-- search item -->
        <div class="py-4 px-3">
             <div class="flex flex-row justify-evenly py-2">
                <div class="my-auto">
                    <label for="searchInput" class="font-bold text-lg text-slate-600">
                        Keyword:
                    </label>
                    <input type="text"
                            id="searchInput"
                            placeholder="keyword for station"
                            v-model.trim="searchKeyWord"
                            class="border rounded py-1 px-2 mx-2 my-1
                                    text-gray-700 border-stone-400">
                </div>
                <div>
                    <button class="btn_class text-slate-600"
                            type="button" :id="getIdRef(resultDisplay)"
                            @click.stop="updateDisplayList(resultDisplay)">
                        Result ({{ searchResultList.length }})
                    </button>
                    <div class="absolute mt-2 origin-top-right rounded bg-white shadow
                                ring-1 ring-black/5 overflow-auto w-50 h-50
                                -translate-x-1/5 border border-slate-400 z-5"
                        v-if="displayList[resultDisplay]"
                        :aria-labelledby="getIdRef(className)" role="menu"
                        aria-orientation="vertical" tabindex="-1"
                    >
                        <div v-for="item in searchResultList" type="button"
                                role="menuitem" tabindex="-1" :id=getButtonId(item)
                                class="px-4 py-2 text-sm text-gray-700
                                        hover:text-slate-100 hover:bg-gray-700"
                                @click.stop="handleButtonClick(item)">
                            {{ item.itemName }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>
