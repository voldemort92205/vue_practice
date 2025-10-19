<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useWindowSize } from '@vueuse/core';

const props = defineProps ({
    headerMessage: {
        type: String,
        default: "hello",
    },
    routerInfo: {
        type: Array,
        default: [{name: "home", linkUrl: "/"}],
    }
})

const showMenu = ref(false);
const menuBarChange = () => {
    showMenu.value = !showMenu.value;
}

// highlight current page
const route = useRoute();
const currentPath = ref("");
watch(() => route.path, (newPath) => {
    currentPath.value = newPath;
});

// handle window size
const {width, height} = useWindowSize();
const isLargeSize = ref(true);
watch (() => width.value, () => {
    checkWindowSize();
})
const checkWindowSize = () => {
    isLargeSize.value = width.value >= 1072;
}

onMounted (() => {
    checkWindowSize();
})
</script>

<template>
    <div class="sticky top-0 z-10">
    <header class="w-full bg-white dark:bg-zinc-800
                    border-b border-gray-300
                    opacity-90 grid grid-cols-2 z-10
                    h-16">
        <div class="text-2xl my-auto px-5 md:text-3xl">
            <!-- hardcoe the homepage link here -->
            <RouterLink to="/" key="home-button"
            >
                {{ props.headerMessage }}
            </RouterLink>
        </div>

        <div class="my-auto flex justify-center" v-if="isLargeSize">
            <!-- large window size -->
            <RouterLink v-for="item in props.routerInfo"
                    :to="item.linkUrl" :key="item.name"
                    class="flex flex-row px-1 py-1 text-lg hover:bg-slate-200
                            rounded hover:dark:bg-slate-600 mx-1"
                    :class="[currentPath === item.linkUrl? 'text-red-900' : '' ]"
            >
                {{ item.name }}
            </RouterLink>
        </div>
        <div class="my-auto absolute right-0 pr-6" v-if="!isLargeSize">
            <!-- small window size -->
            <button type="button" style="cursor: pointer;"
                    class="h-15 w-15 my-auto text-xl"
                    @click="menuBarChange">
                <i class="fa-solid fa-bars"></i>
            </button>
        </div>
    </header>
    <div v-if="showMenu && !isLargeSize"
        class="sticky top-0 h-screen bg-white/60 dark:bg-zinc-800/60"
        @click="menuBarChange">
        <div class="w-2/4 mx-auto flex flex-col justify-center border bg-white dark:bg-zinc-800"
            @click="menuBarChange">
        <RouterLink v-for="item in props.routerInfo"
                    :to="item.linkUrl" :key="item.name"
                    class="flex flex-row px-2 py-2 text-xl hover:bg-slate-200
                            rounded hover:dark:bg-slate-600"
                    @click="menuBarChange"
        >
            {{ item.name }}
        </RouterLink>
        </div>
    </div>

    </div>
</template>

<style scoped>
</style>