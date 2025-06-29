<script setup>
import { ref } from 'vue'
const currentYear = ref(new Date().getFullYear());
const author = ref("perry");
const github = ref("https://github.com/voldemort92205");
const facebook = ref ("https://facebook.com/");
const mail = ref ("");
</script>

<template>
    <footer class="dark:bg-zinc-800 bg-white">
        <div>
            <hr>
        </div>
        <div class="md:grid md:grid-cols-2">
            <div class="my-auto pt-2">
                &copy; {{ currentYear }} {{ author }}™. <br>
                All Rights Reserved.<br>
            </div>
            <div class="flex justify-center flex-row my-auto">
                <a :href="github" target="_blank" class="footer_icon">
                    <i class="fa-brands fa-github fa-xl"></i>
                </a>
                <a :href="facebook" target="_blank" class="footer_icon">
                    <i class="fa-brands fa-facebook fa-xl"></i>
                </a>
                <a :href="'mailto:' + mail" target="_blank" class="footer_icon">
                    <i class="fa-solid fa-envelope fa-xl"></i>
                </a>
            </div>
        </div>
        <div class="py-2 font-medium">
            僅供自我練習使用，並無商業用途
        </div>
    </footer>
</template>