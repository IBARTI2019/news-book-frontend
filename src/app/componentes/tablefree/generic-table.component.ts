import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { API } from 'app/utils/api';
import * as _ from 'lodash';

import { CheckChangeEvent, DTColumn, DTCSVConfig } from 'app/componentes/generic-table/interface';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalService } from 'app/utils/global.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class GenericTableComponentf implements OnInit {

  @Input()
  /** Mostrar los filtro */
  showFilter?: boolean;

  @Input()
  /** Columnas de la tabla */
  columns: DTColumn[] = [];

  @Input()
  /** API desde la cual se consultan los elemento */
  service: any | API<any> = null;

  @Input()
  /** Arreglo desde el cual se mostrarán los elemento */
  data: any[] = [];

  @Input()
  /** Método de la API que se usa para la consulta */
  serviceMethod = 'ajax';

  @Input()
  /** Método de la API que se usa para la consulta */
  serviceMethodParams = {};

  @Input()
  /** Colocar botón de descarga de CSV */
  csvButton = false;

  @Input()
  /** Mensaje que se muestra cuando no hay elementos en la tabla */
  msgEmpty = 'Sin resultados encontrados.';


  @Input()
  /** Tamaño de página */
  pageLength = 10;

  @Input()
  /** Configuración de descarga de archivo CSV */
  csv_config: DTCSVConfig = {};

  @Input()
  /** Texto por defecto en columnas vacías */
  textDefault = '- -';

  @Input()
  /** Imagen por defecto si la columna imagen es nula */
  imgDefault = '/assets/images/material-default.jpg';

  @Input()
  /** Columna por la cual se ordena, por defecto la primera columna */
  orderColumn = 0;

  @Input()
  /** Dirección en la que se ordena la tabla, por defecto ascendente */
  orderDir = 'asc';

  @Input()
  /** Parametros ajax de la tabla */
  params: any = {};

  @Input()
  /** Diccionario de plantillas personalizadas para las columnas */
  templates: any = {};

  @Input()
  /** Atributo del objeto del que se extrae la propiedad 'value' para filtros en select */
  defaultOptionValueAttribute = 'valor';

  @Input()
  /** Atributo del objeto del que se extrae lo que se mostrará en el option para filtros en select */
  defaultOptionDisplayAttribute = 'nombre';


  @Input()
  /** Agregar columna de checkbox en la tabla */
  checkBoxColumn?: boolean;

  @Input()
  /** Atributo unico que se utiliza para distinguir items */
  checkColumnAttribute = '_id';

  @Input()
  /** Mostrar boton para refrescamiento manual */
  btnRefresh?: boolean;

  @Input()
  /** Mostrar boton para exportación de archivo excel */
  btnExcel: boolean = true;
 @Input()
  /** Mostrar boton para exportación de archivo excel */
  btnpdf: boolean = true;
  @Input()
  /** Nombre de reporte excel */
  nameExcel: string = 'reporte_excel';

  @Input()
  /** Class para la filas */
  classRow!: (item: any) => string;

  @Input()
  /** Class para la filas */
  showCheck!: (item: any) => boolean;

  @Input()
  /** Atributo que se usa por defecto como parámetro del routerLink */
  defaultRouterLinkAttribute = '_id';

  @Input()
  /** Formato del paginador */
  pageSizeOptions: number[] = [10, 20, 30, 40, 50];

  @Input()
  /** Clave del diccionario de plantillas de donde se extrae el template para el Collapse de la fila */
  templateCollapsed: { template: string } = { template: '' };


  @Input()
  /** Mensaje a mostrar cuando no exista data en la Tabla */
  messageNoData: string = 'No Data';

  /** Formato de fecha por defecto para las columnas de fecha */
  defaultDateFormat = 'dd/MM/yyyy HH:mm';

  /** Elementos de la tabla */
  items: any[] = [];

  colStartIndex = 0;

  @Output()
  checkedItemsChange = new EventEmitter();

  checkedItemsValue: any[] = [];

  checkBoxValue: any = {};
  checkAllValue: boolean = false;

  dataSource: any = new MatTableDataSource([]);

  @ViewChild(MatSort) sort: any | MatSort;
  @ViewChild(MatPaginator) paginator: any | MatPaginator;

  cargando = true;

  constructor(private globalService: GlobalService) {
  }

  @Input()
  get checkedItems() {
    return this.checkedItemsValue;
  }

  set checkedItems(val) {
    this.checkedItemsValue = val;

    if (val.length === 0) {
      this.checkBoxValue = {};
      this.checkAllValue = false;
    }

    this.checkedItemsChange.emit(this.checkedItemsValue);
  }

  async ngOnInit() {
    if (this.checkBoxColumn === true) {
      const cols: DTColumn[] = [{
        attribute: 'cbColumn',
        header: ' ',
      }];
      cols.push(...this.columns);
      this.columns = cols;
      this.colStartIndex = 1;
    }
    this.refresh();
  }

  /** obtiene el valor de objeto.atributo con soporte para atributos anidados */
  getRealValue(obj: any, attribute: string, useShortUUID = false) {

    let value = _.get(obj, attribute);

    if (useShortUUID && value) {
      value = value.slice(0, 5);
    }
    return value;
  }

  /** Funcion para las columnas bool */
  siNo(data: number | boolean) {
    return data === 1 || data === true ? 'SI' : 'NO';
  }

  /** Workaround para disparar evento en componentes de fechas */
  dateChange($event: Date, input: HTMLInputElement) {
    setTimeout(() => {
      $(input).trigger('change');
    });
  }


  refresh() {
    this.cargando = true;
    if (this.service) {
      this.service[this.serviceMethod](this.serviceMethodParams).subscribe((data: any) => {
        this.setSource(data);
      });
    } else {
      this.setSource(this.data);
    }
  }

  setSource(data: any[]) {
    this.items = [...data];
    this.dataSource = new MatTableDataSource([...data]);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.cargando = false;
  }

  checkAll($event: any) {
    const value = $event.checked;
    for (const item of this.items) {
      const flat = this.showCheck ? this.showCheck(item) : true;
      if (flat) {
        this.checkBoxValue[this.getRealValue(item, this.checkColumnAttribute)] = value;
      }
    }
    // Filtro para omitir los check que no se deben de ver definidos por showCheck
    this.updateCheckedItems({
      value,
      items: this.items.filter((val: any) => this.checkBoxValue[val[this.checkColumnAttribute]])
    });
  }

  updateCheckedItems($event: CheckChangeEvent) {
    for (const item of $event.items) {
      const itemValue = this.getRealValue(item, this.checkColumnAttribute);
      if ($event.value) {
        if (!this.checkedItems.filter((listItem) => this.getRealValue(listItem, this.checkColumnAttribute) === itemValue).length) {
          this.checkedItems.push(item);
        }
      } else {
        _.remove(this.checkedItems, (listItem) => {
          return this.getRealValue(listItem, this.checkColumnAttribute) === itemValue;
        });
      }
    }
    this.updateCheckboxAll();
    if ($event.items.length === 0) {
      this.checkedItemsValue = [];
    }
    this.checkedItemsChange.emit(this.checkedItemsValue);
  }

  cbColumnChange($event: any, i: number) {
    const value = $event.checked;
    this.checkBoxValue[this.getRealValue(this.items[i], this.checkColumnAttribute)] = $event.checked;
    // Cambiar el valor de 1
    this.updateCheckedItems({
      value,
      items: [this.items[i]]
    });
  }

  validColumns(columns: DTColumn[]) {
    return columns.filter((c) => c.attribute !== 'cbColumn');
  }

  parseColumns(columns: DTColumn[]) {
    return columns.map((c) => c.dataAttribute || c.attribute);
  }

  public updateCheckboxAll() {
    for (const item of this.items) {
      if (!this.checkBoxValue[this.getRealValue(item, this.checkColumnAttribute)]) {
        this.checkAllValue = false;
        return;
      }
    }
    this.checkAllValue = true;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  exportAsXLSX(): void {
    let dataExcel = [...this.items];
    this.columns.forEach(column => {
      let atribute: any = column.dataAttribute ? column.dataAttribute : column.attribute;
      if (column.separatorExcelColumn) {
        dataExcel = dataExcel.map(d => {
          if (column.objectExcelColumn && column.propertyObjectExcelColumn) {
            let propiedad: any = column.propertyObjectExcelColumn;
            d[atribute] = d[atribute].map((a: any) => a[propiedad]).join(column.separatorExcelColumn);
          } else {
            d[atribute] = d[atribute].join(column.separatorExcelColumn);
          }
          return d;
        });
      } else if (column.objectExcelColumn && column.propertyObjectExcelColumn) {
        dataExcel = dataExcel.map(d => {
          let propiedad: any = column.propertyObjectExcelColumn;
          d[atribute] = d[atribute][propiedad]
          return d;
        });
      }
    });
    this.globalService.exportAsExcelFile(dataExcel, this.nameExcel);
  }

}
