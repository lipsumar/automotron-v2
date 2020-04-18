import axios from 'axios';
import cloneDeep from 'lodash.clonedeep';

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
          width: 100,
          height: 75,
        },
      },
      {
        id: 2,
        type: 'text',
        value: ['Once upon a time'],
        ui: {
          x: 300,
          y: -50,
          width: 194.1328125,
          height: 52,
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
          width: 100,
          height: 75,
        },
      },
      {
        id: 2,
        type: 'text',
        value: ['hello'],
        ui: {
          x: 300,
          y: -150,
          width: 73.693359375,
          height: 52,
        },
      },
      {
        id: 3,
        type: 'text',
        value: ['good morning', 'goodbye my friends', 'oh thats nice'],
        ui: {
          x: 300,
          y: -50,
          width: 213.29296875,
          height: 128,
        },
      },
      {
        id: 4,
        type: 'text',
        value: ['the brown fox jumps over the lazy dog again and again'],
        ui: {
          x: 300,
          y: 100,
          width: 487.052734375,
          height: 68,
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
          width: 481.818359375,
          height: 88,
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
          width: 214.62109375,
          height: 128,
        },
      },
      {
        id: 7,
        type: 'graph',
        value: {
          ...cloneDeep(newGenerator),
        },
        ui: {
          x: 550,
          y: -75,
          width: 300,
          height: 300,
        },
      },
    ],
    edges: [
      { from: { id: 1 }, to: { id: 2 } },
      { from: { id: 1 }, to: { id: 3 } },
      { from: { id: 1 }, to: { id: 4 } },
      { from: { id: 1 }, to: { id: 5 } },
      { from: { id: 3 }, to: { id: 7 } },
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
  loggedIn() {
    return ax.post(`/api/logged-in`).then(resp => resp.data);
  },
  logout() {
    return ax.post(`/api/logout`).then(resp => resp.data);
  },
  getGenerators() {
    return ax.get('/api/generators').then(resp => resp.data);
  },
  getGenerator(id) {
    if (id === 'new') {
      return Promise.resolve(newGenerator);
    }
    if (id === 'demo') {
      return Promise.resolve(demoGenerator);
    }

    return ax.get(`/api/generators/${id}`).then(resp => resp.data);
  },
  saveGenerator(generator) {
    return ax.post('/api/generators', { generator }).then(resp => resp.data);
  },
  deleteGenerator(generatorId) {
    return ax.delete(`/api/generators/${generatorId}`).then(resp => resp.data);
  },
  // getUsers() {
  //   return ax.get('/admin/users').then(resp => resp.data);
  // },
  // getUserAndGraphs(userId) {
  //   return ax.get(`/admin/users/${userId}`).then(resp => resp.data);
  // },
};
