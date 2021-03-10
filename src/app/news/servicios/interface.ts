
export interface Usuario {
  id_news?: string | any;
  notice?: string;
  id_user?: string;
  ced_notifica?: string;
  nombres_apellidos?: string;
  id_type_news?:string;
  createdAt?:string | any;
}
export interface Almacen{
  id_type_news: string;
  descripton?: string;
  id_classify?:string | any;
  token_emali?: string;
  status?: boolean;
     
    
}

export interface materialesentrance{
  id_uuid?:string | any;
  serial?: string;
  description?:string;
  condiction?: string;
  id_news?: string;
  quantity?: number;
  type?: string;  
    
}
export interface personasentrance{
  UUID?:string | any;
  id_news?: string;
  id_person?: string;
  nombres_apellidos?: string;
    
}
export interface vehiculosentrance{
  id_uuid?:string | any;
  id_news?: string;
  placa_vehiculo?: string;
  ced_chof?: string;
  nombresapellidos?: string;
}
