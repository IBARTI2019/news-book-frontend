
export interface Usuario {
    id_material?: string | any;
    cod_material?: string | any;
    serial_material?: string;
    id_warehouse?: string;
    description?: string;
    stock?: string;
    status?: string;

}
export interface Almacen {
    id_warehouse: string | any;
    descripcion: string;
    status: string;
}
