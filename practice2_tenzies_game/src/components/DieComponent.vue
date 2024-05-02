<script setup>
import { computed } from 'vue';

const props = defineProps ({
    isHeld: {
        type: Boolean,
        default: false,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
})

const emits = defineEmits (["holdDice"])
const updateDiceStatus = () => {
    emits("holdDice")
}

const className = computed (() => ({
    "die-component-held": props.isHeld,
    "die-component": true,
}))
</script>

<template>
    <div :class="className"
         @click="updateDiceStatus">
        <h2 class="die-value">{{ value }}</h2>
    </div>
</template>

<style scoped>
</style>