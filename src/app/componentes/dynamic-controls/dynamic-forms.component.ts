import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionBase } from '../../dynamic-forms/classes';

@Component({
  selector: 'app-dynamic-forms',
  templateUrl: './dynamic-forms.component.html',
  styleUrls: ['./dynamic-forms.component.css'],
})
export class DynamicControlsComponent {
  @Input() question!: QuestionBase<string>;
  @Input() form!: FormGroup;
  get isValid() { return this.form.controls[this.question.key].valid; }

}
