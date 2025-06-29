<script setup>
const props = defineProps({
    dataSrc: {
        type: String,
        required: true,
    },
})
</script>

<template>
    <div class="my-2 py-2 text-slate-200">
        Source: <a :href="props.dataSrc" class="hover:bg-stone-600"> here</a>
    </div>
</template>

<style scoped>
</style>