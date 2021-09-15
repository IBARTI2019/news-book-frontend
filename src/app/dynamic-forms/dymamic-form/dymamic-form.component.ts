import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from '../classes';
import { ControlService } from '../services/control.service';

@Component({
  selector: 'app-dymamic-form',
  templateUrl: './dymamic-form.component.html',
  styleUrls: ['./dymamic-form.component.css'],
  providers: [ControlService]
})
export class DynamicFormComponent implements OnInit {

  @Input() questions: QuestionBase<string>[] | null = [];
  @Input() withSaved: boolean = true;
  form!: FormGroup;
  payLoad = '';

  constructor(private qcs: ControlService) {
  }

  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.questions as QuestionBase<string>[]);
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.getRawValue());
  }
}