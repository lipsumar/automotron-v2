import { doc } from 'prettier';

class PuppeteerRecorder {
  constructor(el) {
    this.actions = [];
    this.el = el;
    this.lastMouseLocation = {};
    this.buildUi();
  }

  buildUi() {
    const wrapper = document.createElement('div');
    wrapper.style.position = 'absolute';
    wrapper.style.top = '0px';
    wrapper.style.left = '0px';
    const btnStart = document.createElement('button');
    btnStart.innerText = 'Start';
    btnStart.addEventListener('click', this.start.bind(this));
    const btnExport = document.createElement('button');
    btnExport.innerText = 'Export';
    btnExport.addEventListener('click', this.export.bind(this));
    wrapper.appendChild(btnStart);
    wrapper.appendChild(btnExport);
    document.body.appendChild(wrapper);
  }

  start() {
    document.body.addEventListener('mousedown', () => {
      this.recordAction('mousemove', this.lastMouseLocation);
      this.recordAction('mousedown');
    });
    document.body.addEventListener('mouseup', () => {
      this.recordAction('mousemove', this.lastMouseLocation);
      this.recordAction('mouseup');
    });
    document.body.addEventListener('mousemove', e => {
      this.lastMouseLocation = {
        x: e.clientX,
        y: e.clientY,
      };
    });
    this.el.addEventListener('dblclick', () => {
      this.recordAction('mousemove', this.lastMouseLocation);
      this.recordAction('dblclick');
    });
    document.body.addEventListener('keyup', e => {
      this.recordAction('press', { code: e.code });
    });
  }

  recordAction(type, options) {
    this.actions.push({ type, ...options });
  }

  export() {
    console.log(
      this.actions.map(action => this.toPuppeteerAction(action)).join('\n'),
    );
  }

  toPuppeteerAction(action) {
    switch (action.type) {
      case 'mousemove':
        return `await page.mouse.move(${action.x}, ${action.y});`;
      case 'mousedown':
        return `await page.mouse.down();`;
      case 'mouseup':
        return `await page.mouse.up();`;
      case 'dblclick':
        return [
          'await page.mouse.down();',
          'await page.mouse.up();',
          'await page.mouse.down();',
          'await page.mouse.up();',
        ].join('\n');
      case 'press':
        return `await page.keyboard.press('${action.code}');`;
      default:
        throw new Error(`unsupported action type "${action.type}"`);
    }
  }
}

export default PuppeteerRecorder;
