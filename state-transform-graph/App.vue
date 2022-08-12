<script setup lang="ts">
import { reactive } from 'vue';


type Transform = 'negate' | 'true' | 'false' | 'same';

type ID = 'check1' | 'check2' | 'app';
type Logic = Record<ID, Partial<Record<Transform, Partial<Record<ID, Transform>>[]>>>;
  
const backingStates = reactive({ 
	check1: false,
  check2: false,
  app: true,
  log: ''
})

const logic /*: Logic*/ = {
  check1: { 'true':  [ {app: 'negate'} ], 'false': [ {app: 'false'} ] },
  check2: { 'true':  [ {app: 'negate'} ], 'false': [ {app: 'false'} ] },
  app: { 'true':  [ {check1: 'true', check2: 'negate'} ],
         'false':  [ {check1: 'false', check2: 'negate'} ],
       }
  } as const;


const boolHandler : Record<Transform, (id: ID) => Transform> = { 
  same: (id: ID) => { return 'same' },
  'true': (id: ID) => { const change = backingStates[id] ? 'same' : 'true'; backingStates[id] = true; return change; },
  'false': (id: " @change="receive('check1', 'negate')"><br>
  check2: <input type="checkbox" :checked="backingStates.check2" @change="receive('check2', 'negate')
  <pre> {{backingStates.log}}</pre>
</div>
</template>ID) => { const change = backingStates[id] ? 'false' : 'same'; backingStates[id] = false; return change; },
	negate: (id: ID) => { const change = backingStates[id] ? 'false' : 'true'; backingStates[id] = !backingStates[id]; return change; },
};
  
function log(s: string) {
  backingStates.log += `${s}\n`;
}  
  
function mkBool(id: ID) {
  return (transform: Transforrm](id);
    log('change: ' + change)
    const transformHandler = logic[id];
    if (typeof transformHandler =mHandler));
    const reactions = transformHandler[change];
    if (typeof reactions === 'undefined') return;
//    log(JSON.stringify(reactions));
    reactions.forEach( (reaction: Partial<Record<ID, Transform>>) => 
      Object.entries(reaction).forEach( (    
  }
}  

const entities = Object.fromEntries( ['check1', 'check2', 'app'].map( (id: ID)=> [id, mkBool(id)]));
  
function receive(id: string, transform: Transform) {
 	 log(`${id}: ${transform}`); 
   entities[id](transform);
}
  
</script>


<template>
<div>
  check1: <input type="checkbox" :checked="backingStates.check1" @change="receive('check1', 'negate')"><br>
  check2: <input type="checkbox" :checked="backingStates.check2" @change="receive('check2', 'negate')"><br>
  app: {{ backingStates.app }} <br>
  <br>
  <pre> {{backingStates.log}}</pre>
</div>
</template>

