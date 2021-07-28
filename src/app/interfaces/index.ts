export interface User {
  id?: string;
  _id?: string;
  id?: string;
  code?: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password?: string;
  status?: boolean;
  rol?: string;
}

export interface SigninData {
  code?: string;
  user?: string;
  password?: string;
  security_code?: string;
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

export interface Person {
  id_person?: string;
  cod_person?: string;
  name?: string;
  lastname?: string;
  doc_ident?: string;
  addres?: string;
  phono?: string;
  movil?: string;
  id_type_person?: string;
  status?: string;
}

export interface TypeNew {
  id_type_news: string;
  descripton: string;
  id_classify: string;
  plantilla: string;
  status: string;
  imageUrl?: string;
  info?: string;
}

export interface ClassificationNew {
  id_classify: string;
  description: string;
  codigo: string;
  level_urgency: string;
  status: string;
  value: string;
}

export interface New {
  id_news: string;
  notice?: string;
  id_user: string;
  id_type_news?: string;
  fecha?: Date;
  hora?: string;
  datos?: object;
}

export interface TemplateOne {
  id: string;
  notice: string;
  perimetro: string;
  alumbrado: string;
  alarmas: string;
  sCI: string;
}

export interface TemplateTwoVehicle {
  id: string;
  notice: string;
  vehiculos: string[];
}

export interface TemplateThreeMaterials {
  id: string;
  notice: string;
  materiales: string[];
}

export interface TemplateFour {
  id?: string;
  notice: string;
}

export interface TemplateFive {
  id: string;
  description: string;
}

export interface TemplateSix {
  id: string;
  description: string;
}

export interface TemplateSeven {
  id: string;
  description: string;
}

export interface TemplateEight {
  id: string;
  description: string;
}

export interface Metodo {
  cod_metodo: string;
  metodo: string;
  descripcion: string;
}

export interface Modulo {
  cod_modulo: string;
  modulo: string;
}

export interface Permiso {
  _id?: string;
  descripcion?: string;
  cod_permiso?: string;
  metodos?: Metodo[];
  modulo?: Modulo;
  permiso?: string;
  ruta?: string;
  status?: boolean;
  routers?: string[];
}
