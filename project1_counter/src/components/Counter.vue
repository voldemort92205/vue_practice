<script setup>
import {computed, ref} from 'vue'

const counter = ref(0)
const dx = ref(1)
const dxInput = ref("")

const increase = () => {
    counter.value += dx.value
}
const decrease = () => {
    if (counter.value >= dx.value) {
        counter.value -= dx.value
    } else {
        counter.value = 0
    }    
}
const reset0 = () => {
    counter.value = 0
    dxInput.value = ""
    dx.value = 1
}

const updateDx = (e) => {
    if(e.target.value.match(/^\d+$/)){
        dx.value = parseInt(e.target.value)
    }
}
</script>

<template>
    <h1>Counter Page</h1>
    <div class="display">Current Counter: {{ counter }}</div>
    <div class="buttons">
        <button @click="increase">++</button>
        <button @click="decrease">--</button>
        <button @click="reset0">reset</button>
    </div>
    <div class="dx-setting">
        Set dx: <input type="text"
                v-model="dxInput" 
                @input="updateDx"
                placeholder="input numerical value (>= 0)"
        >
        <div>Current dx: {{ dx }}</div>
    </div>
</template>

<style scoped>

.display{
    font-size: 30px;
    border-color: black;
    margin: 20px;
    color: red;
}

button {
    margin: 5px;
    background-color: gray;
    color: white;
}
button:hover {
  filter: drop-shadow(0 0 1em #646cffaa);
}


.dx-setting {
    margin: 10px;
    margin-top: 20px;
}

</style>