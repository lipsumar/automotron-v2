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
    const fromPos = from.getAbsolutePosition();
    const fromX = fromPos.x;
    const fromY = fromPos.y;
    const toPos = to.getAbsolutePosition();
    const toX = toPos.x;
    const toY = toPos.y;
    const points = [fromX, fromY];
    points.push(fromX, fromY + 40);
    points.push(toX, toY + 40);
    points.push(toX, toY);
    return points;
  }
}

export default AgreementEdgeUi;
