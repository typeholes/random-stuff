<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
  import { State, startGameLoop, max, mkAdder, delay, act, abortQueue, sink, stateRef } from './actions'


const cnt = ref(0);
const cntState = stateRef(cnt);

const maxValue = 10;
const incBy = 1;

const maxCnt = ref(10);
const maxCntState = stateRef(maxCnt);
const maxAdder = mkAdder(maxCntState, sink);
  
const maxState = max(maxAdder.get);

const adder = mkAdder(cntState, maxState);


act(adder, 'plus', 1)

function incrementNow() {
	act(adder, 'plus', incBy)  
}  

function incrementLater() {
	delay( 1000, () => act(adder, 'plus', incBy));
}  
  
function reset() {
  abortQueue();
	act(adder, 'plus', -1 * cnt.value)    
}

function increaseMax() {
  act(maxAdder, 'plus', 1);
}

onMounted(startGameLoop)
</script>

<template>
  <button @click="reset">Reset</button>
  <h1> max: {{ maxAdder.get() }}</h1> <button @click="increaseMax">Increase Max</button>
  <h1> cnt: {{ adder.get() }}</h1>
	<label for="incBy">Increment by</label>
  <input id="incBy" v-model="incBy" type=number> <br>
  <button @click="incrementNow">Increment now</button>
  <button @click="incrementLater">Increment later</button>
    
</template>

<style>
  * {
    background-color: black;
    color: wheat;      
  }
  button {
    border: 1px solid wheat;
    border-radius: 7px; 
  }
</style>