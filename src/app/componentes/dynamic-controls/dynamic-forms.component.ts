import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionBase } from '../../dynamic-forms/classes';

@Component({
  selector: 'app-dynamic-forms',
  templateUrl: './dynamic-forms.component.html',
  styleUrls: ['./dynamic-forms.component.css'],
})
export class DynamicControlsComponent implements OnInit {
  @Input() question!: QuestionBase;
  @Input() form!: FormGroup;

  ngOnInit() {
  }

  get isValid() {
    return this.form.controls[this.question.key].valid;
  }

}
