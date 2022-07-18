import { Ref } from 'vue';

type Rnum = Ref<number>;

export interface State<T, U extends string> {
  get: () => T,
  send: (message: U, payload: any) => T
}

// sink is the zero element
// it has no state, can take any message, and always consumes the whole payload
export const sink : State<undefined, string> = {
  get: () => undefined,
  send: (_, payload: any) => payload
}

export function max(cap: () => Rnum) : State<Rnum, string> { 
  return {
    get: cap, 
    send: (_, x: Rnum) => x > cap().value ? cap().value: x,
  }
}

export function mkAdder<T extends string>(value: ()=>Rnum, maxMsg: T, maxState: State<Rnum, T>) : State<Rnum,'plus'> {
  let state = value;
  return {
    get: state,
    send: (message: 'plus', addend: Rnum) => {
      const sum = state().value + addend;
      const used = maxState.send('', sum);
      const unusable = sum - used;
      state().value = sum - unusable;
      return addend - unusable;
    }
  }
}

export const delay = (ms: Rnum, it: TimerHandler ) => new Promise(_ => setTimeout(it, ms));
export function act( state : State<any, any>, message: any, value: unknown) { queue.push([state, message, value])};

let queue : [state : State<any, any>, message: any, value: unknown][] = [];
function runQueue() { 
  while (queue.length > 0) {
    const action = queue.shift()!;
    console.log( {sending: action[2],  used: action[0].send(action[1], action[2]), stateValue: action[0].get()});
  }
}

export function abortQueue() {
  queue = [];
}

let time = 0;
function gameLoop(elapsedTime: Rnum) {
   const t = elapsedTime / 1000;
   const delta = t - time;
   if (delta >= .1) {
      time = t;
      runQueue();
   }
   window.requestAnimationFrame(gameLoop);
}

export const startGameLoop = () => window.requestAnimationFrame(gameLoop);
