import TextNode from './TextNode';
import Node from './Node';

describe('TextNode', () => {
  it('is a class', () => {
    const startNode = new TextNode();
    expect(startNode).toBeInstanceOf(TextNode);
  });

  it('extends Node', () => {
    const startNode = new TextNode();
    expect(startNode).toBeInstanceOf(Node);
  });

  describe('value', () => {
    it('is empty string by default', () => {
      const startNode = new TextNode();
      expect(startNode.value).toBe('');
    });
  });
});
