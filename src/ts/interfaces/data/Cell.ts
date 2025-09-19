export interface Cell {
  id: string;
  name: string;
  date_foundation: string | null;
  date_end: string | null;
  network_id: string | null;
  congregation_id: string | null;
  enterprise_id: string | null;
  host_id: string | null;
  leader_id: string | null;
  active: number;
  location: string;
  day_week: number;
  frequency: string;
  time: string;
  location_address_member: number;
  cep: string | null;
  uf: string;
  address: string | null;
  address_number: string | null;
  neighborhood: string | null;
  city: string | null;
  complement: string | null;
}

export interface DataCell {
  id?: string | null;
  name: string;
  dateFoundation: string | null;
  dateEnd: string | null;
  networkID: string | null;
  leaderID: string | null;
  hostID: string | null;
  active: number;
  location: string | null;
  dayWeek: number;
  frequency: string;
  time: string | null;
  cep: string | null;
  uf: string | null;
  address: string | null;
  addressNumber: string | null;
  neighborhood: string | null;
  city: string | null;
  complement: string | null;
}
