/* eslint-disable @typescript-eslint/no-explicit-any */
const resolveField = (
  row: any,
  field: string | ((row: any) => any)
): unknown => {
  if (typeof field === 'function') return field(row);
  return field.split('.').reduce((obj: any, key: string) => obj?.[key], row);
};

export const useTableFilter = () => {
  const filterMethod = (
    rows: readonly any[],
    terms: any,
    cols: readonly any[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _getCellValue: (col: any, row: any) => any
  ): readonly any[] => {
    const term = terms.toLowerCase().trim();
    if (!term) return rows;

    return rows.filter((row) =>
      cols.some((col) => {
        if (col.name === 'action') return false;
        const val = resolveField(row, col.field);
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(term);
      })
    );
  };

  return { filterMethod };
};
