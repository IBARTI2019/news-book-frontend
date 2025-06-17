export interface DTColumn {
  /** Ancho de la columna */
  width?: number | string;

  /** Atributo que se consultará al backend, por defecto attribute */
  dataAttribute?: string;

  /** Atributo que se mostrará en la columna */
  attribute?: string;

  /** Cabecera de la columna, por defecto title case de attribute */
  header?: string;

  /** Ruta para el routerLink del enlace de la columna */
  routerLink?: string;

  /** Atributo que se pasa como parámetro al routerLink, por defecto id */
  routerLinkAttribute?: string;

  /** Tipo de columna. Por defecto text */
  type?: 'date' | 'img' | 'text' | 'bool' | 'json';

  /** Formato de fecha de la columna. Por defecto defaultDateFormat */
  dateFormat?: string;

  /** Valor por defecto de la columna, por defecto N/A para text y date, e 'imagen no disponible' para img */
  default?: string;

  /** Clave del diccionario de plantillas de donde se extrae el template para la columna */
  template?: string;

  /** Acortar uuid de la columna (sólo válido para columnas con UUID) */
  shortUUID?: boolean;

  /** Css que se aplica a td de la columna */
  className?: string;

  /** Separador de elementos de un array a mostrar en el excel */
  separatorExcelColumn?: string;

  /** Define si un elemento (columna) tiene como valor un object */
  objectExcelColumn?: boolean;

  /** Define que propiedad del objeto de una columna se mostrará en el excel 
   * (Funciona solo si el atributo objectExcelColumn esta) */
  propertyObjectExcelColumn?: string;

  /** Define si a la columna se le oculta el filtro o no */
  hideFilter?: boolean;
}

export interface DTFilterField {
  value?: string;
  description?: string;
}

export interface DTFilter {
  /** Tipo de input, por defecto html */
  type: 'select' | 'html' | 'range' | 'callable';

  /** Subtipo de input, válido cuando type es html o range */
  dataType?: 'date' | 'number' | 'text';

  /** Opciones en caso de que type sea select */
  options?: any[];
  multiple?: boolean;

  /** Atributo con el valor que se muestra en el select */
  optionDisplayAttribute?: string;

  /** Atributo con valor que se selecciona en el select */
  optionValueAttribute?: string;
}

export interface DTCSVConfig {
  /** Prefijo en el nombre del archivo csv */
  nombre?: string;

  /** Parámetros adicionales de la generación de csv */
  params?: any;

  /** En caso de éxito llamar a esta función */
  success?: (resp: any) => {};

  /** En caso de error llamar a esta función */
  error?: (resp: any) => {};
}

export interface CheckChangeEvent {
  /** Items que cambiaron su valor */
  items: any[];

  /** Nuevo valor del checkbox */
  value: boolean;
}

// TODO: mejorar
export interface DTFilters {
  0?: DTFilter;
  1?: DTFilter;
  2?: DTFilter;
  3?: DTFilter;
  4?: DTFilter;
  5?: DTFilter;
  6?: DTFilter;
  7?: DTFilter;
  8?: DTFilter;
  9?: DTFilter;
  10?: DTFilter;
  11?: DTFilter;
  12?: DTFilter;
  13?: DTFilter;
  14?: DTFilter;
  15?: DTFilter;
  16?: DTFilter;
  17?: DTFilter;
  18?: DTFilter;
  19?: DTFilter;
  20?: DTFilter;
}