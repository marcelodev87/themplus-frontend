export function formatCurrencyBRL(value: number | string): string {
  if (value === 0 || value === '0') {
    return 'R$ 0,00';
  }

  if (typeof value !== 'number') {
    value = parseFloat(value);
  }

  // eslint-disable-next-line no-restricted-globals
  if (isNaN(value)) {
    return 'R$ 0,00';
  }

  return `R$ ${value
    .toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}
