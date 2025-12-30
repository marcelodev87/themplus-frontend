export interface DataOFX {
  type: 'entry' | 'out';
  date: string;
  value: string;
  description: string;
}
