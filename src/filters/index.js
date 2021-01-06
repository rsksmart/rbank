import Vue from 'vue';

Vue.filter('formatPrice', (value) => {
  const val = (value / 1).toFixed(2)
    .replace(',', '.');
  const price = `$ ${val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  return price.length > 7 ? `${price.substr(0, 7)}...` : price;
});

Vue.filter('fullPrice', (value) => {
  const val = (value / 1).toFixed(2)
    .replace(',', '.');
  return `$ ${val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
});

Vue.filter('formatToken', (value, decimals) => {
  const val = (value / (10 ** decimals)).toFixed(decimals);
  const int = decimals > 0 ? val.substring(0, val.indexOf('.')) : val;
  const decimalZeros = val.substring(val.indexOf('.') + 1, val.length);
  const decimal = Number(decimalZeros) === 0 ? Number(decimalZeros)
    .toString() : decimalZeros.replace(/\.?0+$/, '');
  const tokens = decimals > 0 ? `${int
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${decimal}`
    : `${int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  return tokens.length > 7 ? `${tokens.substr(0, 6)}...` : tokens;
});

Vue.filter('fullToken', (value, decimals) => {
  const val = (value / (10 ** decimals)).toFixed(decimals);
  const int = decimals > 0 ? val.substring(0, val.indexOf('.')) : val;
  const decimalZeros = val.substring(val.indexOf('.') + 1, val.length);
  const decimal = Number(decimalZeros) === 0 ? Number(decimalZeros)
    .toString() : decimalZeros.replace(/\.?0+$/, '');
  return decimals > 0 ? `${int
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${decimal}`
    : `${int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
});

Vue.filter('formatPercentage', (value) => `${Number(value).toFixed(2)} %`);
