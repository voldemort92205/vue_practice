<script setup>
const props = defineProps({
    "value": {
        type: Number,
        default: 0,
    }, 
    "name": {
        type: String,
    },
})
</script>
<template>
    <div class="time-component pt-2 pb-2 ps-3 pe-3 m-1 position-relative">
        <div class="time-value">{{ value < 10 ? '0' + value : value }}</div>
        <p class="time-title">{{ name }}</p>
    </div>
</template>

<style scoped>
.time-title {
    font-size: 16px;
    position: absolute;
    right: 20px;
    bottom: -12px;
}
.time-value {
    font-size: 65px;
}
</style>