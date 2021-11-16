import { QuestionBaseParams, StaffReceivingTheGuardSettings } from "app/interfaces";

export class QuestionBase {
  value?: any;
  code?: string;
  key: string;
  label: string;
  required: boolean;
  order: number;
  controlType: string;
  type: string;
  options: { key: string; value: string }[];
  fichas?: {
    cod_ficha: string;
    identification_card?: string;
    name_and_surname?: string;
  }[];
  applies_security_protocol?: boolean;
  form_field: boolean | undefined = true;
  percentage_per_row: number;

  constructor(
    options: QuestionBaseParams = {},
    public service: any
  ) {
    this.key = options.key || "";
    this.code = options.code || "";
    this.label = options.label || "";
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || "";
    this.type = options.type || "";
    this.form_field = options.form_field === false ? false : true;
    this.options = options.options || [];
    this.value = options.value || '';
    this.percentage_per_row = options.percentage_per_row || 100;
    if (
      options.code === "staffReceivingTheGuard" ||
      options.code === "PLANNED_STAFF" ||
      options.code === "PLANNED_PERSONNEL_WITH_SAFETY_PROTOCOL"
    ) {
      this.service.planned_staff().subscribe((data: any) => {
        this.fichas = data;
      });
    } else if (options.code === "POINT") {
      this.service.list({ not_paginator: true }).subscribe((data: any) => {
        this.options = data;
      });
    } else if (options.code === "SUB_LINE") {
      this.service.sub_line_scope().subscribe((data: any) => {
        this.options = data;
      });
    } else if (options.code === "OESVICA_STAFF") {
      this.service.oesvica_staff().subscribe((data: any) => {
        this.fichas = data;
      });
    } else {
      this.fichas = options.fichas || [];
    }
  }

  public setValue(value: any): void {
    this.value = value;
  }

  public getKey(): string {
    return this.key;
  }
}

export class Title extends QuestionBase {
  controlType = "title";
}

export class DropdownQuestion extends QuestionBase {
  controlType = "dropdown";
}

export class TextboxQuestion extends QuestionBase {
  controlType = "textbox";
}

export class SystemDate extends QuestionBase {
  controlType = "date";
}

export class SystemHour extends QuestionBase {
  controlType = "hour";
}

export class BookScope extends QuestionBase {
  controlType = "scope";
}

export class Point extends QuestionBase {
  controlType = "point";
}

export class Amount extends QuestionBase {
  controlType = "amount";
}

export class StaffReceivingTheGuard extends QuestionBase {
  controlType = "staffReceivingTheGuard";
  settings?: StaffReceivingTheGuardSettings = {
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

  constructor(options: QuestionBaseParams, public service: any) {
    super(options, service)
    this.settings = options.settings
  }
}

export class StaffOesvica extends QuestionBase {
  controlType = "staffReceivingTheGuard";
  settings?: StaffReceivingTheGuardSettings = {
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

  constructor(options: QuestionBaseParams, public service: any) {
    super(options, service)
    this.settings = options.settings
  }
}
