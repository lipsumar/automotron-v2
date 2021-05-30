import puppeteer from 'puppeteer';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import fs from 'fs';

const testDir = 'src/test/ui/screenshots/under-test';
const goldenDir = 'src/test/ui/screenshots/golden';

// from https://meowni.ca/posts/2017-puppeteer-tests/

function compareScreenshots(fileName) {
  return new Promise(resolve => {
    const img1 = fs
      .createReadStream(`${testDir}/${fileName}.png`)
      .pipe(new PNG())
      .on('parsed', doneReading);
    const img2 = fs
      .createReadStream(`${goldenDir}/${fileName}.png`)
      .pipe(new PNG())
      .on('parsed', doneReading);

    let filesRead = 0;
    function doneReading() {
      // Wait until both files are read.
      if (++filesRead < 2) return;

      // The files should be the same size.
      expect(img1.width).toBe(img2.width);
      expect(img1.height).toBe(img2.height);

      // Do the visual diff.
      const diff = new PNG({ width: img1.width, height: img2.height });
      const numDiffPixels = pixelmatch(
        img1.data,
        img2.data,
        diff.data,
        img1.width,
        img1.height,
        { threshold: 0.1 },
      );
      if (numDiffPixels > 0) {
        fs.writeFileSync(
          `${testDir}/${fileName}-diff.png`,
          PNG.sync.write(diff),
        );
      }
      resolve(numDiffPixels);
    }
  });
}

describe('compare rendering', () => {
  it('renders the graph', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setViewport({ width: 1024, height: 768 });
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.graph-ui-stage[data-ready="true"]');
    await page.screenshot({ path: `${testDir}/example.png` });

    await browser.close();

    const numDiffPixels = await compareScreenshots('example');
    expect(numDiffPixels).toEqual(0);
  });
});
