export const subscriptions: {
  name: string;
  movement: number | string;
  members: boolean;
  financial: boolean;
  assistent: boolean;
}[] = [
  {
    name: 'Grátis',
    movement: 50,
    members: false,
    financial: false,
    assistent: false,
  },
  {
    name: 'Básico',
    movement: 'Ilimitado',
    members: true,
    financial: true,
    assistent: false,
  },
  {
    name: 'Avançado',
    movement: 'Ilimitado',
    members: true,
    financial: true,
    assistent: true,
  },
];
