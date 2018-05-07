const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const suffixes = {
  '1': 'st',
  '2': 'nd',
  '3': 'rd',
  '21': 'st',
  '22': 'nd',
  '23': 'rd',
  '31': 'st'
};

const appendSuffix = (n) => {
  const nStr = n.toString();
  return (
    nStr +
    (
      Object.prototype.hasOwnProperty.call(suffixes, nStr) ?
        suffixes[nStr] :
        'th'
    )
  );
};

export default () => {
  const d = new Date();
  return (
    months[d.getMonth()] + ' ' +
    appendSuffix(d.getDate())
  );
};
