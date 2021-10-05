import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

export interface PlannedStaff {
  cod_ficha: string;
  identification_card: string;
  name_and_surname: string;
}

export interface Staff extends PlannedStaff {
  protocol: boolean;
  health_condition: string;
  check_in: string;
  guard_status: string;
}


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

@Component({
  selector: "app-changing-guard-staff-list",
  templateUrl: "./changing-guard-staff-list.component.html",
  styleUrls: ["./changing-guard-staff-list.component.css"],
})
export class ChangingGuardStaffListComponent implements OnInit {
  @Input() testing: boolean = false;
  @Input() percentage: number = 100;
  @Input() showTokenField: boolean = true;
  @Input() showNameField: boolean = true;
  @Input() showProtocolField: boolean = true;
  @Input() showHealthConditionField: boolean = true;
  @Input() showCheckInField: boolean = true;
  @Input() showGuardStatusField: boolean = true;
  @Input() staffArrSelected: Staff[] = [];
  @Input() staffArr: PlannedStaff[] = [
    {
      cod_ficha: "1234567890",
      name_and_surname: "Hemny Sibrian",
      identification_card: '4354554354',
    },
    {
      cod_ficha: "0987654321",
      name_and_surname: "Alejandro Fabrega",
      identification_card: '3454353454',
    },
    {
      cod_ficha: "4321567890",
      name_and_surname: "Yonathan Aviles",
      identification_card: '4565465465',
    },
    {
      cod_ficha: "1567890234",
      name_and_surname: "Eliezer García",
      identification_card: '879767868',
    },
  ];

  @Output() isValid: EventEmitter<boolean> = new EventEmitter<boolean>();

  fA: FormArray = new FormArray([]);
  healthConditions = [...HEALTH_CONDITIONS];
  fGStaff = new FormGroup({});

  constructor(private fB: FormBuilder) {}

  ngOnInit(): void {
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
        const found = this.fA.value.some((v: any) => {
          return v.cod_ficha === s.cod_ficha;
        });
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

  addFG(v: Staff): void {
    const fG = this.fB.group({
      cod_ficha: [v.cod_ficha || "", this.showTokenField && Validators.required],
      name_and_surname: [v.name_and_surname || "", this.showNameField && Validators.required],
      protocol: [
        v.protocol || false,
        this.showProtocolField && Validators.required,
      ],
      health_condition: [
        v.health_condition || "",
        this.showHealthConditionField && Validators.required,
      ],
      check_in: [
        v.check_in || "",
        this.showCheckInField && Validators.required,
      ],
      guard_status: [v.guard_status || "", Validators.required],
    });
    this.fA.push(fG);
  }
}
