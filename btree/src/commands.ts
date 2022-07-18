export interface State {
   cnt: undefined | number;
}

export interface Tagged<T extends Tag, U> {
   tag: T;
   value: U;
}

type Named = { name: string; id: number };

export type Tag = 'predicate' | 'command' | 'if' | 'block' | 'repeat';

export interface TagInstruction {
   predicate: Predicate;
   command: Command;
   if: If;
   block: Block;
   repeat: Repeat;
}

export type OnTag<U> = {
   [P in keyof TagInstruction]: (instruction: TagInstruction[P]) => U;
};

export type Predicate = {
   tag: 'command';
   value: (st: State) => boolean;
} & Named;

export type Command = {
   tag: 'command';
   value: (st: State) => void;
} & Named;

export type If = {
   tag: 'if';
   value: [Predicate, Instruction, Instruction];
} & Named;

export type Block = { tag: 'block'; value: Instruction[] } & Named;

export type Repeat = { tag: 'repeat'; value: Instruction[] } & Named;

export type Instruction = TagInstruction[Tag] & Named;

const getChildren: OnTag<Instruction[]> = {
   predicate: (i) => [],
   command: (i) => [],
   block: (i) => [...i.value].reverse(),
   repeat: (i) => [...i.value].reverse(),
   if: (i) => i.value.slice(1),
};

let instructionIdCounter = 0;
export const Instruction = {
   predicate: (name: string, value: Predicate['value']): Predicate => ({
      tag: 'command' as const,
      name,
      value,
      id: instructionIdCounter++,
   }),
   command: (name: string, value: Command['value']): Command => ({
      tag: 'command' as const,
      name,
      value,
      id: instructionIdCounter++,
   }),
   block: (name: string, value: Block['value']): Block => ({
      tag: 'block' as const,
      name,
      value: value.reverse(),
      id: instructionIdCounter++,
   }),
   repeat: (name: string, value: Repeat['value']): Repeat => ({
      tag: 'repeat' as const,
      name,
      value: value.reverse(),
      id: instructionIdCounter++,
   }),
   if: (
      name: string,
      _if: If['value'][0],
      _then: If['value'][1],
      _else: If['value'][2]
   ): If => ({
      tag: 'if' as const,
      name,
      value: triple(_if, _then, _else),
      id: instructionIdCounter++,
   }),
   getChildren: (i: Instruction) => onInstruction(i, getChildren),
} as const;

export function onAll<U>(fn: (instruction: Instruction) => U): OnTag<U> {
   return {
      predicate: (i) => fn(i),
      block: (i) => fn(i),
      repeat: (i) => fn(i),
      command: (i) => fn(i),
      if: (i) => fn(i),
   };
}

export function deepenOn<U>(
   onTag: OnTag<U>,
   order: 'pre' | 'post' = 'pre'
): OnTag<U> {
   const deep: OnTag<U> = { ...onTag };

   if (order === 'pre') {
      deep['block'] = (x) => {
         const ret = onTag['block'](x);
         x.value.forEach((i) => onInstruction(i, deep));
         return ret;
      };
      deep['if'] = (x) => {
         const ret = onTag['if'](x);
         x.value.forEach((i) => onInstruction(i, deep));
         return ret;
      };
   } else {
      deep['block'] = (x) => {
         x.value.forEach((i) => onInstruction(i, deep));
         return onTag['block'](x);
      };
      deep['if'] = (x) => {
         x.value.forEach((i) => onInstruction(i, deep));
         return onTag['if'](x);
      };
   }

   return deep;
}

export function onInstruction<U>(instruction: Instruction, onTag: OnTag<U>) {
   return onTag[instruction.tag](instruction as U2I<typeof instruction>);
}

// crappy shortcut to fix lookup of a map of functions returning their intersection
type U2I<U> = (U extends U ? (u: U) => 0 : never) extends (i: infer I) => 0
   ? Extract<I, U>
   : never;

const tuple = <A, B>(a: A, b: B): [A, B] => [a, b];
const triple = <A, B, C>(a: A, b: B, c: C): [A, B, C] => [a, b, c];
/////////////////////////////////

export const mkCollector = <T>() => {
   const arr: T[] = [];
   const fn = (t: T) => arr.push(t);
   fn.get = () => arr;
   return fn;
};

export type ExpandedStep = Instruction[];
const expandStep = (
   queue: Instruction[],
   instruction: Instruction,
   st: State
) => {};

export function runStep(st: State, queue: Instruction[], onError: (e: unknown) => void): void {
return;
   if (queue.length === 0) {
      return;
   }

   const instruction = queue.pop()!;
//   st.current = instruction.id;

   try {
      switch (instruction.tag) {
         case 'command':
            instruction.value(st);
            break;
         case 'block':
            queue.push(...instruction.value);
            break;
         case 'repeat':
            queue.push(instruction, ...instruction.value);
            break;
         case 'if':
            queue.push(
               instruction.value[instruction.value[0].value(st) ? 1 : 2]
            );
            break;
      }
   } catch (e) {
      onError(e)
   }
}
