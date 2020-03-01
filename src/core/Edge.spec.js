import Edge from './Edge';
import Node from './Node';

jest.mock('./Node');

describe('Edge', () => {
  it('is a class', () => {
    const edge = new Edge();
    expect(edge).toBeInstanceOf(Edge);
  });

  it('accepts from and to in constructor', () => {
    const from = new Node();
    const to = new Node();
    const edge = new Edge(from, to);
    expect(edge.from).toEqual(from);
    expect(edge.to).toEqual(to);
  });
});
