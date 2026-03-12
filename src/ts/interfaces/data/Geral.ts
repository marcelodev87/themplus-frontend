export interface DataOFX {
  type: 'entry' | 'out';
  date: string;
  value: string;
  description: string;
}

export interface Image {
  id: number;
  size: number;
  name: string;
  url: string;
  image_url: string;
}

export interface CustomFile {
  img?: string;
  name: string;
  size: number;
  type: string;
}
