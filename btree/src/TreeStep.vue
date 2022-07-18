<script setup lang="ts">
  import { Instruction } from './commands'  
  import { state } from './script';
const props = defineProps<{ depth: number, step: Instruction }>();

const children = Instruction.getChildren(props.step);

</script>

<template>
  <div >
    <div class="TreeStep" :class="{current: step.id===state.current}"> 
      {{ step.name }}
    </div>
    <div v-for="item in children">
      <TreeStep :depth="depth+1" :step="item"></TreeStep>
    </div> 
  </div>
</template>

<style>

  .current { 
    background-color: #113311;
      color: #FF9999
  }
  
  .TreeStep {
    border-bottom: 1px solid wheat;
    border-left: 1px solid wheat;
    margin-left: v-bind("(depth*5).toString() + 'px'");
    padding-left: 3px;
    text-align: left;
  }
  
  .TreeArr {
    border-left: 1px solid wheat;
    margin-left: v-bind("(depth*5).toString() + 'px'");
    padding-left: 3px;
  }  
</style>