import { Injectable } from '@angular/core';
import { QuestionBase, DropdownQuestion, TextboxQuestion, StaffReceivingTheGuard, Title, StaffOesvica, SystemDate, SystemHour, BookScope, Amount, Point, formerGuard, FreeText, SelectionQuestion, Vehicles, Vehicle, Persons, PersonQuestion } from '../classes';
import { of } from 'rxjs';
import { API } from '../../utils/api';
import { HttpClient } from '@angular/common/http';
import { IbartiService } from 'app/services/ibarti.service';
import { TemplateTypeNew } from '../../interfaces';
import { PointsService } from 'app/services/points.service';
import { VehicleService } from 'app/services/vehicle.service';
import { PersonService } from 'app/services/person.service';

@Injectable()
export class QuestionService extends API<any> {

  protected URL = `${this.URL_API}/core/template_data/`;
  constructor(
    protected http: HttpClient,
    public ibartiService: IbartiService,
    public vehicleService: VehicleService,
    public pointsService: PointsService,
    public personService: PersonService
  ) {
    super(http);
  }

  // TODO: get from a remote source of question metadata
  getQuestions(template: TemplateTypeNew[], test?: boolean) {
    let questions: QuestionBase[] = [];
    if (test) {
      questions = [
        new StaffReceivingTheGuard({
          value: '',
          key: 'staffReceivingTheGuard',
          label: 'Personal que recibe la guardia',
          percentage_per_row: 100,
          form_field: false,
          required: true,
          settings: {
            testing: true,
            guardStatus: "REGULAR",
            percentage: 100,
            showTokenField: true,
            showNameField: true,
            showProtocolField: true,
            showHealthConditionField: true,
            showCheckInField: true,
            showGuardStatusField: true,
          },
        }, this.ibartiService),
        new DropdownQuestion({
          value: '',
          key: 'brave',
          label: 'Bravery Rating',
          options: [
            { key: 'solid', value: 'Solid' },
            { key: 'great', value: 'Great' },
            { key: 'good', value: 'Good' },
            { key: 'unproven', value: 'Unproven' }
          ],
          percentage_per_row: 100
        }, null),

        new FreeText({
          value: '',
          key: 'firstName',
          label: 'First name',
          required: true,
          percentage_per_row: 100
        }, null),

        new FreeText({
          value: '',
          key: 'emailAddress',
          label: 'Email',
          type: 'email',
        }, null),

        new FreeText({
          value: '',
          key: 'emailAddress2',
          label: 'Email2',
          type: 'email',
          required: true,
          percentage_per_row: 100
        }, null)
      ];
    } else {
      questions = this.generateControls(template);
    }

    return of(questions);
  }

  generatePreviewQuentions(data: TemplateTypeNew[]) {
    const questions = this.generateControls(data || []);
    return of(questions);
  }

  generateControls(template: TemplateTypeNew[]): QuestionBase[] {
    let questions: QuestionBase[] = [];
    template.forEach((d, index) => {
      switch (d.code) {
        case 'SELECTION':
          questions.push(
            new SelectionQuestion({
              value: d.value || '',
              key: `${d.code}_${index}`,
              code: d.code,
              label: d.label || 'Seleccionar',
              required: d.required,
              options: d.options,
              percentage_per_row: Number(d.percentage_per_row) || 100,
              form_field: false
            }, null),
          )
          break;
        case 'TEXTBOX':
          questions.push(
            new TextboxQuestion({
              value: d.value || '',
              key: `${d.code}_${index}`,
              code: d.code,
              label: d.label || 'Información',
              required: d.required,
              maximum_characters: Number(d.maximum_characters) || 255,
              percentage_per_row: Number(d.percentage_per_row) || 100,
              form_field: true
            }, null),
          )
          break;
        case 'HOUR':
          questions.push(
            new SystemHour({
              value: d.value || '',
              key: `${d.code}_${index}`,
              code: d.code,
              type: "hour",
              label: d.label || 'Hora',
              required: d.required,
              form_field: false,
              percentage_per_row: Number(d.percentage_per_row) || 100,
            }, null),
          )
          break;
        case 'DATE':
          questions.push(
            new SystemDate({
              value: d.value || '',
              key: `${d.code}_${index}`,
              code: d.code,
              type: "date",
              label: d.label || 'Información',
              required: d.required,
              form_field: true,
              percentage_per_row: Number(d.percentage_per_row) || 100,
            }, null),
          )
          break;
        case 'TITLE':
          questions.push(
            new Title({
              value: d.value || '',
              key: `${d.code}_${index}`,
              code: d.code,
              label: d.label || 'Información',
              required: false,
              form_field: false,
              percentage_per_row: Number(d.percentage_per_row) || 100,
            }, null),
          )
          break;
        case 'FREE_TEXT':
          questions.push(
            new FreeText({
              value: d.value || '',
              key: `${d.code}_${index}`,
              code: d.code,
              label: d.label || 'Información',
              required: d.required,
              percentage_per_row: Number(d.percentage_per_row) || 100,
            }, null),
          )
          break;
        case 'PLANNED_STAFF':
          questions.push(
            new StaffReceivingTheGuard({
              value: d.value || '',
              key: `${d.code}_${index}`,
              code: d.code,
              label: d.label || 'Personal que recibe la guardia',
              required: d.required,
              form_field: false,
              percentage_per_row: Number(d.percentage_per_row) || 100,
              settings: d.settings,
            }, this.ibartiService)
          )
          break;
        case 'OESVICA_STAFF':
          questions.push(
            new StaffOesvica({
              value: d.value || '',
              key: `${d.code}_${index}`,
              code: d.code,
              label: d.label || 'Personal Oesvica',
              required: d.required,
              form_field: false,
              percentage_per_row: Number(d.percentage_per_row) || 100,
              settings: d.settings,
            }, this.ibartiService)
          )
          break;
        case 'FORMER_GUARD':
          questions.push(
            new formerGuard({
              value: d.value || '',
              key: `${d.code}_${index}`,
              code: d.code,
              label: d.label || 'Personal de la Guardia Anterior',
              required: d.required,
              form_field: false,
              percentage_per_row: Number(d.percentage_per_row) || 100,
              settings: d.settings,
            }, this.ibartiService)
          )
          break;
        case 'SUB_LINE':
          questions.push(
            new BookScope({
              value: d.value || '',
              key: `${d.code}_${index}`,
              code: d.code,
              label: d.label || 'Alcance',
              required: d.required,
              form_field: false,
              percentage_per_row: Number(d.percentage_per_row) || 100,
              settings: d.settings,
            }, this.ibartiService)
          )
          break;
        case 'POINT':
          questions.push(
            new Point({
              value: d.value || '',
              key: `${d.code}_${index}`,
              code: d.code,
              label: d.label || 'Puntos',
              required: d.required,
              form_field: true,
              percentage_per_row: Number(d.percentage_per_row) || 100
            }, this.pointsService)
          )
          break;
        case 'AMOUNT':
          questions.push(
            new Amount({
              value: d.value || '',
              key: `${d.code}_${index}`,
              code: d.code,
              label: d.label || 'Cantidad',
              required: d.required,
              percentage_per_row: Number(d.percentage_per_row) || 100,
            }, null),
          )
          break;
        case 'VEHICLES':
          questions.push(
            new Vehicles({
              value: d.value || '',
              key: `${d.code}_${index}`,
              code: d.code,
              label: d.label || 'Control de acceso de vehículos',
              required: d.required,
              form_field: false,
              percentage_per_row: Number(d.percentage_per_row) || 100,
              settings: d.settings,
            }, this.vehicleService)
          )
          break;
        case 'VEHICLE':
          questions.push(
            new Vehicle({
              value: d.value || '',
              key: `${d.code}_${index}`,
              code: d.code,
              label: d.label || 'Control de acceso de vehículo',
              required: d.required,
              form_field: false,
              percentage_per_row: Number(d.percentage_per_row) || 100,
              settings: d.settings,
            }, this.vehicleService)
          )
          break;
        case 'PERSONS':
          questions.push(
            new Persons({
              value: d.value || '',
              key: `${d.code}_${index}`,
              code: d.code,
              label: d.label || 'Control de acceso de personas',
              required: d.required,
              form_field: false,
              percentage_per_row: Number(d.percentage_per_row) || 100,
              settings: d.settings,
            }, this.personService)
          )
          break;
        case 'PERSON':
          questions.push(
            new PersonQuestion({
              value: d.value || '',
              key: `${d.code}_${index}`,
              code: d.code,
              label: d.label || 'Control de acceso de persona',
              required: d.required,
              form_field: false,
              percentage_per_row: Number(d.percentage_per_row) || 100,
              settings: d.settings,
            }, this.personService)
          )
          break;
        default:
          break;
      }
    });
    return questions;
  }
}