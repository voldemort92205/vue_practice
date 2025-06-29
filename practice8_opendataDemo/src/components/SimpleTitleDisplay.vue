<script setup>
const props = defineProps ({
  h1Title: {
    type: String,
    default: "Title...",
  }
})
</script>
<template>
    <div class="text-4xl font-bold py-6">
        {{ props.h1Title }}
    </div>
</template>