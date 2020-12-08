import { colors } from './constants';
import EdgeUi from './EdgeUi';

class GeneratorEdgeUi extends EdgeUi {
  constructor(from, to, edge, opts) {
    super(from, to, edge, opts);
    this.line.bezier(false);
    this.line.dash([11, 4]);
    this.line.strokeWidth(3);
    this.line.stroke(colors.generatorEdge);
  }

  getPoints() {
    const { from, to } = this;
    const fromX = from.centerX();
    const fromY = from.centerY();
    const toX = to.centerX();
    const toY = to.centerY();
    const points = [fromX, fromY, toX, toY];
    return points;
  }
}

export default GeneratorEdgeUi;
