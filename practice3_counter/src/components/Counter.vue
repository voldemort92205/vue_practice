<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import TimeComponent from './TimeComponent.vue'
import TargetShow from './TargetShow.vue'
import SpliterShow from './SpliterShow.vue';

const props = defineProps({
  target: {
    type: Number,
    default: new Date(),
  }
})

const currentDate = ref(0)
const diffSecs = ref(1)
const days = ref(0)
const hours = ref(0)
const mins = ref(0)
const secs = ref(0)
const isAllZero = ref(false)



const getCurrentDate = () => {
  currentDate.value = Math.floor(Date.now() / 1000);
}

const updateReaminTime = () => {
  diffSecs.value = Math.floor(props.target/1000) - currentDate.value
  if (diffSecs.value > 0) {
    days.value = Math.floor(diffSecs.value / 86400);
    hours.value = Math.floor(diffSecs.value % 86400 / 3600);
    mins.value = Math.floor(diffSecs.value % 3600 / 60);
    secs.value = Math.floor(diffSecs.value % 3600 % 60); 
  } else {
    stopTimer();
    days.value = 0;
    hours.value = 0;
    mins.value = 0;
    secs.value = 0;
    console.log ("Target is arrive!!");
  }
}


watch (currentDate, () => {
  updateReaminTime ();
})

let timer = undefined
const runTimer = () => {
  if (timer !== undefined) {
    clearInterval(timer);
  }
  timer = setInterval(() => {
    getCurrentDate();
  }, 1000);
}
const stopTimer = () => {
  if (timer !== undefined) {
    clearInterval (timer);
    timer = undefined;
  }
}
onMounted (() => {
  getCurrentDate();
  console.log ("Begin counting...");
  runTimer();
})


const targetList = [days, hours, mins, secs];
const checkAllZero = () => {
  console.log (targetList.every((item) => {
    console.log (item.value)
  }))
  return targetList.every ((item) => {
    item.value === 0
  })
}

watch (diffSecs, () => {
  return isAllZero.value <= 0
})

const items = [
  {value: days, name: "day", isEnd: false,
    "class": {"visable": !isAllZero.value && days.value == 0,
              "target_reach": isAllZero.value}},
  {value: hours, name: "hour", isEnd: false,
    "class": {"visable": !isAllZero.value && hours.value == 0,
              "target_reach": isAllZero.value}},
  {value: mins, name: "min", isEnd: false,
    "class": {"visable": !isAllZero.value && mins.value == 0,
              "target_reach": isAllZero.value}},
  {value: secs, name: "sec", isEnd: true,
    "class": {"visable": !isAllZero.value && secs.value == 0,
              "target_reach": isAllZero.value}},
]
console.log (items)


const targetProps = {
  "target": props.target,
}

</script>

<template>
  <div class="counter-container">
    <TargetShow v-bind="targetProps"/>
    <div class="counter-table">
      <TimeComponent v-for="item in items"
          v-bind="item"
          key="item['name']"
      />
    </div>
  </div>
</template>

<style scoped>

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

  margin: 0 auto;
  padding: 20px 30px;
  max-width: 900px;

}
</style>
