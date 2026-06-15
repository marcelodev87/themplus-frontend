import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resolveField = (row: any, field: string | ((row: any) => any)): unknown => {
  if (typeof field === 'function') return field(row);
  return field.split('.').reduce((obj, key) => obj?.[key], row);
};

export const useSortMethod = (columns: QuasarTable[]) => {
  const sortRows = (rows: unknown[], sortBy: string, descending: boolean): unknown[] => {
    if (!sortBy) return rows;
    const col = columns.find((c) => c.name === sortBy);
    if (!col) return rows;

    return [...rows].sort((a, b) => {
      const aVal = resolveField(a, col.field);
      const bVal = resolveField(b, col.field);

      if (aVal === null || aVal === undefined) return descending ? -1 : 1;
      if (bVal === null || bVal === undefined) return descending ? 1 : -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return descending ? bVal - aVal : aVal - bVal;
      }

      const aNum = Number(aVal);
      const bNum = Number(bVal);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return descending ? bNum - aNum : aNum - bNum;
      }

      const result = String(aVal).localeCompare(String(bVal), 'pt-BR', {
        numeric: true,
        sensitivity: 'base',
      });
      return descending ? -result : result;
    });
  };

  return { sortRows };
};
