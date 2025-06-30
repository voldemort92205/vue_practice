<script setup>
import { ref } from 'vue';

const props = defineProps({
    figSrc: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        default: "fig title"
    },
    imgClass: {
        type: String,
        default: "h-30 w-30"
    },
    titleClass: {
        type: String,
        default: "text"
    },
})

const isShowFullScreenFigure = ref(false);
const changeFullScreenStatus = () => {
    isShowFullScreenFigure.value = !isShowFullScreenFigure.value;
}
</script>

<template>
    <div class=" hover:bg-slate-200
                dark:hover:bg-slate-600"
        style="cursor: pointer;">
        <div class="pt-2 font-mono font-medium"
              type="button"
              :class="props.titleClass"
              @click="changeFullScreenStatus">
            {{ props.title }}
        </div>
        <div class="mx-auto" @click="changeFullScreenStatus">
            <img :src="props.figSrc" 
                class="mx-auto p-1 rounded-xl"
                :class="props.imgClass"
            />
        </div>
        <!-- make image cover the screen -->
        <div v-if="isShowFullScreenFigure"
            class="fixed top-0 left-0 mx-auto w-full h-screen bg-white/70 z-10
                    flex justify-center items-center"
             @click.self="changeFullScreenStatus"
        >
            <img :src="props.figSrc" 
                    class="rounded shadow shadow-black mx-auto h-5/6"
                />
            <i class="fa-regular fa-circle-xmark fa-2x absolute top-5 left-<50>"
                @click="changeFullScreenStatus"></i>
        </div>
    </div>

</template>

<style scoped>
</style>