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
        id: 2,
        type: 'text',
        value: 'good morning',
        ui: {
          x: 300,
          y: 100,
        },
      },
    ],
    edges: [],
  },
};

export async function getGenerator() {
  return Promise.resolve(demoGenerator);
}
