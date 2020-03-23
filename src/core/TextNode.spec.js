import TextNode from './TextNode';
import Node from './Node';
import { seedRandom } from './utils';

describe('TextNode', () => {
  it('extends Node', () => {
    const text = new TextNode();
    expect(text).toBeInstanceOf(Node);
  });

  it('has type = text', () => {
    const text = new TextNode();
    expect(text.type).toBe('text');
  });

  describe('fromJSON', () => {
    it('creates a TextNode', () => {
      const textListNode = TextNode.fromJSON({
        value: ['aah', 'ooh'],
        title: 'coucou',
        ui: {
          x: 1,
          y: 2,
        },
      });
      expect(textListNode).toBeInstanceOf(TextNode);
      expect(textListNode.value).toEqual(['aah', 'ooh']);
      expect(textListNode.title).toEqual('coucou');
      expect(textListNode.ui).toEqual({ x: 1, y: 2 });
    });
  });

  describe('constructor', () => {
    it('accepts a string[] value', () => {
      const text = new TextNode(['hey']);
      expect(text.value).toEqual(['hey']);
    });
    it('accepts a string value', () => {
      const text = new TextNode('dude');
      expect(text.value).toEqual(['dude']);
    });
    it('accepts options', () => {
      const text = new TextNode(['hey'], { title: 'ho' });
      expect(text.title).toBe('ho');
    });
  });

  describe('value', () => {
    it('is [] by default', () => {
      const text = new TextNode();
      expect(text.value).toEqual([]);
    });
  });

  describe('evaluate()', () => {
    it('returns random element from value', async () => {
      seedRandom('seed_TextNode eval');
      const text = new TextNode(['hey', 'yo']);
      expect(await text.evaluate()).toBe('yo');
    });
  });
});
