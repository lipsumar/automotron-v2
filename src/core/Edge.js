class Edge {
  from = null;

  to = null;

  type = 'default';

  id;

  space = true;

  constructor(from, to, options = {}) {
    this.from = from;
    this.to = to;
    this.fromOutlet = options.fromOutlet || 'default';
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
