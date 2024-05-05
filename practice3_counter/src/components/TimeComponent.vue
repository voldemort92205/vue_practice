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
    <div class="time-component">
        <div class="time-value">{{ value < 10 ? '0' + value : value }}</div>
        <p class="time-title">{{ name }}</p>
    </div>
</template>

<style scoped>

.time-component {
    border: 5px;
    margin: 5px;
    padding: 10px 20px;
    position: relative;
}
.time-title {
    font-size: 16px;
    position: absolute;
    right: 0%;
}
.time-value {
    font-size: 90px;
}
</style>