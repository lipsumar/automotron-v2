export default function combineAgreements(a, b) {
  if (!a && b) return b;
  if (!b && a) return a;
  if (!a && !b) return null;

  let longest = a;

  if (Object.keys(a).length < Object.keys(b)) {
    longest = b;
  }
  return longest;
}
