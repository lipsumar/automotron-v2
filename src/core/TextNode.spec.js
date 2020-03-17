import TextNode from './TextNode';
import Node from './Node';

describe('TextNode', () => {
  it('is a class', () => {
    const text = new TextNode();
    expect(text).toBeInstanceOf(TextNode);
  });

  it('extends Node', () => {
    const text = new TextNode();
    expect(text).toBeInstanceOf(Node);
  });

  describe('constructor', () => {
    it('accepts a value', () => {
      const text = new TextNode('hey');
      expect(text.value).toBe('hey');
    });
  });

  describe('value', () => {
    it('is empty string by default', () => {
      const text = new TextNode();
      expect(text.value).toBe('');
    });
  });

  describe('evaluate()', () => {
    it('returns value', async () => {
      const text = new TextNode('hey');
      expect(await text.evaluate()).toBe('hey');
    });
  });
});
