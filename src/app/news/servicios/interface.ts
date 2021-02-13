
export interface Usuario {
  id_news?: string | any;
  notice?: string;
  id_user?: string;
  ced_notifica?: string;
  nombres_apellidos?: string;
  id_type_news?:string;
  
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
