import StartNode from './StartNode';
import Node from './Node';

describe('StartNode', () => {
  it('is a class', () => {
    const startNode = new StartNode();
    expect(startNode).toBeInstanceOf(StartNode);
  });
  it('extends Node', () => {
    const startNode = new StartNode();
    expect(startNode).toBeInstanceOf(Node);
  });
});
