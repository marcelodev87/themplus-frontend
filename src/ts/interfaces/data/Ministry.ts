export interface Ministry {
  id: string;
  name: string;
  member_id: string;
  enterprise_id: string;
}

export interface DataMinistry {
  id?: string | null;
  name: string;
  member_id: string;
}
