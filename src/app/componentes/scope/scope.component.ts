import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Scope, ScopeSettings } from 'app/interfaces';

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

const SCOPE_ARR_DEAFAULT: Scope[] = [
  {
    code: "1234567890",
    name: "Hemny Sibrian",
    amount: 5
  },
];

export const SCOPE_LIST_DEFAULT: ScopeSettings = {
  percentage: 100,
  showTokenField: true,
  showNameField: true,
  showHealthConditionField: true,
  showObservationField: true,
  showAmountField: true,
};

@Component({
  selector: 'app-scope',
  templateUrl: './scope.component.html',
  styleUrls: ['./scope.component.css']
})
export class ScopeComponent implements OnInit, OnChanges {
  @Input() id: string = '';
  @Input() value: any = null;
  @Input() settings: ScopeSettings = SCOPE_LIST_DEFAULT;
  @Input() scopeArrSelected: Scope[] = [];
  @Input() scopeArr: Scope[] = SCOPE_ARR_DEAFAULT;
  @Input() fGRoot!: FormGroup;
  @Input() readOnly: boolean = false;

  @Output() isValid: EventEmitter<boolean> = new EventEmitter<boolean>();

  fScope: FormArray = new FormArray([]);
  healthConditions = [...HEALTH_CONDITIONS];
  fGscope = new FormGroup({});
  defaultValues = { ...SCOPE_LIST_DEFAULT }
  scopeCurrent: any;
  constructor(private fB: FormBuilder) { }

  ngOnInit(): void {
    if (this.fGRoot && this.id && this.fGRoot.get(this.id)) {
      this.fScope = this.fGRoot.get(this.id) as FormArray;
    }

    this.fScope.statusChanges.subscribe((currentStatus) => {
      this.isValid.emit(currentStatus === "VALID" ? true : false);
    });

    this.scopeArrSelected.forEach((v) => {
      this.addFG(v);
    });

    this.fGscope = this.fB.group({
      scope: [this.scopeArrSelected.map((v) => v)],
    });

    this.fGscope.valueChanges.subscribe((values) => {
      this.scopeCurrent = values.scope;
    });
  }

  ngOnChanges(change: SimpleChanges): void {
    if (change.settings && change.settings.firstChange) {
      this.settings = change.settings.currentValue || {
        ...SCOPE_LIST_DEFAULT,
      }
    } else if (change.settings && !change.settings.currentValue) {
      this.settings = {
        ...SCOPE_LIST_DEFAULT,
      }
    }
  }

  addFG(v: Scope): void {
    const fG = this.fB.group({
      code: [
        v.code || "",
        this.settings.showTokenField && Validators.required,
      ],
      name: [
        v.name || "",
        this.settings.showNameField && Validators.required,
      ],
      amount: [
        v.amount || 1,
        this.settings.showAmountField && Validators.required,
      ],
      health_condition: [
        v.health_condition || "average",
        this.settings.showHealthConditionField && Validators.required,
      ],
      observation: [
        v.observation || '',
        this.settings.showObservationField && Validators.required,
      ],
    });
    this.fScope.push(fG);
  }

  addSubLine() {
    this.addFG(this.scopeCurrent);
    /*     this.fScope.value.forEach((v: any, index: number) => {
          const found = this.fGscope.value.scope.some((s: Scope) => {
            return v.code === s.code;
          });
          if (!found) this.fScope.removeAt(index);
        }); */
  }

  removeSubLine(index: number) {
    this.fScope.removeAt(index);
  }
}
