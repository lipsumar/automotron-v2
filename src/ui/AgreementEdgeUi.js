import { colors } from './constants';
import EdgeUi from './EdgeUi';

class AgreementEdgeUi extends EdgeUi {
  constructor(from, to, edge, opts) {
    super(from, to, edge, opts);
    this.line.strokeWidth(4);
    this.line.stroke(colors.agreementEdge);
  }

  getPoints() {
    const { from, to } = this;
    const fromX = from.centerX();
    const fromY = from.bottomY();
    const toX = to.centerX();
    const toY = to.bottomY();
    const points = [fromX, fromY];
    points.push(fromX, fromY + 40);
    points.push(toX, toY + 40);
    points.push(toX, toY);
    return points;
  }
}

export default AgreementEdgeUi;
