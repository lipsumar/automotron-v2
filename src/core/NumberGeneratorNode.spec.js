import NumberGeneratorNode from './NumberGeneratorNode';
import { seedRandom } from './utils';

describe('NumberGeneratorNode', () => {
  describe('regular', () => {
    it('returns numbers starting from min up to max', async () => {
      const node = new NumberGeneratorNode(null, {
        min: 2,
        max: 5,
      });
      expect((await node.evaluate()).text).toBe('2');
      expect((await node.evaluate()).text).toBe('3');
      expect((await node.evaluate()).text).toBe('4');
      expect((await node.evaluate()).text).toBe('5');
      expect((await node.evaluate()).text).toBe('2');
      expect((await node.evaluate()).text).toBe('3');
    });
  });
  describe('random', () => {
    it('returns random integers between min and max', async () => {
      seedRandom('123');
      const node = new NumberGeneratorNode(null, {
        min: 2,
        max: 5,
        isRandom: true,
      });

      expect((await node.evaluate()).text).toBe('5');
      expect((await node.evaluate()).text).toBe('3');
      expect((await node.evaluate()).text).toBe('2');
      expect((await node.evaluate()).text).toBe('4');
      expect((await node.evaluate()).text).toBe('5');
    });
  });
});
