class Edge {
  from = null;

  to = null;

  type = 'default';

  id;

  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  setId(id) {
    this.id = id;
  }
}

export default Edge;
