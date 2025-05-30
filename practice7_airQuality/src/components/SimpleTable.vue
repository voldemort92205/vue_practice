<script setup>
import { ref, computed, defineProps, watch } from 'vue'

const defaultPageSize = 10;

const props = defineProps({
    columns: Array,
    data: Array,
    pageSize: {
        type: Number, 
        default: defaultPageSize
    },
    pageCollapse: {
        type: Boolean,
        default: false
    },
    tableWidth: {
        type: String,
        default: "200px"
    },
});

const currentPage = ref(1);
const processedData = ref([]);
const inputKeyword = ref("");

watch (inputKeyword, (keyword) => {
    if (keyword === "" || keyword === ".") {
        processedData.value = [...props.data];
    }
    else {
        processedData.value = props.data.filter ((item) => {
            for (const key in item) {
                if (String(item[key]).includes(keyword))
                    return true;
            }
            return false;
        })
    }
})

const sortingData = () => {
    if (sortKey.value === NA) {
        processedData.value = [...props.data];
    }
    else {
        processedData.value = [...props.data].sort((itemA, itemB) => {
            const valueA = itemA[sortKey.value];
            const valueB = itemB[sortKey.value];

            if (typeof valueA === "number" && typeof valueB === "number") {
                return sortDirection.value === ASC ? valueA - valueB : valueB - valueA;
            } else if (typeof valueA === "string" && typeof valueB === "string") {
                return sortDirection.value === ASC ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
            } else {
            // more data type here
            return 0;
            }
        });
    }
}

const ASC = "asc";
const DASC = "dasc";
const NA = "na"
const sortKey = ref("");
const sortDirection = ref(NA);

// TODO: not all values take effect ...
const tableWidthSet = ref("min-w-[" + props.tableWidth + "]")
watch (() => props.tableWidth, (newValue) => {
    tableWidthSet.value = "min-w-[" + newValue + "]";
})

// render page when data update
watch(() => props.data, () => {
    processedData.value = [...props.data];
}, {deep: true});

const totalPages = computed(() => 
    Math.ceil(props.data.length / props.pageSize)
);

const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value ++;
}
const prevPage = () => {
    if (currentPage.value > 1) currentPage.value --;
}

const sortBy = (key) => {
    // no support sorting when page collapse
    if (props.pageCollapse) return ;

    if (sortKey.value === key) {
        switch(sortDirection.value) {
            case ASC:
                sortDirection.value = DASC;
                break;
            default:
                // cancel sorting
                sortDirection.value = NA;
                sortKey.value = "";
                break;
        }
    }
    else {
        sortKey.value = key;
        sortDirection.value = ASC;
    }

    // clear the keyword while sorting
    if (inputKeyword.value) {
        inputKeyword.value = "";
    }
    sortingData ();
}
</script>

<template>
    <div class="h-full">
        <!-- Search Line -->
        <div class="w-full flex justify-between items-center mb-3 mt-1 pl-3 h-1/15">
            <div>
                <p class="block font-sans text-lg antialiased font-normal leading-normal text-slate-700">
                    共有 {{ props.data.length }} 筆資料
                </p>
            </div>
            <div class="ml-3">
                <div class="relative">
                    <div class="w-full max-w-sm min-w-[200px] relative">
                        <div class="relative">
                            <input
                                class="bg-white w-full pr-11 h-10 pl-3 py-2 bg-transparent placeholder:text-slate-400 
                                        text-slate-700 text-sm border border-slate-200 rounded transition duration-200 ease 
                                        focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                                placeholder="Search..."
                                v-model.trim="inputKeyword"
                            />
                            <button
                                class="absolute h-8 w-8 right-1 top-1 my-auto px-2 flex items-center bg-blue-500 rounded
                                        hover:border-black"
                                type="button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"
                                        class="w-8 h-8 text-slate-200">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div> 
            </div>
        </div>

        <!-- table information with scroll -->
        <div class="relative flex flex-col w-full h-9/10 overflow-auto border
                    text-gray-900 bg-white shadow-md rounded bg-clip-border">
            <table class="text-left">
            <thead>
                <tr>
                <th v-for="(column, index) in columns"
                    :key="column"
                    style="cursor: pointer;"
                    class="p-4 border-b border-slate-200 bg-slate-500 sticky top-0 z-3"
                    :class="[tableWidthSet, (index === 0 ? 'sticky left-0 z-5' : '')]"
                    @click="sortBy(column.key)"

                >
                    <p class="block text-l font-normal leading-none text-slate-50">
                        {{ column.name }}
                        <i v-if="sortKey === column.key" :class="['fas', sortDirection === ASC ? 'fa-sort-up' : 'fa-sort-down']"></i>
                        <i v-else class="fas fa-sort"></i>
                    </p>
                    
                </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, rowIndex) in processedData" :key="rowIndex" class="hover:bg-slate-50 bg-white">
                    <td v-for="(col, colIndex) in columns" :key="col.key"
                            class="p-4 border-b border-slate-300 bg-inherit"
                            :class = "[(colIndex === 0) ? 'sticky left-0' : '']"
                    >
                        <p class="block text-sm text-slate-800" >
                            {{ row[col.key] }}
                        </p>
                    </td>
                </tr>
            </tbody>
            </table>

            <!-- Button for "prev" and "next" -->
            <div v-show="props.pageCollapse"
                    class="flex items-center justify-between p-4 mt-8">
                <p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    Page {{ currentPage }} of {{ totalPages }}
                </p>
                <div>
                    <button @click="prevPage" :disabled="currentPage === 1" type="button"
                            class="select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    >
                        Prev
                    </button>
                    <button @click="nextPage" :disabled="currentPage === totalPages" type="button"
                        class="select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
