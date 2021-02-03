const { default: LoopNode } = require('./LoopNode');

describe('LoopNode', () => {
  it('chooses a maxCount upon first evaluation', async () => {
    const loop = new LoopNode('2');
    expect(loop.maxCount).toBeNull();
    await loop.evaluate();
    expect(loop.maxCount).toBe(2);
  });
  it('increments at each evaluation', async () => {
    const loop = new LoopNode('4');
    expect(loop.currentCount).toBe(0);
    await loop.evaluate();
    expect(loop.currentCount).toBe(1);
    await loop.evaluate();
    expect(loop.currentCount).toBe(2);
  });
  it('resets after reaching maxCount', async () => {
    const loop = new LoopNode('2');
    expect(loop.currentCount).toBe(0);
    await loop.evaluate();
    expect(loop.currentCount).toBe(1);
    await loop.evaluate();
    expect(loop.currentCount).toBe(2);
    await loop.evaluate();
    // maxCount+1 is used internally to choose the exit connector
    expect(loop.currentCount).toBe(3);
    await loop.evaluate();
    // it's reset at the next evaluation
    expect(loop.currentCount).toBe(1);
  });
  it('returns the correct outConnector', async () => {
    const loop = new LoopNode('2');
    expect(loop.getOutConnector().key).toBe('loopOutlet');
    await loop.evaluate();
    expect(loop.getOutConnector().key).toBe('loopOutlet');
    await loop.evaluate();
    expect(loop.getOutConnector().key).toBe('loopOutlet');
    await loop.evaluate();
    expect(loop.getOutConnector().key).toBe('exitOutlet');
  });
  it('implements returnTo() correctly', async () => {
    const loop = new LoopNode('2');
    await loop.evaluate();
    expect(loop.returnTo()).toEqual(true);
    await loop.evaluate();
    expect(loop.returnTo()).toEqual(true);
    await loop.evaluate();
    expect(loop.returnTo()).toEqual(false);
    await loop.evaluate();
    expect(loop.returnTo()).toEqual(true);
  });
});
