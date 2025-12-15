import { QuasarSelect } from 'src/ts/interfaces/framework/Quasar';

export const statusFamily: QuasarSelect<string>[] = [
  { label: 'Avô (ó)', value: 'grandfather/grandmother' },
  { label: 'Bisavô (ó)', value: 'great-grandfather/great-grandmother' },
  { label: 'Bisneto (a)', value: 'great-grandson/great-granddaughter' },
  { label: 'Cônjuge', value: 'spouse' },
  { label: 'Cunhado (a)', value: 'brother-in-law/sister-in-law' },
  { label: 'Enteado (a)', value: 'stepson/stepdaughter' },
  { label: 'Filho (a)', value: 'son/daughter' },
  { label: 'Genro', value: 'son-in-law' },
  { label: 'Irmão (ã)', value: 'brother/sister' },
  { label: 'Mãe', value: 'mother' },
  { label: 'Namorado(a)', value: 'boyfriend/girlfriend' },
  { label: 'Neto (a)', value: 'grandson/granddaughter' },
  { label: 'Noivo(a)', value: 'fiancé/fiancée' },
  { label: 'Nora', value: 'daughter-in-law' },
  { label: 'Pai', value: 'father' },
  { label: 'Primo (a)', value: 'cousin' },
  { label: 'Sobrinho (a)', value: 'nephew/niece' },
  { label: 'Sogro (a)', value: 'father-in-law/mother-in-law' },
  {
    label: 'Tataraneto (a)',
    value: 'great-great-grandson/great-great-granddaughter',
  },
  { label: 'Tio (a)', value: 'uncle/aunt' },
  {
    label: 'Trisavô (ó)',
    value: 'great-great-grandfather/great-great-grandmother',
  },
];
