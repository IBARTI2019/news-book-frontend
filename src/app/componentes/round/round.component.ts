import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, } from '@angular/core';
import { FormArray, FormBuilder,FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Round, RoundSettings } from "../../interfaces";
import { DTColumn } from '../generic-table/interface';
import { GenericTableComponent } from '../generic-table/generic-table.component';

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
  @Input() RoundArrSelected:  Round[] = [];
  @Input() fGRoot!: FormGroup;
  @Input() pos: number = 0;
  fR: FormArray = new FormArray([]);
  fRound!: FormGroup;
  
  @Input() readOnly: boolean = false;
  columnsR: DTColumn[] = [];
  @Output() isValid: EventEmitter<boolean> = new EventEmitter<boolean>();

  defaultValues = { ...ROUNDS_LIST_DEFAULT }
  RoundsCurrent: Round = { number: "", hour_start: "", hour_end: "", observation: ""};
  @ViewChild("tableRonda") table!: GenericTableComponent;
 
  constructor(private toastr: ToastrService,private fB: FormBuilder) { }
  ngAfterViewChecked(): void {
    console.log('Policia'+ this.fR.controls.length)
    if (this.fR.controls.length>0) {
      this.table.refresh({}, this.fR.controls);
            
    }
  }
  ngOnInit(): void {
    this.columnsR = [];
    if(this.settings.showNumberField)
      this.columnsR.push(
        {
          attribute:"number",
          header: "Nro de la ronda",
          template: "idronda" 
        },
      );
    if(this.settings.showHourStartField)
      this.columnsR.push({
          attribute: "hour_start",
          header:" Hora de inicio",
          template: "idhorainicio"
        });
    if(this.settings.showHourEndField)
      this.columnsR.push({
        attribute:"hour_end",
        header: "Hora de finalización",
        template: "idhorafinal"
      },);
    if(this.settings.showObservationField)
      this.columnsR.push({
        attribute:"observation",
        header: "Observación del estatus perimetral",
        template: "idperimetro"
      });
    if(!this.readOnly)
      this.columnsR.push({
        attribute: "id",
        header: "",
        template: "opciones"
      });
      if (this.fGRoot && this.id && this.fGRoot.get(this.id)) {
        this.fRound= this.fGRoot.get(this.id) as FormGroup;
      }
      if (this.fGRoot && this.id && this.fGRoot.get(this.id)) {
        this.fR = this.fGRoot.get(this.id) as FormArray;
      }
      this.fR.statusChanges.subscribe((currentStatus) => {
        this.isValid.emit(currentStatus === "VALID" ? true : false);
      });
  
      this.RoundArrSelected.forEach((v) => {
        
        this.addFG(v);
      });
  
      this.fRound= this.fB.group({
        round: [this.RoundArrSelected.map((v) => v)],
      });
  
      this.fRound.valueChanges.subscribe((values) => {
        this.RoundsCurrent = values.round;
        
      });
     
  }
  addFG(v: Round): void {
    const fG = this.fB.group({
      number: [
        v.number || "",
        this.settings.showNumberField && Validators.required,
      ],
      hour_start: [
        v.hour_start || '',
        this.settings.showHourStartField && Validators.required,
      ],
      hour_end: [
        v.hour_end || '',
        this.settings.showHourEndField && Validators.required,
      ],
      observation: [
        v.observation || "",
        this.settings.showObservationField && Validators.required,
      ],
      
    });
    this.fR.push(fG);
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
  addSubLine() {
    
    this.addFG(this.RoundsCurrent);
    /*     this.fScope.value.forEach((v: any, index: number) => {
          const found = this.fGscope.value.scope.some((s: Scope) => {
            return v.code === s.code;
          });
          if (!found) this.fScope.removeAt(index);
        }); */
  }
  removeremoveRound(serial: number) {
    let exist = false;
    console.log(`OJo${serial}`)
    for (var index = 0; index < this.fR.controls.length; index++) {
      let serialaux = this.fR.controls[index].value.number;
      if (serial===serialaux) {
         this.pos =index;
      }
    }
   
    this.fR.removeAt(this.pos);
    
  }
}