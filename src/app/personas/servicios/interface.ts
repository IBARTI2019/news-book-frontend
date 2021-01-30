
export interface Usuario {
    id_person?: string | any;
    cod_person?: string | any;
    name?: string;
    lastname?: string;
    doc_ident?: string;
    addres?: string;
    phono?: string | any;
    movil?: string | any;
    id_type_person?: string;
    status?: string;

}
export interface Tipopersona {
    id_type_person: string | any;
    description: string;
    priority: string;
    status: string;
}
