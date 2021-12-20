import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Round, RoundSettings } from "../../interfaces";

export const ROUNDS_LIST_DEFAULT: RoundSettings = {
  percentage: 100,
  showNumberField: true,
  showHourStartField: true,
  showHourEndField: true,
  showObservationField: true,
  showReasonField: true
};

@Component({
  selector: 'app-round',
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.css']
})
export class RoundComponent implements OnInit {
  @Input() id: string = '';
  @Input() value: any = null;
  @Input() settings: RoundSettings = ROUNDS_LIST_DEFAULT;
  @Input() RoundsArr: Round[] = [];
  @Input() fGRoot!: FormGroup;
  fRound!: FormGroup;
  @Input() readOnly: boolean = false;

  @Output() isValid: EventEmitter<boolean> = new EventEmitter<boolean>();

  defaultValues = { ...ROUNDS_LIST_DEFAULT }
  RoundsCurrent: Round = { number: "", hour_start: "", hour_end: "", observation: "", reason: "" };
  constructor(private toastr: ToastrService) { }

  ngOnInit(): void {

    if (this.fGRoot && this.id && this.fGRoot.get(this.id)) {
      this.fRound = this.fGRoot.get(this.id) as FormGroup;
    }
  }

  ngOnChanges(change: SimpleChanges): void {
    if (change.settings && change.settings.firstChange) {
      this.settings = change.settings.currentValue || {
        ...ROUNDS_LIST_DEFAULT,
      }
    } else if (change.settings && !change.settings.currentValue) {
      this.settings = {
        ...ROUNDS_LIST_DEFAULT,
      }
    }
  }
}