import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

interface Staff {
  id: string;
  token: string;
  name: string;
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
  @Input() showTokenField: boolean = true;
  @Input() showNameField: boolean = true;
  @Input() showProtocolField: boolean = true;
  @Input() showHealthConditionField: boolean = true;
  @Input() showCheckInField: boolean = true;
  @Input() showGuardStatusField: boolean = true;
  @Input() staffArrSelected: Staff[] = [];
  @Input() staffArr: Staff[] = [
    {
      id: "1",
      token: "1234567890",
      name: "Hemny Sibrian",
      protocol: true,
      health_condition: "bad",
      check_in: "",
      guard_status: "Esto es automático pero no se que va.",
    },
    {
      id: "2",
      token: "0987654321",
      name: "Alejandro Fabrega",
      protocol: false,
      health_condition: "good",
      check_in: "",
      guard_status: "Esto es automático pero no se que va.",
    },
    {
      id: "3",
      token: "4321567890",
      name: "Yonathan Aviles",
      protocol: false,
      health_condition: "average",
      check_in: "",
      guard_status: "Esto es automático pero no se que va.",
    },
    {
      id: "4",
      token: "1567890234",
      name: "Eliezer García",
      protocol: true,
      health_condition: "bad",
      check_in: "08:00",
      guard_status: "Esto es automático pero no se que va.",
    },
  ];

  @Output() isValid: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  fA: FormArray = new FormArray([]);
  healthConditions = [...HEALTH_CONDITIONS];
  fGStaff = new FormGroup({});

  constructor(private fB: FormBuilder) {}

  ngOnInit(): void {
    this.fA.statusChanges.subscribe((currentStatus) => {
      this.isValid.emit(currentStatus === "VALID" ? true : false);
      console.log(currentStatus);
    });

    this.staffArrSelected.forEach((v) => {
      this.addFG(v);
    });

    this.fGStaff = this.fB.group({
      staff: [this.staffArrSelected.map((v) => v)],
    });

    this.fGStaff.valueChanges.subscribe((values) => {
      console.log(this.fA.value);
      values.staff.forEach((s: Staff) => {
        const found = this.fA.value.some((v: any) => {
          return v.id === s.id;
        });
        if (!found) this.addFG(s);
      });
      this.fA.value.forEach((v: any, index: number) => {
        const found = values.staff.some((s: Staff) => {
          return v.id === s.id
        });
        if (!found) this.fA.removeAt(index);
      });
    });
  }

  addFG(v: Staff): void {
    const fG = this.fB.group({
      id: [v.id || ""],
      token: [v.token || "", this.showTokenField && Validators.required],
      name: [v.name || "", this.showNameField && Validators.required],
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
