<script setup lang="ts">
import { ref } from 'vue'
import { state, mainQueue, mkSim, main } from './script'
import { runStep } from './commands'
import TreeStep from './TreeStep.vue';

function step() {
  runStep(state, mainQueue, () => { });
}
  
const simTime = ref(0);

const sim = mkSim(10000, () => { } );

const iterations = 1000;  
function simStep() {
  let times = 0;
	for (let i =0; i<iterations; i++) {
  	times += sim.tick();

//    state.current = sim.states[0].current;
    state.cnt = sim.states[0].cnt;
//  state.debug = sim.states.map( (x) => x.current + ': ' + x.cnt + '\t' + x.debug).join('\n');
  }
  simTime.value = times/iterations;

}  

</script>

<template>
  <h2> Count: {{ state.cnt }}  </h2>
<!--  <h3> step: {{ state.current }}  </h3> -->
  <TreeStep :depth="0" :step="main"></TreeStep>

  <br>
  <button @click="step">run step</button><br>
  <pre style="color: red">
   {{ state.debug }}
  </pre>
  <button @click="simStep">
  	tick simulation
  </button>
  <div>
    {{ simTime }}
  </div>
  <div v-for="instruction in mainQueue">
    {{ instruction.id}}:
    {{ instruction.name}}
  </div>
  <pre>
    {{ sim.states.map( (x) => x.cnt?.toString()).join('\n') }}
  </pre>
</template>

<style>
  * { background-color: black; color: wheat }

    .instructions {
    display: flex;
    flex-direction: row;
  }
  
  button {
    border: 1px solid wheat;
    border-radius: 7px;
  }
  
</style>