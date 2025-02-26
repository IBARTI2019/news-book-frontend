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
          group[question.key] = this.newFormVehicle(question);
          break;
        case "round":
          group[question.key] = this.newFormRound(question);
          break;
        case "selection":
          group[question.key] = question.required
            ? new FormControl(question.value || "", Validators.required)
            : new FormControl(question.value || "");
          break
        case "attachedFile":
          group[question.key] = this.newFormAttachedFile(question);
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

  public newFormVehicle(question: QuestionBase) {
    const form = this.fB.group(
      {
        license_plate: [
          question.value.license_plate || "",
          question.settings.showTokenField && Validators.required,
        ],
        model: [
          question.value.model || "",
          question.settings.showModelField && Validators.required,
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
      place_of_reception: [
        question.value.place_of_reception || null,
        question.settings.showPlaceOfReceptionField && Validators.required,
      ],
      movement_type: [
        question.value.movement_type || null,
        question.settings.showMovementTypeField && Validators.required,
      ],
      accompany_visitor: [
        question.value.accompany_visitor || null,
        question.settings.showAccompanyVisitor && Validators.required,
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
        question.value.protocol || '',
        question.settings.showProtocolField && Validators.required,
      ],
      instituccion: [
        question.value.instituccion || '',
        question.settings.showTypePersonField && Validators.required,
      ],
      observacion: [
        question.value.observacion || '',
        question.settings.showTypePersonField && Validators.required,
      ],

      ident_recibe: [
        question.value.ident_recibe || '',
        question.settings.showTypePersonField && Validators.required,
      ],
      name_recibe: [
        question.value.name_recibe || '',
        question.settings.showTypePersonField && Validators.required,
      ],
      cargo_recibe: [
        question.value.cargo_recibe || '',
        question.settings.showTypePersonField && Validators.required,
      ],
      company_name: [
        question.value.company_name || '',
        question.settings.showTypePersonField && Validators.required,
      ],
      guide_number: [
        question.value.guide_number || '',
        question.settings.showTypePersonField && Validators.required,
      ],
      rif: [
        question.value.rif || '',
        question.settings.showTypePersonField && Validators.required,
      ],
      // institucciones: new FormControl({ value: question.value.institucciones?.value || {} }),
      materials: new FormControl({ value: question.value.materials?.value || [] }),
      vaccination_card_number: [
        question.value.vaccination_card_number || "",
        question.settings.showVaccinationCardNumberField && Validators.required,
      ],
      assigned_card_number: [
        question.value.assigned_card_number || "",
        question.settings.showAssignedCardNumberField && Validators.required,
      ],
    });
    return form;
  }

  public newFormRound(question: QuestionBase) {
    const form = this.fB.group({
      number: [
        question.value.number || "",
        question.settings.showNumberField && Validators.required,
      ],
      hour_start: [
        question.value.hour_start || "",
        question.settings.showHourStartField && Validators.required,
      ],
      hour_end: [
        question.value.hour_end || "",
        question.settings.showHourEndField && Validators.required,
      ],
      observation: [
        question.value.observation || "",
        question.settings.showObservationField && Validators.required,
      ],
      reason: [
        question.value.reason || "",
        question.settings.showReasonField && question.required && Validators.required,
      ]
    });
    return form;
  }

  public newFormAttachedFile(question: QuestionBase) {
    const form = this.fB.group({
      attachedFiles: [
        question.value
      ]
    });
    return form;
  }

  
}
