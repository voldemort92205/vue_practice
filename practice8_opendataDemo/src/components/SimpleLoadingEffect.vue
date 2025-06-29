<script setup>
const props = defineProps({
    isLoading: {
        type: Boolean,
        default: false,
    },
})
console.log (props)
</script>

<template>
    <div v-if="props.isLoading"
        class="w-full h-screen bg-white/70 fixed top-0 left-0 z-5
                flex justify-center items-center dark:bg-slate-900/70"
    >
        <i class="fa-solid fa-spinner fa-spin-pulse fa-8x"></i>
    </div>
</template>

<style scoped>
</style>