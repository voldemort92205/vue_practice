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
const linkButtonClass = ref(`px-2 hover:bg-slate-200
    py-3 mx-1 border-b-2 hover:border-b-4 hover:dark:bg-slate-600`);
</script>

<template>
    <header class="h-16 bg-white dark:bg-zinc-800 
                    border-b border-gray-300  
                    absolute top-0 opacity-90 z-10 grid grid-cols-2">
        <div class="text-3xl my-auto px-5">
            <!-- hardcoe the homepage link here -->
            <RouterLink to="/" :key="home-button" 
            >
                {{ props.headerMessage }}
            </RouterLink>
        </div>
        <div class="my-auto">
            <RouterLink v-for="item in props.routerInfo" :to="item.linkUrl" :key="item.name" 
                :class="linkButtonClass"
            >
                {{ item.name }}
            </RouterLink>
        </div>
    </header>
</template>

<style scoped>
</style>