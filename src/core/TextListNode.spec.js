import TextListNode from './TextListNode';
import Node from './Node';
import { seedRandom } from './utils';

describe('TextListNode', () => {
  it('is a class', () => {
    const text = new TextListNode();
    expect(text).toBeInstanceOf(TextListNode);
  });

  it('extends Node', () => {
    const text = new TextListNode();
    expect(text).toBeInstanceOf(Node);
  });

  it('has type = text-list', () => {
    const text = new TextListNode();
    expect(text.type).toBe('text-list');
  });

  describe('fromJSON', () => {
    it('creates a TextListNode', () => {
      const textListNode = TextListNode.fromJSON({
        values: ['aah', 'ooh'],
        title: 'coucou',
        ui: {
          x: 1,
          y: 2,
        },
      });
      expect(textListNode).toBeInstanceOf(TextListNode);
      expect(textListNode.values).toEqual(['aah', 'ooh']);
      expect(textListNode.title).toEqual('coucou');
      expect(textListNode.ui).toEqual({ x: 1, y: 2 });
    });
  });

  describe('constructor', () => {
    it('accepts a value', () => {
      const text = new TextListNode(['hey']);
      expect(text.values).toEqual(['hey']);
    });
    it('accepts options', () => {
      const text = new TextListNode(['hey'], { title: 'ho' });
      expect(text.title).toBe('ho');
    });
  });

  describe('value', () => {
    it('is [""] by default', () => {
      const text = new TextListNode();
      expect(text.values).toEqual(['']);
    });
  });

  describe('evaluate()', () => {
    it('returns random element from values', async () => {
      seedRandom('seed_TextNode eval');
      const text = new TextListNode(['hey', 'yo']);
      expect(await text.evaluate()).toBe('yo');
    });
  });
});
