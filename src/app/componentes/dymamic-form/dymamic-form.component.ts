import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { New } from "app/interfaces";

import { QuestionBase } from "../../dynamic-forms/classes";
import { ControlService } from "../../dynamic-forms/services/control.service";

@Component({
  selector: "app-dymamic-form",
  templateUrl: "./dymamic-form.component.html",
  styleUrls: ["./dymamic-form.component.css"],
  providers: [ControlService],
})
export class DynamicFormComponent implements OnInit, OnChanges {
  @Input() questions: QuestionBase[] | null = [];
  @Input() new!: New;
  @Input() client!: any;
  @Input() withSaved: boolean = true;
  @Input() readOnly: boolean = false;
  @Input() info: any = null;
  @Output()
  onSaveChange = new EventEmitter();
  form!: FormGroup;
  payLoad = "";
  submitted = false;
  constructor(private qcs: ControlService) { }

  ngOnChanges(change: SimpleChanges): void {
    if (change.questions) {
      this.questions = change.questions.currentValue;
      if (this.info) {
        this.questions?.forEach((q: QuestionBase) => {
          q.setValue(this.info[q.getKey()]);
        });
      }
      this.form = this.qcs.toFormGroup(this.questions as QuestionBase[]);
    }
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.payLoad = this.form.getRawValue();
    this.onSaveChange.emit(this.payLoad);
  }
}
