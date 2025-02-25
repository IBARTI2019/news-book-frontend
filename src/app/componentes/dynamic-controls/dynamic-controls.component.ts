import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { take } from 'rxjs/operators';
import { QuestionBase } from '../../dynamic-forms/classes';

@Component({
  selector: 'app-dynamic-controls',
  templateUrl: './dynamic-controls.component.html',
  styleUrls: ['./dynamic-controls.component.css'],
})
export class DynamicControlsComponent implements OnInit {
  @Input() question!: QuestionBase;
  @Input() form!: FormGroup;
  @Input() readOnly: boolean = false;
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  constructor(private _ngZone: NgZone) { }

  ngOnInit() { }

  get isValid() {
    return this.form.controls[this.question.key].valid;
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }
}
