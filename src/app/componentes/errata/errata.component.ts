import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ErrataSettings } from '../../interfaces';

export const ERRATA_DEFAULT: ErrataSettings = {
  percentage: 100
};

@Component({
  selector: 'app-errata',
  templateUrl: './errata.component.html',
  styleUrls: ['./errata.component.css']
})
export class ErrataComponent implements OnInit {

  @Input() id: string = '';
  @Input() fGRoot!: FormGroup;
  @Input() settings: ErrataSettings = ERRATA_DEFAULT;
  @Input() readOnly: boolean = false;
  @Output() onEditedChange = new EventEmitter();
  fErrata?: FormGroup;
  defaultValues = { ...ERRATA_DEFAULT };
  
  constructor() { }

  ngOnInit(): void {
    if (this.fGRoot && this.id && this.fGRoot.get(this.id)) {
      this.fErrata = this.fGRoot.get(this.id) as FormGroup;
    }
  }

  onEdited() {
    this.fErrata?.controls['edited'].setValue(true);
    this.onEditedChange.emit();
  }

}
