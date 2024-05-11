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
    <div class="counter-setup-containter">
        <h1 class="setup-title">Input Target</h1>
        <div class="setup-section">
            <div class="input-section">
                <div class="setup-date-section">
                    <label for="counter-date">Date: </label>
                    <input type="date" id="counter-date" v-model="dateInput"/>
                </div>
                <div class="setup-time-section">
                    <!-- TODO: fix it: There is no dropdown on firefox browser -->
                    <label for="counter-time">Time: </label>
                    <input type="time" id="counter-time" v-model="timeInput" />
                </div>
            </div>
            <div class="control-section">
                <button class="control-button normal-button" @click="$emit('runCounter')">Run</button>
                <button class="control-button normal-button" @click="$emit('stopCounter')">Stop</button>
                <button class="control-button normal-button" @click="$emit('pauseCounter')">Pause</button>
                <button class="control-button normal-button" @click="$emit('resumeCounter')">Resume</button>
                <button class="control-button alert-button" @click="$emit('resetCounter')">Reset</button>
            </div>
        </div>
    </div>
</template>


<style scoped>

.counter-setup-containter {
    width: 90%;
    margin: 0 auto;

    display: flex;
    flex-direction: column;
    justify-content: center;
}
.setup-section {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    width: 80%;
    margin: 0 auto;
}

.input-section {
    padding: 5px 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
}

.control-section {
    margin-top: 20px;
    padding: 5px 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
}

.control-button {
    margin: 5px 5px;
    width: 80px;
    height: 30px;
    text-align: center;
    font-size: 14px;
    box-shadow: 0px 1px 1px 1px rgb(167, 150, 150);
    border-radius: 10px;
}
.normal-button:hover {
    border: solid blue;
    filter: drop-shadow(0 0 1em #646cffaa);
    color: blue
}

.alert-button:hover {
    border: solid red;
    color: red;
    filter: drop-shadow(0 0 1em rgb(221, 49, 49));
}
</style>