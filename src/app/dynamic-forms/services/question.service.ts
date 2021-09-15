import { Injectable } from '@angular/core';
import { QuestionBase, DropdownQuestion, TextboxQuestion, StaffReceivingTheGuard } from '../classes';
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
  getQuestions() {

    const questions: QuestionBase<string>[] = [

      new StaffReceivingTheGuard({
        key: 'staffReceivingTheGuard',
        label: 'Personal que recibe la guardia',
        order: 3
      }, this.ibartiService),

      new DropdownQuestion({
        key: 'brave',
        label: 'Bravery Rating',
        options: [
          { key: 'solid', value: 'Solid' },
          { key: 'great', value: 'Great' },
          { key: 'good', value: 'Good' },
          { key: 'unproven', value: 'Unproven' }
        ],
        order: 3
      }, null),

      new TextboxQuestion({
        key: 'firstName',
        label: 'First name',
        value: 'Bombasto',
        required: true,
        order: 1
      }, null),

      new TextboxQuestion({
        key: 'emailAddress',
        label: 'Email',
        type: 'email',
        order: 4
      }, null),

      new TextboxQuestion({
        key: 'emailAddress2',
        label: 'Email2',
        type: 'email',
        order: 1
      }, null)
    ];

    return of(questions.sort((a, b) => a.order - b.order));
  }

  generatePreviewQuentions(data: TemplateTypeNew[]) {
    let questions: QuestionBase<string>[] = [];
    data.forEach(d => {
      if (d?.code === "PLANNED_STAFF") {
        questions.push(
          new StaffReceivingTheGuard({
            key: d.code,
            label: 'Personal que recibe la guardia',
            order: d.order
          }, this.ibartiService)
        )
      }
      if (d?.code === "PLANNED_PERSONNEL_WITH_SAFETY_PROTOCOL") {
        questions.push(
          new StaffReceivingTheGuard({
            key: d.code,
            applies_security_protocol: true,
            label: 'Personal que recibe la guardia 2',
            order: d.order
          }, this.ibartiService)
        )
      }
    });
    return of(questions.sort((a, b) => a.order - b.order));
  }
}