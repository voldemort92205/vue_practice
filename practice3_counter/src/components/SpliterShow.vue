<script setup>
const props = defineProps({
    spliter: {
        type: String,
        default: ":"
    }
});

</script>
<template>
    <div class="m-auto fs-1">{{  spliter }}</div>
</template>

<style scoped>
</style>