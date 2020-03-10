// demo generator, as if loaded from server
const demoGenerator = {
  title: 'My awesome generator',
  graph: {
    nodes: [
      {
        id: 1,
        type: 'start',
        ui: {
          x: -50,
          y: -50,
        },
      },
      {
        id: 2,
        type: 'text',
        value: 'hello',
        ui: {
          x: 300,
          y: -100,
        },
      },
      {
        id: 3,
        type: 'text',
        value: 'good morning',
        ui: {
          x: 300,
          y: 0,
        },
      },
      {
        id: 4,
        type: 'text',
        value: 'the brown fox jumps over the lazy dog again and again',
        ui: {
          x: 300,
          y: 100,
        },
      },
      {
        id: 5,
        type: 'text',
        value:
          'Sorry losers and haters, but my I.Q. is one of the highest -and you all know it! Please don’t feel so stupid or insecure,it’s not your fault',
        ui: {
          x: 300,
          y: 175,
        },
      },
    ],
    edges: [
      { from: { id: 1 }, to: { id: 2 } },
      { from: { id: 1 }, to: { id: 3 } },
      { from: { id: 1 }, to: { id: 4 } },
      { from: { id: 1 }, to: { id: 5 } },
    ],
  },
};

export async function getGenerator() {
  return Promise.resolve(demoGenerator);
}
