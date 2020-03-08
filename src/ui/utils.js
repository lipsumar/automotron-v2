export function measureTextHeight(text, width = 500) {
  const div = document.createElement('div');
  div.style.width = `${width}px`;
  div.style.fontSize = '20px';
  div.style.lineHeight = '1';
  div.style.position = 'absolute';
  div.style.top = '-900px';
  div.style.left = '-900px';
  div.innerText = text;
  document.body.appendChild(div);
  const height = div.offsetHeight;
  document.body.removeChild(div);
  return height;
}
