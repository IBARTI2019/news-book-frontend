import { Injectable } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";

import { QuestionBase } from "../classes";

@Injectable()
export class ControlService {
  constructor() { }

  toFormGroup(questions: QuestionBase[]) {
    const group: any = {};
    questions.forEach((question) => {
      switch (question.controlType) {
        case "staffReceivingTheGuard":
          group[question.key] = question.required
            ? new FormArray([], Validators.required)
            : new FormArray([]);
          break;
        case "scope":
          group[question.key] = question.required
            ? new FormArray([], Validators.required)
            : new FormArray([]);
          break;
        default:
          group[question.key] = question.required
            ? new FormControl(question.value || "", Validators.required)
            : new FormControl(question.value || "");
          break;
      }
    });
    return new FormGroup(group);
  }
}
