import puppeteer from 'puppeteer';

const testDir = 'src/test/editor/screenshots/under-test';

describe('editor', () => {
  test('basic actions', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setViewport({ width: 1600, height: 900 });
    await page.goto('http://localhost:3000/editor/new');
    await page.waitForSelector('.graph-ui-stage[data-ready="true"]');

    await page.mouse.move(573, 339);
    await page.mouse.down();
    await page.mouse.move(419, 333);
    await page.mouse.up();
    await page.mouse.move(487, 495);
    await page.mouse.down();
    await page.mouse.move(576, 491);
    await page.mouse.up();
    await page.mouse.move(600, 492);
    await page.mouse.down();
    await page.mouse.move(600, 492);
    await page.mouse.up();
    await page.mouse.move(600, 492);
    await page.mouse.down();
    await page.mouse.move(600, 492);
    await page.mouse.up();
    await page.mouse.move(600, 492);
    await page.mouse.down();
    await page.mouse.up();
    await page.mouse.down();
    await page.mouse.up();
    await page.keyboard.press('KeyH');
    await page.keyboard.press('KeyE');
    await page.keyboard.press('KeyL');
    await page.keyboard.press('KeyL');
    await page.keyboard.press('KeyO');
    await page.mouse.move(852, 511);
    await page.mouse.down();
    await page.mouse.move(852, 511);
    await page.mouse.up();
    await page.mouse.move(82, 11);
    await page.mouse.down();
    await page.mouse.move(81, 11);
    await page.mouse.up();

    await page.screenshot({ path: `${testDir}/example.png` });

    expect(true).toBeTruthy();
  }, 10000);
});
