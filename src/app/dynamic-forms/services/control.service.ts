import { Injectable } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

import { QuestionBase } from "../classes";

@Injectable()
export class ControlService {
  constructor(private fB: FormBuilder,) { }

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
        case "persons":
          group[question.key] = question.required
            ? new FormArray([], Validators.required)
            : new FormArray([]);
          break;
        case "person":
          group[question.key] = this.newFormPerson(question);
          break;
        case "vehicles":
          group[question.key] = question.required
            ? new FormArray([], Validators.required)
            : new FormArray([]);
          break;
        case "vehicle":
          group[question.key] = this.newFormVahicle(question);
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

  public newFormVahicle(question: QuestionBase) {
    const form = this.fB.group(
      {
        license_plate: [
          question.value.license_plate || "",
          question.settings.showTokenField && Validators.required,
        ],
        owner_full_name: [
          question.value.owner_full_name || "",
          question.settings.showNameField && Validators.required,
        ],
        owner_type: [
          question.value.owner_type || null,
          question.settings.showOwnerTypeField && Validators.required,
        ],
        movement_type: [
          question.value.movement_type || null,
          question.settings.showMovementTypeField && Validators.required,
        ],
        hour: [
          question.value.hour || '',
          question.settings.showHourField && Validators.required,
        ],
        entry: [
          question.value.entry || false,
          question.settings.showEntryField && Validators.required,
        ],
        protocol: [
          question.value.protocol || false,
          question.settings.showProtocolField && Validators.required,
        ],
        materials: new FormControl({ value: question.value?.materials?.value || [] }),
        cargo_vehicle: [
          question.value.cargo_vehicle || { trailer_plate: "", loaded: false, seal_number: "", document_number: "", sealed: false, loading_review: false }
        ],
      });
    return form;
  }

  public newFormPerson(question: QuestionBase) {
    const form = this.fB.group({
      identification_number: [
        question.value.identification_number || "",
        question.settings.showTokenField && Validators.required,
      ],
      full_name: [
        question.value.full_name || "",
        question.settings.showNameField && Validators.required,
      ],
      type_person: [
        question.value.type_person || null,
        question.settings.showTypePersonField && Validators.required,
      ],
      reason_visit: [
        question.value.reason_visit || null,
        question.settings.showReasonVisitField && Validators.required,
      ],
      movement_type: [
        question.value.movement_type || null,
        question.settings.showMovementTypeField && Validators.required,
      ],
      entry: [
        question.value.entry || false,
        question.settings.showEntryField && Validators.required,
      ],
      hour: [
        question.value.hour || '',
        question.settings.showHourField && Validators.required,
      ],
      protocol: [
        question.value.protocol || false,
        question.settings.showProtocolField && Validators.required,
      ],
      materials: new FormControl({ value: question.value.materials?.value || [] }),
    });
    return form;
  }
}
