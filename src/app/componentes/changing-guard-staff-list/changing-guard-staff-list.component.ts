import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  PlannedStaff,
  Staff,
  StaffReceivingTheGuardSettings,
} from "app/interfaces";

const HEALTH_CONDITIONS = [
  {
    id: "good",
    text: "Buena",
  },
  {
    id: "average",
    text: "Regular",
  },
  {
    id: "bad",
    text: "Mala",
  },
];

const STAFF_ARR_DEAFAULT: PlannedStaff[] = [
  {
    cod_ficha: "1234567890",
    name_and_surname: "Hemny Sibrian",
    identification_card: "4354554354",
  },
  {
    cod_ficha: "0987654321",
    name_and_surname: "Alejandro Fabrega",
    identification_card: "3454353454",
  },
  {
    cod_ficha: "4321567890",
    name_and_surname: "Yonathan Aviles",
    identification_card: "4565465465",
  },
  {
    cod_ficha: "1567890234",
    name_and_surname: "Eliezer García",
    identification_card: "879767868",
  },
];

export const CHANGING_GUARD_STAFF_LIST_DEFAULT: StaffReceivingTheGuardSettings = {
  testing: false,
  guardStatus: "REGULAR",
  percentage: 100,
  showTokenField: true,
  showNameField: true,
  showProtocolField: true,
  showHealthConditionField: true,
  showCheckInField: true,
  showGuardStatusField: true,
};

@Component({
  selector: "app-changing-guard-staff-list",
  templateUrl: "./changing-guard-staff-list.component.html",
  styleUrls: ["./changing-guard-staff-list.component.css"],
})
export class ChangingGuardStaffListComponent implements OnInit, OnChanges {
  @Input() id: string = '';
  @Input() value: any = null;
  @Input() settings: StaffReceivingTheGuardSettings = CHANGING_GUARD_STAFF_LIST_DEFAULT;
  @Input() staffArrSelected: Staff[] = [];
  @Input() staffArr: PlannedStaff[] = STAFF_ARR_DEAFAULT;
  @Input() fGRoot!: FormGroup;
  @Input() readOnly: boolean = false;

  @Output() isValid: EventEmitter<boolean> = new EventEmitter<boolean>();

  fA: FormArray = new FormArray([]);
  healthConditions = [...HEALTH_CONDITIONS];
  fGStaff = new FormGroup({});
  defaultValues = { ...CHANGING_GUARD_STAFF_LIST_DEFAULT }

  constructor(private fB: FormBuilder) { }

  ngOnInit(): void {
    if (this.fGRoot && this.id && this.fGRoot.get(this.id)) {
      this.fA = this.fGRoot.get(this.id) as FormArray;
    }

    this.fA.statusChanges.subscribe((currentStatus) => {
      this.isValid.emit(currentStatus === "VALID" ? true : false);
    });

    this.staffArrSelected.forEach((v) => {
      this.addFG(v);
    });

    this.fGStaff = this.fB.group({
      staff: [this.staffArrSelected.map((v) => v)],
    });

    this.fGStaff.valueChanges.subscribe((values) => {
      values.staff.forEach((s: Staff) => {
        let found = null;
        if (this.fA.value) {
          found = this.fA.value.some((v: any) => {
            return v.cod_ficha === s.cod_ficha;
          });
        }
        if (!found) this.addFG(s);
      });
      this.fA.value.forEach((v: any, index: number) => {
        const found = values.staff.some((s: Staff) => {
          return v.cod_ficha === s.cod_ficha;
        });
        if (!found) this.fA.removeAt(index);
      });
    });
  }

  ngOnChanges(change: SimpleChanges): void {
    if (change.settings && change.settings.firstChange) {
      this.settings = change.settings.currentValue || {
        ...CHANGING_GUARD_STAFF_LIST_DEFAULT,
      }
    } else if (change.settings && !change.settings.currentValue) {
      this.settings = {
        ...CHANGING_GUARD_STAFF_LIST_DEFAULT,
      }
    }

    if (change.settings?.currentValue?.testing) {
      this.staffArr = STAFF_ARR_DEAFAULT;
    }
  }

  addFG(v: Staff): void {
    const fG = this.fB.group({
      cod_ficha: [
        v.cod_ficha || "",
        this.settings.showTokenField && Validators.required,
      ],
      name_and_surname: [
        v.name_and_surname || "",
        this.settings.showNameField && Validators.required,
      ],
      protocol: [
        v.protocol || false,
        this.settings.showProtocolField && Validators.required,
      ],
      health_condition: [
        v.health_condition || "average",
        this.settings.showHealthConditionField && Validators.required,
      ],
      check_in: [
        v.check_in || "",
        this.settings.showCheckInField && Validators.required,
      ],
      guard_status: [
        v.guard_status || this.settings.guardStatus,
        Validators.required,
      ],
    });
    this.fA.push(fG);
  }
}
