export default ({ item: A }, { item: B }) => {
  const a = A.toLowerCase();
  const b = B.toLowerCase();
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};
