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
    <div class="target-component">
        <h1 class="target-title">Remaining Time</h1>
        <h2 class="target-message">Target: {{ targetStr }}</h2>
    </div>
</template>

<style scoped>
.target-component {
    border: 1px;
    margin: 0 auto 40px;
    width: 100%;
    padding: 0px 10px;
}
.target-message {
    font-size: 20px;
}
</style>