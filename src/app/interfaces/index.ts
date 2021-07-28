export interface User {
  id?: string;
  _id?: string;
  code?: string;
  name: string;
  last_name: string;
  email: string;
  username: string;
  info?: string;
  is_superuser?: boolean;
  password?: string;
  is_active?: boolean;
  is_staff?: boolean;
  role?: string;
  address?: string;
  phone?: string;
}

export interface SigninData {
  code?: string;
  user?: string;
  password?: string;
  security_code?: string;
}

export interface APIMessage {
  text: string;
  is_active?: number;
  type?: string;
}

export interface VerifyCodeResponse {
  logIn: boolean;
  token: string;
}

export interface Warehouse {
  id_warehouse: string;
  descripcion: string;
  is_active: string;
}

export interface Material {
  id_material?: string | number;
  cod_material?: string;
  serial_material?: string;
  id_warehouse?: string;
  description?: string;
  stock?: string;
  is_active?: string;
}

export interface Vehicle {
  id_vehiculo?: string;
  doc_ident: string;
  name?: string;
  last_name?: string;
  placa_vehiculo?: string;
  is_active?: string;
}

export interface TypePeople {
  id_type_person: string;
  description: string;
  priority: string;
  is_active: string;
}

export interface Person {
  id_person?: string;
  cod_person?: string;
  name?: string;
  last_name?: string;
  doc_ident?: string;
  addres?: string;
  phono?: string;
  movil?: string;
  id_type_person?: string;
  is_active?: string;
}

export interface TypeNew {
  id: string;
  descripton: string;
  id_classify: string;
  plantilla: string;
  is_active: string;
  imageUrl?: string;
  info?: string;
}

export interface ClassificationNew {
  id_classify: string;
  description: string;
  codigo: string;
  level_urgency: string;
  is_active: string;
  value: string;
}

export interface New {
  id_news: string;
  notice?: string;
  id_user: string;
  id?: string;
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
  is_active?: boolean;
  routers?: string[];
}
