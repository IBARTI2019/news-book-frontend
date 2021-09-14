import { Injectable } from '@angular/core';
import { QuestionBase, DropdownQuestion, TextboxQuestion, StaffReceivingTheGuard } from '../classes';
import { of } from 'rxjs';
import { API } from '../../utils/api';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class QuestionService extends API<any> {

  protected URL = `${this.URL_API}/main/material/`;
  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }

  // TODO: get from a remote source of question metadata
  getQuestions() {

    const questions: QuestionBase<string>[] = [

      new StaffReceivingTheGuard({
        key: 'StaffReceivingTheGuard',
        label: 'Personal que recibe la guardia',
        options: [
          { key: 'solid', value: 'Solid' },
          { key: 'great', value: 'Great' },
          { key: 'good', value: 'Good' },
          { key: 'unproven', value: 'Unproven' }
        ],
        order: 3
      }),

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
      }),

      new TextboxQuestion({
        key: 'firstName',
        label: 'First name',
        value: 'Bombasto',
        required: true,
        order: 1
      }),

      new TextboxQuestion({
        key: 'emailAddress',
        label: 'Email',
        type: 'email',
        order: 4
      }),

      new TextboxQuestion({
        key: 'emailAddress2',
        label: 'Email2',
        type: 'email',
        order: 1
      })
    ];

    return of(questions.sort((a, b) => a.order - b.order));
  }

  /**
   * obtener fichas planificadas para el turno ibarti
   */
  getPlannedTokensForTheIbartiTurn() {

  }
}