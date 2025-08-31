<script setup>
import { computed } from 'vue';

const props = defineProps({
    imageId: {
        type: String,
        required: true,
    },
    currentProgress: {
        type: Number,
        required: true
    },
    totalProgress: {
        type: Number,
        required: true
    },
    width: {
        type: Number,
        default: 200,
    },
    height: {
        type: Number,
        default: 200,
    },
    title: {
        type: String,
        default: "",
    },
    size: {
        type: Number,
        default: 100,
    },
    strokeWidth: {
        type: Number,
        default: 12,
    },
    color: {
        type: String,
        default: '#4caf50',
    },
    bgColor: {
        type: String,
        default: '#e0e0e0',
    },
})

const radius = computed(() => (props.size - props.strokeWidth) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value)

const dashOffset = computed(() => {
    let currentProgress = props.currentProgress;
    let totalProgress = props.totalProgress;
    if (currentProgress < 0)
    {
        currentProgress = 0;
    }
    else if (props.currentProgress > props.totalProgress)
    {
        currentProgress = totalProgress;
    }
    return circumference.value * (1 - currentProgress / totalProgress)
})
</script>

<template>
    <div class="" style="cursor: pointer;">
        <div class="mx-auto">
            <div class="text-lg my-2 mx-auto"> {{ props.title }}</div>
            <svg :width="props.size" :height="props.size" :id="props.imageId">
                <circle
                    class="circle-bg"
                    :r="radius"
                    :cx="props.size / 2"
                    :cy="props.size / 2"
                    :stroke="props.bgColor"
                    :stroke-width="props.strokeWidth"
                    fill="none"
                />

                <circle
                    class="circle-progress-bar"
                    :r="radius"
                    :cx="props.size / 2"
                    :cy="props.size / 2"
                    :stroke="props.color"
                    :stroke-width="props.strokeWidth"
                    fill="none"
                    :stroke-dasharray="circumference"
                    :stroke-dashoffset="dashOffset"
                    stroke-linecap="round"
                    transform="rotate(-90, 50, 50)"
                />
                <text
                    x="50%"
                    y="50%"
                    text-anchor="middle"
                    dominant-baseline="central"
                    class=""
                    >
                    {{ props.currentProgress }}
                </text>
            </svg>
        </div>
    </div>
</template>

<style scoped>
.circle-progress {
  display: block;
}

</style>