import random from 'random';
import seedrandom from 'seedrandom';

export function pickRandom(arr) {
  return arr[random.int(0, arr.length - 1)];
}

export function randomInt(min, max) {
  return random.int(min, max);
}

export function seedRandom(seed) {
  random.use(seedrandom(seed));
}
