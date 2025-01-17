export interface Plant {
  _id: string;
  name: string;
  type: string;
  price: number;
  quantityInStock: number;
  description?: string;
  location?: PlantLocation;
}

export interface PlantLocation {
  aisle: string;
  shelf: string;
  row: number;
  position: number;
}
