import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
export const ABSOLUTE_PATH = 'appAbsolutePath';

/**
 *  Servicio para guardar objectos a travez de clave valor
 */
@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  readonly map: any;

  constructor(private router: Router,) {
    this.map = {};
  }

  /**
   * Funcion para guardar por medio de clave:valor
   * @param key  clave que identifica el valor guardado
   * @param value valor guardado
   */
  push(key: string, value: any): GlobalService {
    this.map[key] = value;
    return this;
  }

  /**
   * Funcion para retornar el valor a travez de la clave
   * @param key clave del objecto que se desea retornar
   */
  get(key: string): any {
    return this.map[key];
  }

  /**
   * Funcion para eliminar registros a travez de la clave
   * @param key clave para poder eliminar registro
   */
  delete(key: string): GlobalService {
    if (this.exists(key)) {
      delete this.map[key];
    }
    return this;
  }

  /**
   * Funcion para rectificar si existe el objecto
   * @param key clave del objecto
   */
  exists(key: string): boolean {
    return this.map.hasOwnProperty(key);
  }

  /**
   * Funcion para obtener las rutas del router
   */
  getRutas(): string[] {
    let rutas: string[] = [];
    let modulos: any = this.router.config[0].children?.[1].children;
    modulos?.forEach((modulo: any) => {
      if (modulo.path !== "" && modulo?.children) {
        modulo?.children.forEach((ruta: any) => {
          rutas.push(`${modulo.path}/${ruta.path}`)
        });
      }
    });
    return rutas;
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}
