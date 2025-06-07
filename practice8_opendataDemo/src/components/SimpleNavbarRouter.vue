<script setup>
import { ref } from 'vue';

const props = defineProps ({
    routerInfo: {
        type: Array,
        default: [{name: "Home", linkUrl: "/"}]
    }
})
const linkButtonClass = ref(`text-lg px-2 hover:bg-white`);

</script>

<template>
    <div class="flex flex-col mx-auto border">
        <RouterLink v-for="item in props.routerInfo" :to="item.linkUrl" :key="item.name" 
            :class="linkButtonClass"
        >
            {{ item.name }}
        </RouterLink>
    </div>
</template>

<style scoped>
</style>