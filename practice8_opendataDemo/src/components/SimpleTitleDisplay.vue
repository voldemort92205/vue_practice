<script setup>
const props = defineProps ({
  h1Title: {
    type: String,
    default: "Title...",
  }
})
</script>
<template>
    <div class="text-3xl font-bold underline py-6 text-slate-600 
                dark:text-slate-200 font-mono">
        {{ props.h1Title }}
    </div>
</template>