<script setup>

import { ref } from 'vue'
const listClass = ref(`hover:dark:bg-slate-500 hover:bg-slate-200`)
</script>
<template>
    <div class="w-full mx-auto my-6 rounded border py-10">
        <h1>Hello</h1>
        <div class="w-3/4 mx-auto text-left">
            Welcome to the site. I visualize opendata to make users more easily to know more infomation from open data sources.
        </div>

        <div class="py-6 w-3/4 mx-auto text-left">
            Here are resources used in this site.
            <ul class="list-disc list-inside">
                <li :class="listClass">
                    <a href="https://data.gov.tw/">政府資料開放平臺</a>
                </li>
                <li :class="listClass">
                    <a href="https://data.taipei/">臺北市政府資料大平臺</a>
                </li>
            </ul>
        </div>

        <div class="py-6 w-3/4 mx-auto text-left">
            For more discussion, welcome to contact me!!
        </div>
    </div>
</template>

<style lang="css" scoped>

</style>