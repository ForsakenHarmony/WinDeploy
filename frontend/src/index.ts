import { createMachine, state, transition } from "robot3";

const machine = createMachine(
  {
    red: state(transition("next", "green")),
    yellow: state(transition("next", "red")),
    green: state(transition("next", "yelloww"))
  },
  () => ({})
);

type StringOnly<T> = T extends string ? T : never;

type Test<S extends string> = {
  thing: S
};

type Wew<T = { a: 2, c: 3 }> = Test<StringOnly<keyof T>>;

type K = Wew<{ b: 3, n: 5}>;
