import axios from 'axios';

const newGenerator = {
  title: 'New generator',
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
        value: ['Once upon a time'],
        ui: {
          x: 300,
          y: -50,
        },
      },
    ],
    edges: [{ from: { id: 1 }, to: { id: 2 } }],
  },
};
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
        value: ['hello'],
        ui: {
          x: 300,
          y: -100,
        },
      },
      {
        id: 3,
        type: 'text',
        value: ['good morning'],
        ui: {
          x: 300,
          y: 0,
        },
      },
      {
        id: 4,
        type: 'text',
        value: ['the brown fox jumps over the lazy dog again and again'],
        ui: {
          x: 300,
          y: 100,
        },
      },
      {
        id: 5,
        type: 'text',
        value: [
          'Sorry losers and haters, but my I.Q. is one of the highest -and you all know it! Please don’t feel so stupid or insecure,it’s not your fault',
        ],
        ui: {
          x: 300,
          y: 175,
        },
      },
      {
        id: 6,
        type: 'text',
        title: 'héro',
        value: ['hamsters', 'dingo babies', 'various other things'],
        ui: {
          x: -400,
          y: -200,
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

const ax = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // 'http://localhost:5000',
  withCredentials: true,
});

export default {
  login(username, password) {
    return ax
      .post('/api/login', { username, password })
      .then(resp => resp.data);
  },
  register(username, password) {
    return ax
      .post('/api/register', { username, password })
      .then(resp => resp.data);
  },
  // loggedIn() {
  //   return ax.get(`/logged-in?_${Math.random()}`).then(resp => resp.data);
  // },
  getGenerators() {
    return ax.get('/api/generators').then(resp => resp.data);
  },
  getGenerator(id) {
    if (id === 'new') {
      // return Promise.resolve(newGenerator);
      return Promise.resolve(demoGenerator);
    }

    return ax.get(`/api/generators/${id}`).then(resp => resp.data);
  },
  saveGenerator(generator) {
    return ax.post('/api/generators', { generator }).then(resp => resp.data);
  },
  // getUsers() {
  //   return ax.get('/admin/users').then(resp => resp.data);
  // },
  // getUserAndGraphs(userId) {
  //   return ax.get(`/admin/users/${userId}`).then(resp => resp.data);
  // },
};
