<script setup>
import { ref } from 'vue'
const props = defineProps({
    spliter: {
        type: String,
        default: ":"
    }
})

</script>
<template>
    <div class="spliter-component">{{  spliter }}</div>
</template>

<style scoped>

.spliter-component {
    font-size: 60px;
    margin: auto;
}
</style>