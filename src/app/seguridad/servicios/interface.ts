export interface Roll {
  _id: string;
  cod_roll?: string;
  descripcion?: string;
  SU?: boolean;
  status?: boolean;
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
}

export interface Modulo {
  cod_modulo?: string;
  modulo?: string;
}

export interface Metodo {
  cod_metodo?: string;
  metodo?: string;
  descripcion?: string;
}

export interface Permiso {
  _id?: string;
  descripcion?: string;
  cod_permiso?: string;
  metodos?: Metodo[] | string[] | any;
  modulo?: Modulo;
  permiso?: string;
  ruta?: string;
  status?: boolean;
  routers?: string[];
}

export interface Usuario {
  _id?: string | any;
  nombre?: string;
  apellido?: string;
  usuario?: string;
  clave?: string;
  status?: boolean;
}
