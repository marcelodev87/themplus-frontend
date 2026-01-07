export const subscriptions: {
  name: string;
  movement: number | string;
  members: boolean;
  financial: boolean;
  assistent: boolean;
}[] = [
  {
    name: 'free',
    movement: 50,
    members: false,
    financial: false,
    assistent: false,
  },
  {
    name: 'basic',
    movement: 'Ilimitado',
    members: true,
    financial: true,
    assistent: false,
  },
  {
    name: 'advanced',
    movement: 'Ilimitado',
    members: true,
    financial: true,
    assistent: true,
  },
];
