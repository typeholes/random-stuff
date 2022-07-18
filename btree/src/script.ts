import { reactive } from 'vue';
import {
   Instruction,
   mkCollector,
   onInstruction,
   deepenOn,
   onAll,
   runStep,
   ExpandedStep,
   State
} from './commands';

export const state = reactive({
   cnt: undefined as undefined | number,
   current: -1,
   debug: '',
   idx: 0,
});

const tuple = <A, B>(a: A, b: B): [A, B] => [a, b];
const triple = <A, B, C>(a: A, b: B, c: C): [A, B, C] => [a, b, c];

const noop = Instruction.command('do nothing', (st) => {
});

const initialized = Instruction.predicate('Count is initialized', (st) => typeof st.cnt !== 'undefined');

const initCnt = Instruction.command('Initialize Count to 0', (st) =>
   tuple(true, (st.cnt = 0))
);

const ifInitialized = Instruction.if('if', initialized, noop, initCnt);

const inc = Instruction.command('Increment Count', (st) =>
   tuple(true, st.cnt++)
);
const repeatInc = Instruction.repeat('repeat increment', [inc]);

const puke = Instruction.command('Throw exception', (st) => {
   throw new Error('puked');
});

export const main = Instruction.block('main', [
   ifInitialized,
   /*puke,*/ repeatInc,
]);

const collector = mkCollector();
onInstruction(main, deepenOn(onAll(collector)));

export const testCommands = collector.get();

export const mainQueue: ExpandedStep = [main];

export const mkMainQueue = (): ExpandedStep => [main];

export function mkSim(cnt: number, onError: (e: unknown) => void) {

   const initialState = (i: number) : State => ({
      cnt: undefined as undefined | number,
   });

   const queues = Array.apply(null, { length: cnt }).map(() => mkMainQueue());
   const states : State[] =  queues.map( (_, i) => ({
      ...initialState(i),
   })) ;

   function tick() {
      const startTime = performance.now();

      for (let i = 0; i < cnt; i++) {
         try {
            runStep(states[i], queues[i], onError);
         } catch (e) {
            state.debug = String(e);
         }
      }

      return performance.now() - startTime;
   }

   return { states, queues, tick: tick };
}
