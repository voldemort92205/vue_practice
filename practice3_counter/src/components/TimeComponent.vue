<script setup>
import { computed, ref } from 'vue'
import SpliterShow from './SpliterShow.vue';
const props = defineProps({
    "value": {
        type: Object,
        default: ref(0),
    }, 
    "name": {
        type: String,
    },
    "isEnd": {
        type: Boolean,
        default: true,
    },
    "class": {
        type: String,
    }
})


</script>
<template>
    <div class="time-component" :class="class">
        <!-- <p class="time-title">{{ name }}</p> -->
        <div class="time-value">{{ value }}</div>
        <p class="time-title">{{ name }}</p>
    </div>
    
    <SpliterShow v-if="!isEnd" />
</template>

<style scoped>

.time-component {
    border: 5px;
    margin: 20px;
    padding: 20px 40px;
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
.target_reach {
    background-color: red;
}
</style>