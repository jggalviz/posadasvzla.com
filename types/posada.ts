export interface Posada {
  id: string;
  name: string;
  location: string;
  price: number;
  image: string;
  has_power_plant: boolean;
  rating: number;
  category: string;
  created_at?: string;
}

// Map database fields to our UI interface if necessary
export type DatabasePosada = Posada; 
