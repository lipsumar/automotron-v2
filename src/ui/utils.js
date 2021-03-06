export function measureTextHeight(text, width = 500) {
  const div = document.createElement('div');
  div.style.width = `${width}px`;
  div.style.fontSize = '20px';
  div.style.lineHeight = '1';
  div.style.position = 'absolute';
  div.style.top = '-900px';
  div.style.left = '-900px';
  div.style.textAlign = 'center';
  div.innerText = text;
  document.body.appendChild(div);
  const height = div.offsetHeight;
  document.body.removeChild(div);
  return height;
}

export function measureTextWidth(text, fontSize = 20) {
  const div = document.createElement('div');
  div.style.fontSize = `${fontSize}px`;
  div.style.lineHeight = '1';
  div.style.position = 'absolute';
  div.style.top = '-900px';
  div.style.left = '-900px';
  div.style.textAlign = 'center';
  div.innerText = text;
  document.body.appendChild(div);
  const width = div.offsetWidth;
  document.body.removeChild(div);
  return width;
}

export function hasIntersection(r1, r2) {
  return !(
    r2.x > r1.x + r1.width ||
    r2.x + r2.width < r1.x ||
    r2.y > r1.y + r1.height ||
    r2.y + r2.height < r1.y
  );
}

export function distance(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

export function clampValue(value, n) {
  return Math.round(value / n) * n;
}
