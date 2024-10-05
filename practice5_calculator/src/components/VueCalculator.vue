<script setup>
import { ref } from 'vue'

const currentInput = ref('0');
</script>

<template>
    <div class="calculator-container">
        <input class="calculator-screen"
            :value="currentInput"></input>
        <div class="btn-container text-center">
            <div class="btn-rows">
                <div class="btn">C</div>
                <div class="btn">+/-</div>
                <div class="btn">%</div>
                <div class="btn btn-operator">/</div>
            </div>
            <div class="btn-rows">
                <div class="btn">7</div>
                <div class="btn">8</div>
                <div class="btn">9</div>
                <div class="btn btn-operator">x</div>
            </div>
            <div class="btn-rows">
                <div class="btn">4</div>
                <div class="btn">5</div>
                <div class="btn">6</div>
                <div class="btn btn-operator">-</div>
            </div>
            <div class="btn-rows">
                <div class="btn">1</div>
                <div class="btn">2</div>
                <div class="btn">3</div>
                <div class="btn btn-operator">+</div>
            </div>
            <div class="btn-rows">
                <div class="btn btn0">0</div>
                <div class="btn">.</div>
                <div class="btn btn-operator">=</div>
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