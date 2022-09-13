import { Ref } from 'vue';

export interface State<T, U extends string> {
  get: () => T,
  send: (message: U, payload: any) => T
}

// sink is the zero element
// it has no state, can take any message, and always consumes the whole payload
export const sink : State<any, string> = {
  get: () => undefined,
  send: (_, payload: any) => payload
}

export function stateRef<T>(on: Ref<T>) : State<T, 'ref'> {
  return { 
    get: () => on.value,
    send: (message, payload: T) => {on.value = payload; return payload }
  }
}
export function max(cap: () => number) : State<number, 'cap'> { 
  return {
    get: cap, 
    send: (_, x: number) => x > cap() ? cap(): x,
  }
}

export function mkAdder(on: State<number,'ref'> , maxState: State<number, 'cap'>) : State<number,'plus'> {
  let get = on.get;
  return {
    get,
    send: (message: 'plus', addend: number) => {
      const sum = on.get() + addend;
      const used = maxState.send('cap', sum);
      const unusable = sum - used;
      const value = sum - unusable;
      get = () => value;
      on.send('ref',value)
      return addend - unusable;
    }
  }
}

export const delay = (ms: number, it: TimerHandler ) => new Promise(_ => setTimeout(it, ms));
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
function gameLoop(elapsedTime: number) {
   const t = elapsedTime / 1000;
   const delta = t - time;
   if (delta >= .1) {
      time = t;
      runQueue();
   }
   window.requestAnimationFrame(gameLoop);
}

export const startGameLoop = () => window.requestAnimationFrame(gameLoop);
