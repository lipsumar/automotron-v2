export function whenFontLoaded(fontFamily) {
  if (document.fonts.check(`1em '${fontFamily}'`)) {
    return Promise.resolve(true);
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(whenFontLoaded(fontFamily));
    }, 200);
  });
}
