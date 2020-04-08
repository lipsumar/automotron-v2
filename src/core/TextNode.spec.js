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
        value: [{ text: 'aah' }, { text: 'ooh', agreement: { dude: 'wow' } }],
        title: 'coucou',
        ui: {
          x: 1,
          y: 2,
        },
      });
      expect(textListNode).toBeInstanceOf(TextNode);
      expect(textListNode.value).toEqual([
        { text: 'aah' },
        { text: 'ooh', agreement: { dude: 'wow' } },
      ]);
      expect(textListNode.title).toEqual('coucou');
      expect(textListNode.ui).toEqual({ x: 1, y: 2 });
    });

    it('is backward compatible with value:string[]', () => {
      const textListNode = TextNode.fromJSON({
        value: ['aah', 'ooh'],
        title: 'coucou',
        ui: {
          x: 1,
          y: 2,
        },
      });
      expect(textListNode).toBeInstanceOf(TextNode);
      expect(textListNode.value).toEqual([{ text: 'aah' }, { text: 'ooh' }]);
    });
  });

  describe('constructor', () => {
    it('accepts a ({ text:string, agreement:{}[] })[] value', () => {
      const text = new TextNode([
        { text: 'hey' },
        { text: 'ho', agreement: { dude: 'wow' } },
      ]);
      expect(text.value).toEqual([
        { text: 'hey' },
        { text: 'ho', agreement: { dude: 'wow' } },
      ]);
    });
    it('accepts options', () => {
      const text = new TextNode([{ text: 'hi' }], { title: 'ho' });
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
      const text = new TextNode([{ text: 'hey' }, { text: 'yo' }]);
      expect(await text.evaluate()).toEqual({ text: 'yo' });
    });
  });
});
