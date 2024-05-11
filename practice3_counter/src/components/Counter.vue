<script setup>
import { ref, watch } from 'vue';
import TimeComponent from './TimeComponent.vue';
import TargetShow from './TargetShow.vue';
import SpliterShow from './SpliterShow.vue';
import CounterSetup from './CounterSetup.vue';

const initTarget = "";
const target = ref(initTarget);
const currentDate = ref(0);
const diffSecs = ref(1);
const days = ref(0);
const hours = ref(0);
const mins = ref(0);
const secs = ref(0);
const isTargetReach = ref(false);

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
  }
};

const stopCounter = () => {
  if (timerIsRunningStatus) {
    console.log ('counter stops');
    stopTimer();
    timerIsRunningStatus = false;
    timerCanBeSet = true;
  }
};

const resetCounter = () => {
  stopCounter();
  timerIsRunningStatus = false;
  timerCanBeSet = true;
  target.value = "";
  updateReaminTimeEach (0);
};

const pauseCounter = () => {
  if (!timerCanBeSet && timerIsRunningStatus) {
    stopTimer();
    timerIsRunningStatus = false;
  }
};

const resumeCounter = () => {
  if (!timerCanBeSet &&
      !timerIsRunningStatus &&
      target.value != initTarget) {
    timerIsRunningStatus = true;
    runTimer ();
  }
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
    <div class="blank-block-header-footer"></div>
    <TargetShow :target="target" />
    <div class="counter-table" :class="{targetReach: isTargetReach}">
      <TimeComponent :value="days" name="day"/>
      <SpliterShow />
      <TimeComponent :value="hours" name="hour"/>
      <SpliterShow />
      <TimeComponent :value="mins" name="min"/>
      <SpliterShow />
      <TimeComponent :value="secs" name="sec"/>
    </div>
    <div class="blank-block"></div>
    <CounterSetup
      @runCounter="runCounter"
      @stopCounter="stopCounter"
      @resetCounter="resetCounter"
      @resumeCounter="resumeCounter"
      @pauseCounter="pauseCounter"
      @updateTarget="updateTarget"
      />
    <div class="blank-block-header-footer"></div>
  </div>
</template>

<style scoped>
.blank-block-header-footer {
  height: 100px;
}

.blank-block {
  height: 20px;
}
.counter-container {  
  margin: auto;
  padding: 30px;

  /* in center */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.counter-table {
  display: flex;
  justify-content: center;

  margin: 0 auto 40px;
  padding: 20px 20px 40px;
  max-width: 800px;

  box-shadow: 0px 5px 30px 10px rgb(167, 150, 150);
  border-radius: 10px;
}

.targetReach {
  box-shadow: 0px 5px 20px 10px #e5b604;
}
</style>
