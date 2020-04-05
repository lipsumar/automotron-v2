const { createCanvas } = require('canvas');
const fs = require('fs');

function distance(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

module.exports = {
  async updatePreview(generator, id) {
    const canvas = createCanvas(640, 480);
    const ctx = canvas.getContext('2d');

    const { mostLeft, mostTop, mostRight, mostBottom } = this.findBoundaries(
      generator.graph,
    );
    const padding = 10;

    const offsetX = mostLeft * -1;
    let offsetY = mostTop * -1;

    const width = mostRight - mostLeft + padding;
    const height = mostBottom - mostTop + padding;

    let scale = (640 - padding) / width;
    if (height > width) {
      scale = (480 - padding) / height;
    }

    if (height * scale < 480) {
      offsetY += (480 - height * scale) / 2;
    }

    function adjust(x, y) {
      return [(x + offsetX) * scale + padding, (y + offsetY) * scale + padding];
    }

    generator.graph.edges.forEach(edge => {
      ctx.strokeStyle = '#7791F9';
      ctx.lineWidth = 8 * scale;
      ctx.setLineDash([]);

      const from = generator.graph.nodes.find(node => node.id === edge.from.id);
      const to = generator.graph.nodes.find(node => node.id === edge.to.id);

      /* metro
      points.forEach((point, i) => {
        if (i % 2 === 1) return;
        ctx.lineTo(point, points[i + 1]);
      }); */

      if (edge.type === 'generator') {
        ctx.lineWidth = 4 * scale;
        ctx.strokeStyle = '#b35fff';
        ctx.setLineDash([15 * scale, 10 * scale]);
        ctx.beginPath();
        ctx.moveTo(
          ...adjust(
            from.ui.x + from.ui.width / 2,
            from.ui.y + from.ui.height / 2,
          ),
        );
        ctx.lineTo(
          ...adjust(to.ui.x + to.ui.width / 2, to.ui.y + to.ui.height / 2),
        );
        ctx.stroke();
      } else {
        const points = this.edgePoints(
          ...adjust(from.ui.x + from.ui.width, from.ui.y + 25),
          ...adjust(to.ui.x, to.ui.y + 25),
        );
        ctx.beginPath();
        ctx.moveTo(points[0], points[1]);
        ctx.bezierCurveTo(
          points[2],
          points[3],
          points[4],
          points[5],
          points[6],
          points[7],
        );
        ctx.stroke();
      }
    });

    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 1;
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 5 * scale;
    generator.graph.nodes.forEach(node => {
      ctx.fillStyle = '#fff';
      if (node.type === 'start') {
        ctx.fillStyle = '#91fbcf';
      }
      if (node.ui.generatorValue) {
        ctx.fillStyle = '#e5d4f5';
      }
      ctx.fillRect(
        ...adjust(node.ui.x, node.ui.y),
        node.ui.width * scale,
        node.ui.height * scale,
      );
    });

    await this.saveToDisk(canvas, `${__dirname}/../../../previews/${id}.png`);
  },

  async saveToDisk(canvas, filepath) {
    return new Promise(resolve => {
      const out = fs.createWriteStream(filepath);
      const stream = canvas.createPNGStream();
      stream.pipe(out);
      out.on('finish', resolve);
    });
  },

  findBoundaries(graph) {
    const mostLeft = graph.nodes
      .map(node => node.ui.x)
      .sort((a, b) => a - b)[0];
    const mostRight = graph.nodes
      .map(node => node.ui.x + node.ui.width)
      .sort((a, b) => a - b)
      .reverse()[0];
    const mostTop = graph.nodes.map(node => node.ui.y).sort((a, b) => a - b)[0];
    const mostBottom = graph.nodes
      .map(node => node.ui.y + node.ui.height)
      .sort((a, b) => a - b)
      .reverse()[0];
    return { mostLeft, mostTop, mostRight, mostBottom };
  },

  edgePoints(fromX, fromY, toX, toY) {
    const points = [fromX, fromY];
    points.push(...[fromX + (toX - fromX) / 2, fromY]);
    points.push(...[fromX + (toX - fromX) / 2, toY]);

    points.push(...[toX, toY]);
    return points;
  },

  edgePointsMetro(fromX, fromY, toX, toY) {
    const points = [fromX, fromY];

    const half = Math.abs(fromY - toY) / 2;
    const centerX = (toX - fromX) / 2;
    const dist = distance(fromX, fromY, toX, toY);

    if (half < centerX) {
      points.push(...[fromX + centerX - half, fromY]);
      points.push(...[fromX + centerX + half, toY]);
    } else if (fromY < toY) {
      if (centerX < 25 && dist > 100) {
        points.push(...[fromX + 25, fromY + 25]);
        points.push(...[fromX + 25, fromY + 25 + 25]);

        points.push(...[toX - 25, toY - 25 - 25]);
        points.push(...[toX - 25, toY - 25]);
      } else {
        points.push(...[fromX + centerX, fromY + centerX]);
        points.push(...[fromX + centerX, toY - centerX]);
      }
    } else if (centerX < 25 && dist > 100) {
      points.push(...[fromX + 25, fromY - 25]);
      points.push(...[fromX + 25, fromY - 25 - 25]);

      points.push(...[toX - 25, toY + 25 + 25]);
      points.push(...[toX - 25, toY + 25]);
    } else {
      points.push(...[fromX + centerX, fromY - centerX]);
      points.push(...[fromX + centerX, toY + centerX]);
    }

    points.push(...[toX, toY]);
    return points;
  },
};
