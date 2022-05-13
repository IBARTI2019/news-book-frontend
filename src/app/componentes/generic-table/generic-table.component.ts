import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ChangeDetectorRef } from '@angular/core';
import { API } from '../../utils/api';
import * as _ from 'lodash';
import { CheckChangeEvent, DTColumn, DTCSVConfig, DTFilterField, DTFilters } from './interface';
import { MatSort } from '@angular/material/sort';
import { GlobalService } from '../../utils/global.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import * as $ from "jquery";
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'app/interfaces';
import { UserService } from 'app/services/user.service';

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

export class GenericTableComponent implements OnInit, AfterViewChecked {

  @Input()
  /* Campos a filtrar */
  filterFields: DTFilterField[] = [];

  @Input()
  /** Filtros que se colocan en la cabecera. Si no se define un filtro se colocará un campo de texto */
  filters: DTFilters = {};

  @Input()
  /** Ocultar los filtros */
  showFilters = false;

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
  data: any = [];

  @Input()
  /** Método de la API que se usa para la consulta */
  serviceMethod = 'ajax';

  @Input()
  /** Método de la API que se usa para la consulta */
  serviceMethodParams: any = {};

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
  textDefault = 'N/A';

  @Input()
  /** Imagen por defecto si la columna imagen es nula */
  imgDefault = '/assets/images/material-default.jpg';

  @Input()
  /** Columna por la cual se ordena, por defecto la primera columna */
  orderColumn = 0;

  @Input()
  /** Dirección en la que se ordena la tabla, por defecto descendente */
  orderDir = 'desc';

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
  defaultOptionDisplayAttribute = 'name';


  @Input()
  /** Agregar columna de checkbox en la tabla */
  checkBoxColumn?: boolean;

  @Input()
  /** Atributo unico que se utiliza para distinguir items */
  checkColumnAttribute = 'id';

  @Input()
  /** Mostrar boton para agregar */
  btnAdd?: boolean = true;

  @Input()
  /** Icono a mostrar en el boton para agregar */
  addIcon?: string = undefined;

  @Input()
  /** Mostrar boton para refrescamiento manual */
  btnRefresh?: boolean;

  @Input()
  /** Mostrar boton para Carga Masiva manual */
  btnbulkload?: boolean;

  @Input()
  /** Mostrar boton para exportación de archivo excel */
  btnExcel: boolean = false;

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
  /** Atributo que se usa para mostrar o no el paginador */
  is_paged: boolean = true;

  @Input()
  /** Formato del paginador */
  paginatorOptions: any = { pageSizeOptions: [], length: 0 };

  @Input()
  /** Clave del diccionario de plantillas de donde se extrae el template para el Collapse de la fila */
  templateCollapsed: { template: string } = { template: '' };

  @Input()
  hideMobileDesignGeneric = false
  /** Hace que se oculte el diseño movil y se muestre la tabla en horizontal */

  @Input()
  /** Clave del diccionario de plantillas de donde se extrae el template para el diseño movil de la fila */
  templateMovilDesign: { template: string } = { template: '' };

  @Input()
  /** Clave del diccionario de plantillas de donde se extrae el template para el diseño movil de la fila */
  fieldTitleMovilDesign?: string = '';

  @Input()
  /** Hace que el collase de cada fila se expanda al activarse el hover sobre una fila */
  openHoverCollapsed = false;

  @Input()
  /** Mensaje a mostrar cuando no exista data en la Tabla */
  messageNoData: string = 'No Data';

  @Input()
  /** Define si es necesario que la tabla renderise el diseño para movil, en sace de que no sea necesario (false), mejora el rendimiento  */
  applyMovil = true

  @Input()
  pageSize: number = 50;

  /** Formato de fecha por defecto para las columnas de fecha */
  defaultDateFormat = 'dd/MM/yyyy HH:mm';

  /** Elementos de la tabla */
  items: any[] = [];

  colStartIndex = 0;

  @Output()
  checkedItemsChange = new EventEmitter();

  @Output()
  addChange = new EventEmitter();

  /** Evento que devuelve la longitud de la data */
  @Output()
  lengthResult = new EventEmitter<number>();

  checkedItemsValue: any[] = [];

  checkBoxValue: any = {};
  checkAllValue: boolean = false;

  dataSource: any = new MatTableDataSource([]);

  private paginator!: MatPaginator;
  private sort: any;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  paging = false;
  cargando = true;
  filterValue: string = '';

  placeholder: string = "Buscar ";
  selectedField!: DTFilterField | null;

  filterValues = {};

  user: User = {
    email: '',
    name: '',
    last_name: ''
  };

  filterTimeController: any = "";

  constructor(
    private globalService: GlobalService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private cdr: ChangeDetectorRef) {
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
      this.addCbColumn();
    }
    this.refresh();
    this.getPlaceHolder()
  }

  ngAfterViewChecked(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    if (this.filterFields.length <= 0) {
      this.columns.forEach((currentColum: DTColumn) => {
        if ('attribute' in currentColum && !('template' in currentColum)) {
          if (!('dataAttribute' in currentColum)) {
            this.filterFields.push({
              value: currentColum.attribute,
              description: currentColum.header
            });
          } else {
            this.filterFields.push({
              value: currentColum.dataAttribute,
              description: currentColum.header
            })
          }

        }
      });
    }
    this.cdr.detectChanges();
  }

  getPlaceHolder() {
    if (!this.selectedField) {
      this.placeholder = 'Buscar ' + '( TODOS )';
    } else {
      this.placeholder = 'Buscar ( ' + this.selectedField.description + ' )';
    }
    this.setupFilter();
  }

  setFilter(value: DTFilterField | null) {
    if (value) {
      this.selectedField = value;
    } else {
      this.selectedField = null;
    }
    this.getPlaceHolder();
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

  refresh(params?: {}) {
    this.cargando = true;
    if (this.service) {
      if (params) {
        this.service[this.serviceMethod](params).subscribe((data: any) => {
          this.data = data;
          if ('length' in data) {
            this.lengthResult.emit(data.length);
          } else {
            this.lengthResult.emit(data.results.length);
          }
          this.lengthResult.emit(data.length);
          this.setSource(data);
        });
      } else {
        this.service[this.serviceMethod](this.serviceMethodParams).subscribe((data: any) => {
          this.data = data;
          if ('length' in data) {
            this.lengthResult.emit(data.length);
          } else {
            this.lengthResult.emit(data.results.length);
          }
          this.setSource(data);
        });
      }
    } else {
      this.setSource(this.data);
    }
  }

  setSource(data: any) {
    if (data.results) {
      this.items = [...data.results];
      this.paginatorOptions.length = data.count;
      this.dataSource = new MatTableDataSource([...data.results]);
      this.setDataSourceAttributes(true)
      this.cargando = false;
    } else {
      this.items = [...data];
      if (this.is_paged) this.paginatorOptions.length = data.length;
      this.dataSource = new MatTableDataSource([...data]);
      this.cargando = false;
    }
  }

  checkAll($event: any) {
    const value = $event;
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
    const value = $event;
    //    this.checkBoxValue[this.getRealValue(this.items[i], this.checkColumnAttribute)] = $event;
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

  parseColumnsFilters(columns: DTColumn[]) {
    return columns.map((c) => c.dataAttribute ? `${c.dataAttribute}-filters` : `${c.attribute}-filters`);
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

  applyFilter2(e?: any, index?: number, isColumn?: boolean) {
    if (this.data.results && isColumn && index != undefined && index >= 0) {
      const fireEvent = e.type !== 'input';
      let control;
      if(e.target){
        control = e.target;
      }else{
        // control = e.source?._elementRef?.nativeElement;
        control = e.source;
      }

      let column = this.columns[index].dataAttribute;
      let attribute = this.columns[index].attribute || null
      if (attribute)
        column = this.columns[index].dataAttribute ? this.columns[index].dataAttribute : attribute.replace('.', "__");

      if (control?.name === 'cbColumn') {
        e.stopPropagation();
        return; // No disparar para checkbox
      }
      // this.filterServerData(control.value);
      if (
        control?.name?.endsWith('_range-min') ||
        control?.name?.endsWith('_range-max')
      ) {
        const min = $(
          '[name=' + control.name.replace('_range-max', '_range-min') + ']'
        ).val();
        const max = $(
          '[name=' + control.name.replace('_range-min', '_range-max') + ']'
        ).val();
        const search_range = `${min}~${max}`;
        // No buscar vacíos
        if (search_range === '~') {
          return;
        }
        if (fireEvent) {
          if (min || min === 0) {
            this.serviceMethodParams[control.name.replace('_range-min', '')] = Number(min);
          } else if (this.serviceMethodParams[control.name.replace('_range-min', '')]) {
            delete this.serviceMethodParams[control.name.replace('_range-min', '')];
          }
          if (max || max === 0) {
            this.serviceMethodParams[control.name.replace('_range-max', '')] = Number(max);
          } else if (this.serviceMethodParams[control.name.replace('_range-max', '')]) {
            delete this.serviceMethodParams[control.name.replace('_range-max', '')];
          }
          clearTimeout(this.filterTimeController);
          this.filterTimeController = setTimeout(() => this.refresh(), 1500);
        }
      } else if (
        control?.name?.endsWith('_date-min') ||
        control?.name?.endsWith('_date-max')
      ) {
        const min = $(
          '[name=' + control.name.replace('_date-max', '_date-min') + ']'
        ).val();
        const max = $(
          '[name=' + control.name.replace('_date-min', '_date-max') + ']'
        ).val();
        const search_range = `${min}~${max}`;

        // No buscar vacíos
        if (search_range === '~') {
          return;
        }

        if (fireEvent) {
          if (min || min === 0) {
            this.serviceMethodParams[control.name.replace('_date-min', '')] = min;
          } else if (this.serviceMethodParams[control.name.replace('_date-min', '')]) {
            delete this.serviceMethodParams[control.name.replace('_date-min', '')];
          }
          if (max || max === 0) {
            this.serviceMethodParams[control.name.replace('_date-max', '')] = max;
          } else if (this.serviceMethodParams[control.name.replace('_date-max', '')]) {
            delete this.serviceMethodParams[control.name.replace('_date-max', '')];
          }
          clearTimeout(this.filterTimeController);
          this.filterTimeController = setTimeout(() => this.refresh(), 1500);
        }
      } else if (fireEvent) {
        debugger;
        if (control.value || control.value === 0) {
          if (column)
            this.serviceMethodParams[column] = control.value;
        } else {
          if (column)
            delete this.serviceMethodParams[column];
        }
        clearTimeout(this.filterTimeController);
        this.filterTimeController = setTimeout(() => this.refresh(), 1500);
      } else {
        clearTimeout(this.filterTimeController);
        this.filterTimeController = setTimeout(() => this.refresh(), 1500);
      }
    } else {
      if (e?.detail?.data) {
        let data = e.detail.data;
        data = data.toString();
        data = data.trim();
        data = data.toLocaleLowerCase();
        this.dataSource.filter = data;
      } else {
        if (this.data.results) {
          clearTimeout(this.filterTimeController);
          if (typeof e === "string") {
            this.filterValue = e;
          }
          if (this.filterValue !== "" || (typeof e === "string" && e !== "")) {
            this.serviceMethodParams["search"] = this.filterValue.toString();
            this.filterTimeController = setTimeout(() => this.refresh(), 1500);
          } else if (this.serviceMethodParams["search"]) {
            delete this.serviceMethodParams["search"];
            this.filterTimeController = setTimeout(() => this.refresh(), 1500);
          }
        } else {
          this.filterValue = this.filterValue.toString();
          this.filterValue = this.filterValue.trim();
          let newFilter = this.filterValue.toLocaleLowerCase();
          this.dataSource.filter = newFilter;
        }
      }
    }
  }

  setupFilter() {
    if (this.selectedField) {
      this.applyFilter2();
      /*       this.dataSource.filterPredicate = (d: any, filter: string) => {
              if (this.selectedField) {
                let search = `d.${this.selectedField.value}`;
                const textToSearch = eval(search) && eval(search).toString().toLowerCase() || '';
                return textToSearch.indexOf(filter) !== -1;
              } else {
                let band = false;
                const keys = Object.keys(d);
                for (let index = 0; index < keys.length && !band; index++) {
                  let currentKey = keys[index];
                  if (d[currentKey] && typeof (d[currentKey]) !== 'object') {
                    const textToSearchPredicate = d[currentKey] && d[currentKey].toString().toLowerCase() || '';
                    band = textToSearchPredicate.indexOf(filter) !== -1;
                  }
                }
                return band;
              }
      
            }; */
    } else {
      this.applyFilter2();
    }

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

  pageEvent(event: any) {
    if (this.data.results) {
      let url = event.previousPageIndex < event.pageIndex ? this.data.next : this.data.previous
      this.paging = true;
      this.service['previousNext'](url).subscribe((data: any) => {
        this.data = data;
        this.items = [...data.results];
        this.paginatorOptions.length = data.count;
        this.dataSource = new MatTableDataSource([...data.results]);
      }).add(() => { this.paging = false; this.cargando = false; })
    }
  }

  onAdd() {
    if (this.addChange.observers.length > 0) {
      this.addChange.emit({});
    } else {
      this.router.navigate(['add'], { relativeTo: this.route });
    }
  }

  filterServerData(value: string) {
    this.refresh(value);
  }

  addCbColumn() {
    const cols: DTColumn[] = [{
      dataAttribute: 'cbColumn',
      attribute: 'cbColumn',
      header: ' ',
    }];
    cols.push(...this.columns);
    this.columns = cols;
    this.colStartIndex = 1;
  }

  setDataSourceAttributes(add_paginator?: boolean) {
    if (this.is_paged && add_paginator) this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}