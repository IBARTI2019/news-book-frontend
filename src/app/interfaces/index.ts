export interface User {
  id?: string;
  is_superuser?: boolean;
  code?: string;
  email: string;
  name: string;
  last_name: string;
  password?: string;
  address?: string;
  phone?: string;
  telephone?: string;
  security_code?: string;
  photo?: string;
  is_staff?: boolean;
  type?: number;
  oesvica_user?: boolean;
  is_active?: boolean;
  info?: string;
  user_permissions?: Number[];
  jwt_id?: string;
  user_id?: string;
  groups?: string[];

}

export interface GroupUser {
  id?: string;
  name?: string;
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
  jwt_id: string;
}

export interface Warehouse {
  id_warehouse: string;
  descripcion: string;
  is_active: string;
}

export interface Material {
  id?: string;
  code: string;
  serial: string;
  description: string;
  is_active?: string;
}

export interface Vehicle {
  id: string;
  license_plate: string;
  is_active?: string;
}

export interface TypePeople {
  id: string;
  description: string;
  priority: string;
  is_active: string;
}

export interface Person {
  id: string;
  code: string;
  name: string;
  last_name: string;
  doc_ident: string;
  address: string;
  phone: string;
  mobile: string;
  type_person?: string;
  is_active?: string;
}

export interface TypeNew {
  id: string;
  description: string;
  code: string;
  template: string;
  is_active: string;
  image?: string;
  info?: string;
}

export interface ClassificationNew {
  description: string;
  codigo: string;
  level_urgency: string;
  is_active: string;
  value: string;
}

export interface New {
  id: string;
  materials?: string[];
  people?: string[];
  vehicles?: string[];
  employee: string;
  message?: string;
  info?: string;
  type_news?: string;
  created_by: string;
}

export interface TemplateOne {
  id: string;
  message: string;
  perimetro: string;
  alumbrado: string;
  alarmas: string;
  sCI: string;
}

export interface TemplateTwoVehicle {
  id: string;
  message: string;
  vehicles: string[];
}

export interface TemplateThreeMaterials {
  id: string;
  message: string;
  materials: string[];
}

export interface TemplateFour {
  id?: string;
  message: string;
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

export interface Role {
  id: string;
  description: string;
  name: string;
  permissions: Number[];
}

export interface Schedule {
  id: string;
  description: string;
  start_time: string;
  final_hour: string;
  is_active: boolean;
}

export interface NotificationSetting {
  id: string;
  description: string;
  type: number;
  groups: number[];
  schedule?: Schedule;
  type_news: TypeNew;
  week_days: string[];
  day?: string;
  days?: string[];
  is_active: boolean;
  frequency: number;
  groups_display?: GroupUser[]
}

export interface OptionField {
  value: string;
  description: string;
}