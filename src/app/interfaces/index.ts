export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password?: string;
  status?: boolean;
}

export interface SigninData {
  user: string;
  password: string;
  codigocelular?: string;
}

export interface APIMessage {
  text: string;
  status?: number;
  type?: string;
}

export interface VerifyCodeResponse {
  logIn: boolean;
  token: string;
}

export interface Warehouse {
  id_warehouse: string;
  descripcion: string;
  status: string;
}

export interface Material {
  id_material?: string | number;
  cod_material?: string;
  serial_material?: string;
  id_warehouse?: string;
  description?: string;
  stock?: string;
  status?: string;
}

export interface Vehicle {
  id_vehiculo?: string;
  doc_ident: string;
  name?: string;
  lastname?: string;
  placa_vehiculo?: string;
  status?: string;
}

export interface TypePeople {
  id_type_person: string;
  description: string;
  priority: string;
  status: string;
}
