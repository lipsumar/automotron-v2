class ConnectorUi {
  constructor(connector, nodeUi, options) {
    this.connector = connector;
    this.nodeUi = nodeUi;
    this.y = options.y;
    this.x = options.x;
    this.hitBox = options.hitBox || (() => ({ width: 50, height: 50 }));
    this.color = options.color;
  }

  getAbsolutePosition() {
    return {
      x: this.nodeUi.x() + this.x(),
      y: this.nodeUi.y() + this.y(),
    };
  }
}

export default ConnectorUi;
