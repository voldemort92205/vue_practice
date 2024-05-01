<script setup>
import { ref } from 'vue'
import DieComponent from './DieComponent.vue'
import {nanoid} from 'nanoid'


const ROLL = "Roll";
const WIN = "New Game";

const tenzies = ref(ROLL)

const generateNewValue = () => {
  return Math.ceil(Math.random() * 6)
}
const generateNewDie = () => {
  return {
    value: generateNewValue (),
    isHeld: false,
    id: nanoid(),
  }
}

const allNewDice = () => {
  const newDice = []
  for (let i = 0; i < 10; i++){
    newDice.push(ref(generateNewDie()))
  }
  return newDice
}

const checkEndGame = () => {
  const isWin = dice.every ((item) => (
    item.value.isHeld &&
    item.value.value == dice[0].value.value
  ))

  if (isWin) {
    tenzies.value = WIN
  }
}

const holdDice = (id) => {
  dice.forEach ((item) => {
    if (item.value.id == id) {
      item.value.isHeld = !item.value.isHeld
    }
  })
  checkEndGame ();
}

const dice = allNewDice()

const updateDice = () => {
  if (tenzies.value == ROLL) {
    dice.forEach ((item) => {
      if (!item.value.isHeld) {
        item.value.value = generateNewValue()
      }
    })
  } else {
    dice.forEach ((item) => {
      item.value.isHeld = false
      item.value.value = generateNewValue();
    })
    tenzies.value = ROLL
  } 
}
</script>

<template>
  <h1 class="title">Tenize</h1>
  <p class="instruction">
    Roll until all dice are the same.
    Click each die to freeze it at its
    current value between rolls.
  </p>
  <div class="die-container">
    <DieComponent v-for="oneDie in dice"
        v-bind="oneDie.value"
        key="oneDie.value.id"
        @holdDice="() => {holdDice(oneDie.value.id)}"
    />
  </div>
  <button class="die-reroller" @click="updateDice">
    {{tenzies}}
  </button>
</template>

<style scoped>
</style>
