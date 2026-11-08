export interface Moto {
  _id: string;
  placa: string;
  marca: string;
  modelo: string;
  kilometraje: number;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface MotoPayload {
  placa: string;
  marca: string;
  modelo: string;
  kilometraje: number;
}
