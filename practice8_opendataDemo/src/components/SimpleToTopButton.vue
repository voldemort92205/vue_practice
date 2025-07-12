<script setup>
const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<template>
    <button @click="scrollToTop"
            style="cursor: pointer;"
            class="rounded-full p-2 rounded-xl fixed bottom-12 right-5  
                    bg-white/80 h-9 w-9 hover:bg-slate-300"
    >
        <i class="fa-solid fa-angle-up fa-lg mx-auto my-auto"></i>
    </button>
</template>