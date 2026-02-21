export interface Student {
  id: number;
  name: string;
  absent: boolean;
}

export interface ClassData {
  [className: string]: Student[];
}
