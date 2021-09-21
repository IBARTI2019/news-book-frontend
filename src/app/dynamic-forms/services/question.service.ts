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
    let questions: QuestionBase<string>[] = [];
    if (test) {
      questions = [
        new StaffReceivingTheGuard({
          key: 'staffReceivingTheGuard',
          label: 'Personal que recibe la guardia',
        }, this.ibartiService),
        new DropdownQuestion({
          key: 'brave',
          label: 'Bravery Rating',
          options: [
            { key: 'solid', value: 'Solid' },
            { key: 'great', value: 'Great' },
            { key: 'good', value: 'Good' },
            { key: 'unproven', value: 'Unproven' }
          ]
        }, null),

        new TextboxQuestion({
          key: 'firstName',
          label: 'First name',
          value: 'Bombasto',
          required: true,
        }, null),

        new TextboxQuestion({
          key: 'emailAddress',
          label: 'Email',
          type: 'email',
        }, null),

        new TextboxQuestion({
          key: 'emailAddress2',
          label: 'Email2',
          type: 'email',
        }, null)
      ];
    } else {
      questions = this.generateControls(template);
    }

    return of(questions);
  }

  generatePreviewQuentions(data: TemplateTypeNew[]) {
    debugger;
    const questions = this.generateControls(data);
    return of(questions);
  }

  generateControls(template: TemplateTypeNew[]): QuestionBase<string>[] {
    debugger;
    let questions: QuestionBase<string>[] = [];
    template.forEach(d => {
      switch (d.code) {
        case 'TITLE':
          questions.push(
            new Title({
              key: d.code,
              code: d.code,
              label: 'Información',
              value: d?.value,
              required: false,
              form_field: false
            }, null),
          )
          break;
        case 'FREE_TEXT':
          questions.push(
            new TextboxQuestion({
              key: d.code,
              code: d.code,
              label: 'Información',
              value: '',
              required: false
            }, null),
          )
          break;
        case 'PLANNED_STAFF':
          questions.push(
            new StaffReceivingTheGuard({
              key: d.code,
              code: d.code,
              label: 'Personal que recibe la guardia',
              required: true,
            }, this.ibartiService)
          )
          break;
        case 'PLANNED_PERSONNEL_WITH_SAFETY_PROTOCOL':
          questions.push(
            new StaffReceivingTheGuard({
              key: d.code,
              code: d.code,
              applies_security_protocol: true,
              label: 'Personal que recibe la guardia 2',
              required: true
            }, this.ibartiService)
          )
          break;
        default:
          break;
      }
    });
    debugger;
    return questions;
  }
}