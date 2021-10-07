import { Injectable } from '@angular/core';
import { QuestionBase, DropdownQuestion, TextboxQuestion, StaffReceivingTheGuard, Title } from '../classes';
import { of } from 'rxjs';
import { API } from '../../utils/api';
import { HttpClient } from '@angular/common/http';
import { IbartiService } from 'app/services/ibarti.service';
import { TemplateTypeNew } from '../../interfaces';

@Injectable()
export class QuestionService extends API<any> {

  protected URL = `${this.URL_API}/core/template_data/`;
  constructor(
    protected http: HttpClient,
    public ibartiService: IbartiService
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

        new TextboxQuestion({
          value: '',
          key: 'firstName',
          label: 'First name',
          required: true,
          percentage_per_row: 100
        }, null),

        new TextboxQuestion({
          value: '',
          key: 'emailAddress',
          label: 'Email',
          type: 'email',
        }, null),

        new TextboxQuestion({
          value: '',
          key: 'emailAddress2',
          label: 'Email2',
          type: 'email',
          percentage_per_row: 100
        }, null)
      ];
    } else {
      questions = this.generateControls(template);
    }

    return of(questions);
  }

  generatePreviewQuentions(data: TemplateTypeNew[]) {
    const questions = this.generateControls(data);
    return of(questions);
  }

  generateControls(template: TemplateTypeNew[]): QuestionBase[] {
    let questions: QuestionBase[] = [];
    template.forEach((d, index) => {
      switch (d.code) {
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
            new TextboxQuestion({
              value: d.value || '',
              key: `${d.code}_${index}`,
              code: d.code,
              label: d.label || 'Información',
              required: false,
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
              required: true,
              form_field: false,
              percentage_per_row: Number(d.percentage_per_row) || 100,
              settings: d.settings,
            }, this.ibartiService)
          )
          break;
        case 'PLANNED_PERSONNEL_WITH_SAFETY_PROTOCOL':
          questions.push(
            new StaffReceivingTheGuard({
              value: d.value || '',
              key: `${d.code}_${index}`,
              code: d.code,
              form_field: false,
              applies_security_protocol: true,
              label: d.label || 'Personal que recibe la guardia 2',
              required: true,
              percentage_per_row: Number(d.percentage_per_row) || 100,
              settings: d.settings,
            }, this.ibartiService)
          )
          break;
        default:
          break;
      }
    });
    return questions;
  }
}