import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { FormGroup } from "@angular/forms";

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
  @Input() withSaved: boolean = true;
  form!: FormGroup;
  payLoad = "";

  constructor(private qcs: ControlService) {}

  ngOnChanges(change: SimpleChanges): void {
    if (change.questions) {
      this.questions = change.questions.currentValue;
      console.log(this.questions);
      this.form = this.qcs.toFormGroup(this.questions as QuestionBase[]);
    }
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.getRawValue());
  }
}
