<script setup>
import {ref, watch} from 'vue';

const emits = defineEmits(['runCounter',
                            'stopCounter',
                            'resetCounter',
                            'pauseCounter',
                            'resumeCounter',
                            'updateTarget'
                        ]);

const timeInput = ref('00:00');
const dateInput = ref(new Date().toISOString().slice(0, 10));

const runUpdateTarget = () => {
    const dateArr = dateInput.value.split("-")
    const timeArr = timeInput.value.split(":")
    if (dateInput.value != "" && timeInput.value != "")
    {
        const epoch = new Date(dateArr[0], dateArr[1]-1, dateArr[2],
                                timeArr[0], timeArr[1]).getTime()
        emits('updateTarget', epoch);
    }
};

watch ([dateInput, timeInput], () => {
    runUpdateTarget();
});
</script>

<template>
    <div class="setup-containter d-flex flex-column justify-content-around">
        <h1 class="setup-title">Input Target</h1>
        <div class="setup-section d-flex flex-column justify-content-around">
            <div class="input-section d-flex justify-content-evenly">
                <div class="date-section">
                    <label for="counter-date">Date: </label>
                    <input type="date" id="counter-date" v-model="dateInput"/>
                </div>
                <div class="time-section">
                    <!-- TODO: fix it: There is no dropdown on firefox browser -->
                    <label for="counter-time">Time: </label>
                    <input type="time" id="counter-time" v-model="timeInput" />
                </div>
            </div>
            <div class="ctr-section d-flex justify-content-evenly">
                <button class="btn btn-outline-dark" @click="$emit('runCounter')">Run</button>
                <button class="btn btn-outline-dark" @click="$emit('stopCounter')">Stop</button>
                <button class="btn btn-outline-dark" @click="$emit('pauseCounter')">Pause</button>
                <button class="btn btn-outline-dark" @click="$emit('resumeCounter')">Resume</button>
                <button class="btn btn-outline-danger" @click="$emit('resetCounter')">Reset</button>
            </div>
        </div>
    </div>
</template>


<style scoped>
.setup-containter {
    width: 90%;
    margin: 60px auto;

}
.setup-section {
    width: 80%;
    margin: 10px auto;
}

.input-section {
    padding: 5px 10px;
    margin: 10px 0;
}

.ctr-section {
    margin-top: 20px;
    padding: 5px 10px;
}

</style>