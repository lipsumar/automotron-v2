import Node from './Node';

describe('Node', () => {
  it('is a class', () => {
    const node = new Node();
    expect(node).toBeInstanceOf(Node);
  });

  it('has an id', () => {
    const node = new Node();
    node.setId(2);
    expect(node.id).toBe(2);
  });
});
