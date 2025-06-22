<script setup>
import { ref } from 'vue'
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
        <div class="my-auto absolute right-0 pr-6">
            <button type="button" style="cursor: pointer;"
                    class="h-15 w-15 my-auto text-xl"
                    @click="menuBarChange">
                <i class="fa-solid fa-bars"></i>
            </button>
        </div>
    </header>

    <div v-if="showMenu"
        class="my-auto bg-white absolute top-15 right-10 z-15 rounded">
        <RouterLink v-for="item in props.routerInfo"
                    :to="item.linkUrl" :key="item.name"
                    class="flex flex-row px-2 py-2 hover:bg-slate-200
                            rounded border-1 w-full hover:dark:bg-slate-600"
                    @click="menuBarChange"
        >
            {{ item.name }}
        </RouterLink>
    </div>

    </div>
</template>

<style scoped>
</style>