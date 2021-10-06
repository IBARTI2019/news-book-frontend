import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { QuestionBase } from '../classes';

@Injectable()
export class ControlService {
  constructor() { }

  toFormGroup(questions: QuestionBase[]) {
    const group: any = {};
    questions.forEach(question => {
      group[question.key] = question.required ? new FormControl(question.value || '', Validators.required)
        : new FormControl(question.value || '');
    });
    return new FormGroup(group);
  }
}