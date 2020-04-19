class Edge {
  from = null;

  to = null;

  type = 'default';

  id;

  space = true;

  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  setId(id) {
    this.id = id;
  }

  toggleSpace() {
    this.space = !this.space;
  }

  evaluate() {
    return this.space ? ' ' : '';
  }
}

export default Edge;
