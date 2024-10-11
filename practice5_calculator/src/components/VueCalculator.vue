<script setup>
import { ref, watch } from 'vue'

const typeOperator = "operator";
const typeNumber = "number";
const typeInit = "init";
const typeSign = "sign";

const currentInput = ref("0");
const showInput = ref("0");

var lastType = typeInit;
var lastNegative = false;
var lastOperator = "";
var hasPoint = false;
var nLeading0 = 0;


watch (currentInput, () => {
    showInput.value = currentInput.value.slice(-10);
})

const addSign = () => {
    if (lastType == typeInit) {
        currentInput.value = "-";
        lastNegative = true;
    }
    else if (lastType == typeSign) {
        currentInput.value = currentInput.value.slice (0, -1)
                                + (lastNegative ? "+" : "-");
        lastNegative = !lastNegative;
    }
    else if (lastType === typeOperator) {
        currentInput.value += "-";
        lastNegative = true;
    }
    else {
        // lastType === typeNumber
        return ;
    }
    lastType = typeSign;
    nLeading0 = 0;
}

const addNumber = (num) => {
    if (lastType == typeNumber) {
        if (num === ".") {
            if (hasPoint) {
                return ;
            }
            else {
                hasPoint = true;
                nLeading0 = 0;
            }
        }
        else if (num === "0" &&
                 (!hasPoint) &&
                 nLeading0 >= 2){
            return ;
        }
        currentInput.value += num;
        nLeading0 += 1;
    }
    else if (lastType == typeInit) {
        if (num === "0" && nLeading0 >= 1) {
            // do nothing
            console.log (nLeading0)
            return;
        }
        currentInput.value = num;
        nLeading0 += 2;
    }
    else if (lastType == typeSign) {
        currentInput.value += num;
    }
    else if (lastType == typeOperator) {
        if (num === "0") {
            nLeading0 = 1;
        }
        else if (num === ".") {
            // invalid without leading number
            return ;
        }
        else {
            // num !== 0
        }
        currentInput.value += num;
    }
    else {
        return ;
    }

    lastType = typeNumber;
}
const addOperator = (operator) => {
    if (lastType === typeInit) {
        return ;
    }
    else if (lastType === typeOperator) {
        currentInput.value = currentInput.value.slice (0, -1)
                                + operator;
        lastOperator = operator;
    }
    else if (lastType === typeNumber) {
        currentInput.value += operator;
        lastOperator = operator;
    }
    lastType = typeOperator;
    nLeading0 = 0;
    hasPoint = false;
}
const calculateIt = () => {
    currentInput.value = String(eval(currentInput.value))
    console.log ('result: ', currentInput.value)
    resetFlag ();
}

const resetFlag = () => {
    lastType = typeInit;
    lastOperator = "";
    lastNegative = false;
    nLeading0 = 0;
    hasPoint = false;
}
const resetInput = () => {
    console.log ("Reset all");
    resetFlag ();
    currentInput.value = "0";
}
</script>

<template>
    <div class="calculator-container">
        <input class="calculator-screen"
            :value="showInput"></input>
        <div class="btn-container text-center">
            <div class="btn-rows">
                <div class="btn" @click="resetInput">C</div>
                <div class="btn" @click="addSign()">+/-</div>
                <div class="btn" @click="addOperator('%')">%</div>
                <div class="btn btn-operator" @click="addOperator('/')">/</div>
            </div>
            <div class="btn-rows">
                <div class="btn" @click="addNumber('7')">7</div>
                <div class="btn" @click="addNumber('8')">8</div>
                <div class="btn" @click="addNumber('9')">9</div>
                <div class="btn btn-operator" @click="addOperator('*')">x</div>
            </div>
            <div class="btn-rows">
                <div class="btn" @click="addNumber('4')">4</div>
                <div class="btn" @click="addNumber('5')">5</div>
                <div class="btn" @click="addNumber('6')">6</div>
                <div class="btn btn-operator" @click="addOperator('-')">-</div>
            </div>
            <div class="btn-rows">
                <div class="btn" @click="addNumber('1')">1</div>
                <div class="btn" @click="addNumber('2')">2</div>
                <div class="btn" @click="addNumber('3')">3</div>
                <div class="btn btn-operator" @click="addOperator('+')">+</div>
            </div>
            <div class="btn-rows">
                <div class="btn btn0" @click="addNumber('0')">0</div>
                <div class="btn" @click="addNumber('.')">.</div>
                <div class="btn btn-operator" @click="calculateIt">=</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.calculator-container {
    background-color: #222;
    width: 500px;
    height: 600px;
    border-radius: 40px;
}

.calculator-screen {
    background-color: lightgray;
    width: 80%;
    height: 10%;
    border-radius: 10px;
    margin: 40px auto 0px;
    padding: 10px 5px;

    text-align: right;
    font-size: 40px;
}

.btn-container {
    height: 65%;
    width: 80%;
    margin: 60px auto 20px;

    display: flex;
    flex-direction: column;
    justify-content: center;
}

.btn-rows {
    width: 100%;
    display: flex;
    justify-content: center;
}

.btn {
    background-color: white;
    border-radius: 30px;
    width: 70px;
    height: 60px;
    font-size: 40px;
    font-weight: bold;
    margin: 10px auto;

    display: flex;
    justify-content: center;
    align-items: center;
}

.btn0 {
    width: 170px;
}

.btn:hover {
    background-color: yellow;
}

.btn-operator {
    background-color: orange;
}

</style>