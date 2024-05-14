<script setup>
import { ref, watch } from 'vue';
import TimeComponent from './TimeComponent.vue';
import TargetShow from './TargetShow.vue';
import SpliterShow from './SpliterShow.vue';
import CounterSetup from './CounterSetup.vue';
import { buttonStat } from './constants';

const initTarget = "";
const target = ref(initTarget);
const currentDate = ref(0);
const diffSecs = ref(1);
const days = ref(0);
const hours = ref(0);
const mins = ref(0);
const secs = ref(0);
const isTargetReach = ref(false);
const currentButton = ref(buttonStat.NONE);

const getCurrentDate = () => {
  currentDate.value = Math.floor(Date.now() / 1000);
};

const updateReaminTimeEach = (val) => {
  days.value = Math.floor(val / 86400);
  hours.value = Math.floor(val % 86400 / 3600);
  mins.value = Math.floor(val % 3600 / 60);
  secs.value = Math.floor(val % 3600 % 60);
};

const updateReaminTime = () => {
  diffSecs.value = Math.floor(target.value/1000) - currentDate.value
  if (diffSecs.value > 0) {
    isTargetReach.value = false;
    updateReaminTimeEach(diffSecs.value);
  } else {
    stopTimer();
    updateReaminTimeEach(0);
    isTargetReach.value = true;
    timerIsRunningStatus = false;
    timerCanBeSet = true;
    currentButton.value = buttonStat.NONE;
    console.log ("Target is arrive!!");
  }
};

watch (currentDate, () => {
  updateReaminTime ();
});

let timer = undefined;
let timerIsRunningStatus = false;
let timerCanBeSet = true;

const runTimer = () => {
  if (timer !== undefined) {
    clearInterval(timer);
  }
  timer = setInterval(() => {
    getCurrentDate();
  }, 1000);
};

const stopTimer = () => {
  if (timer !== undefined) {
    clearInterval (timer);
    timer = undefined;
  }
};

const runCounter = (timeStr) => {
  if (!timerIsRunningStatus) {
    if (target.value == initTarget) {
      target.value = Date.now()
    }
    console.log ("Begin counting...");
    getCurrentDate();
    runTimer ();
    timerIsRunningStatus = true;
    timerCanBeSet = false;
    currentButton.value = buttonStat.RUN;
  }
};

const stopCounter = () => {
  if (timerIsRunningStatus) {
    console.log ('counter stops');
    stopTimer();
    timerIsRunningStatus = false;
    timerCanBeSet = true;
    currentButton.value = buttonStat.STOP;
  }
};

const resetCounter = () => {
  stopCounter();
  timerIsRunningStatus = false;
  timerCanBeSet = true;
  target.value = initTarget;
  isTargetReach.value = false;
  currentButton.value = buttonStat.NONE;
  updateReaminTimeEach (0);
};

const updateTarget = (val) => {
  if (timerCanBeSet) {
    target.value = val;
  } else {
    console.log ("There is a counter process...")
  }
};
</script>

<template>
  <div class="counter-container">
    <TargetShow :target="target" />
    <div class="counter-table shadow-lg rounded d-flex flex-row rounded rounded-4"
        :class="{alert: isTargetReach, 'alert-danger': isTargetReach,}"
        >
      <TimeComponent :value="days" name="day"/>
      <SpliterShow />
      <TimeComponent :value="hours" name="hour"/>
      <SpliterShow />
      <TimeComponent :value="mins" name="min"/>
      <SpliterShow />
      <TimeComponent :value="secs" name="sec"/>
    </div>
    <CounterSetup
      @runCounter="runCounter"
      @stopCounter="stopCounter"
      @resetCounter="resetCounter"
      @updateTarget="updateTarget"
      :btnStat="currentButton"
      />
  </div>
</template>

<style scoped>
.blank-block {
  height: 20px;
}
.counter-container {  
  margin: 90px auto 80px;
  width: 90%;
  max-width: 900px;
}

.counter-table {
  margin: 20px auto 60px;
  padding: 20px 20px 40px;
  max-width: 800px;
}
</style>
