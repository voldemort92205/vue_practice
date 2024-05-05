<script setup>
import { ref } from 'vue'
const props = defineProps(["target"])
const targetStr = new Date(props.target)
</script>
<template>
    <div class="target-component">
        <h1 class="target-title">Remaining Time</h1>
        <h2 class="target-message">Target:<hr>{{ targetStr }}</h2>
    </div>
</template>

<style scoped>

.time-component {
    border: 5px;
    margin: 20px;
    padding: 20px 40px;
    
    border: solid gray;
}
.time-value {
    font-size: 20px;
}
</style>