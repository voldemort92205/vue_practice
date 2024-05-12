<script setup>
import { ref, watch } from 'vue'
const props = defineProps(["target"])
const targetStr = ref('');

watch (()=> props.target, () => {
    const output = new Date(props.target)
    if (isNaN(output)) {
        targetStr.value = "";
    } else {
        targetStr.value = output;
    }
});

</script>
<template>
    <div class="pt-0 pb-0 ps-5 pe-5 mb-5">
        <h1 class="fs-1">Remaining Time</h1>
        <h2 class="fs-4">Target: <hr> {{ targetStr }}</h2>
    </div>
</template>

<style scoped>
</style>