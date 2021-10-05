import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from '../../dynamic-forms/classes'
import { ControlService } from '../../dynamic-forms/services/control.service';

@Component({
  selector: 'app-dymamic-form',
  templateUrl: './dymamic-form.component.html',
  styleUrls: ['./dymamic-form.component.css'],
  providers: [ControlService]
})
export class DynamicFormComponent implements OnChanges {

  @Input() questions: QuestionBase<string>[] | null = [];
  @Input() withSaved: boolean = true;
  form!: FormGroup;
  payLoad = '';

  constructor(private qcs: ControlService) {
  }

  ngOnChanges(change: SimpleChanges): void {
    this.questions = change.questions.currentValue;
    this.form = this.qcs.toFormGroup(this.questions as QuestionBase<string>[]);
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.getRawValue());
  }
}