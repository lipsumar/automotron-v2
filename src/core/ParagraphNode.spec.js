const { default: ParagraphNode } = require('./ParagraphNode');

describe('ParagraphNode', () => {
  it('increments at each evaluation', async () => {
    const paragraph = new ParagraphNode();
    paragraph.addOutlet();
    paragraph.addOutlet();
    expect(paragraph.currentOutletIndex).toBe(0);
    await paragraph.evaluate();
    expect(paragraph.currentOutletIndex).toBe(1);
    await paragraph.evaluate();
    expect(paragraph.currentOutletIndex).toBe(2);
  });
  it('resets after reaching the end', async () => {
    const paragraph = new ParagraphNode();
    paragraph.addOutlet();
    expect(paragraph.currentOutletIndex).toBe(0);
    await paragraph.evaluate();
    expect(paragraph.currentOutletIndex).toBe(1);
    await paragraph.evaluate();
    expect(paragraph.currentOutletIndex).toBe(2);
    await paragraph.evaluate();
    expect(paragraph.currentOutletIndex).toBe(1);
  });
  it('returns the correct outConnector', async () => {
    const paragraph = new ParagraphNode();
    paragraph.addOutlet();
    expect(paragraph.getOutConnector().key).toBe('flowOutlet_0');
    await paragraph.evaluate();
    expect(paragraph.getOutConnector().key).toBe('flowOutlet_0');
    await paragraph.evaluate();
    expect(paragraph.getOutConnector().key).toBe('flowOutlet_1');
    await paragraph.evaluate();
    expect(paragraph.getOutConnector().key).toBe('flowOutlet_0');
    await paragraph.evaluate();
    expect(paragraph.getOutConnector().key).toBe('flowOutlet_1');
  });
  it('implements returnTo() correctly', async () => {
    const paragraph = new ParagraphNode();
    paragraph.addOutlet();
    paragraph.addOutlet();
    await paragraph.evaluate();
    expect(paragraph.returnTo()).toEqual(true);
    await paragraph.evaluate();
    expect(paragraph.returnTo()).toEqual(true);
    await paragraph.evaluate();
    expect(paragraph.returnTo()).toEqual(false);
    await paragraph.evaluate();
    expect(paragraph.returnTo()).toEqual(true);
  });
});
