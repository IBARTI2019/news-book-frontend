import {Component, OnInit} from '@angular/core';
// import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import {BsLocaleService, defineLocale} from 'ngx-bootstrap';
// import { listLocales } from 'ngx-bootstrap/chronos';
import {esLocale} from 'ngx-bootstrap/locale';
import {FormBuilder} from '@angular/forms';
import * as moment from 'moment';
// import {NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
//  import {NgbDateCustomParserFormatter} from './dateformat';
// import { moment } from 'ngx-bootstrap/chronos/test/chain';
//  import {formatDate} from '@angular/common';

/**
 * Componente de datepicker que permite insertar en cualquier
 * lugar un input tipo calendario
 * para llamarlo se utiliza
 * <app-datepicker></app-datepicker>
 * al mismo se le puede agregar atributos y clases de input y bootstap
 * para el formato dd/mm/yyyy se utiliza el archivo dateformat.ts
 * que esta en la raiz del componente.
 */


@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
})
export class DatepickerComponent implements OnInit {

  /*  bsValue = new Date();
    bsRangeValue: Date[];
    maxDate = new Date();
    date: any;
    locale = 'es';
    locales = listLocales();*/
  date = new Date();
  today;
  newVar: any;
  myDate: any;
  myDateOut: any;
  // fecha: FormGroup;
  // modelDate: any;
  constructor(
    private localeService: BsLocaleService,
    private formBuilder: FormBuilder,
  ) {
    (moment as any).fn.toString = function() {
      return this.format('YYYY-MM-DD');
    };
    defineLocale('es', esLocale);
    this.localeService.use('es');
  }

  ngOnInit() {
    // this.fecha = this.formBuilder.group({
    // date: null
    // })
    this.today = new Date().toISOString().split('T')[0];
  }

  /*applyLocale(pop: any) {
    this.localeService.use(this.locale);
    pop.hide();
    pop.show();
  }*/


  parseDate(dateString: string): Date {
    if (dateString) {
      return new Date(dateString);
    }
    return null;
  }

}
