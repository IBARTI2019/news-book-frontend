import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSelect } from "@angular/material/select";
import {
  PlannedStaff,
  Staff,
  StaffReceivingTheGuardSettings,
} from "app/interfaces";
import { ReplaySubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

const HEALTH_CONDITIONS = [
  {
    id: "good",
    text: "Buena",
  },
  /*   {
      id: "average",
      text: "Regular",
    }, */
  {
    id: "bad",
    text: "Mala",
  },
];

const STAFF_ARR_DEAFAULT: PlannedStaff[] = [
  {
    cod_ficha: "1234567890",
    name_and_surname: "Hemny Sibrian",
    identification_card: "4354554354",
  },
  {
    cod_ficha: "0987654321",
    name_and_surname: "Alejandro Fabrega",
    identification_card: "3454353454",
  },
  {
    cod_ficha: "4321567890",
    name_and_surname: "Yonathan Aviles",
    identification_card: "4565465465",
  },
  {
    cod_ficha: "1567890234",
    name_and_surname: "Eliezer García",
    identification_card: "879767868",
  },
];

export const CHANGING_GUARD_STAFF_LIST_DEFAULT: StaffReceivingTheGuardSettings = {
  testing: false,
  guardStatus: "REGULAR",
  percentage: 100,
  showTokenField: true,
  showNameField: true,
  showProtocolField: true,
  showHealthConditionField: true,
  showCheckInField: true,
  showGuardStatusField: true,
  showCheckOutField: false
};

@Component({
  selector: "app-changing-guard-staff-list",
  templateUrl: "./changing-guard-staff-list.component.html",
  styleUrls: ["./changing-guard-staff-list.component.css"],
})
export class ChangingGuardStaffListComponent implements OnInit, OnChanges {
  //@ViewChild("staffRef") staffRef!: MatSelect;
  @ViewChild('staffRef', { static: true }) staffRef!: MatSelect;

  public MultiFilterCtrl: FormControl = new FormControl();

  protected _onDestroy = new Subject<void>();
  public filteredMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(
    1
  );



  @Input() id: string = '';
  @Input() value: any = null;
  @Input() settings: StaffReceivingTheGuardSettings = CHANGING_GUARD_STAFF_LIST_DEFAULT;
  @Input() staffArrSelected: Staff[] = [];
  @Input() staffArr: PlannedStaff[] = [];
  @Input() fGRoot!: FormGroup;
  @Input() readOnly: boolean = false;

  @Output() isValid: EventEmitter<boolean> = new EventEmitter<boolean>();

  fA: FormArray = new FormArray([]);
  healthConditions = [...HEALTH_CONDITIONS];
  fGStaff = new FormGroup({});
  defaultValues = { ...CHANGING_GUARD_STAFF_LIST_DEFAULT }
  listFilter: PlannedStaff[] | undefined = [];

  constructor(private fB: FormBuilder) { }

  ngOnInit(): void {


    if (this.fGRoot && this.id && this.fGRoot.get(this.id)) {
      this.fA = this.fGRoot.get(this.id) as FormArray;
    }

    this.fA.statusChanges.subscribe((currentStatus) => {
      this.isValid.emit(currentStatus === "VALID" ? true : false);
    });

    this.staffArrSelected.forEach((v) => {
      this.addFG(v);
    });

    this.fGStaff = this.fB.group({
      staff: [this.staffArrSelected.map((v) => v)],
    });

    this.fGStaff.valueChanges.subscribe((values) => {
      values.staff.forEach((s: Staff) => {
        let found = null;
        if (this.fA.value) {
          found = this.fA.value.some((v: any) => {
            return v.cod_ficha === s.cod_ficha;
          });
        }
        if (!found) this.addFG(s);
      });
      this.fA.value.forEach((v: any, index: number) => {
        const found = values.staff.some((s: Staff) => {
          return v.cod_ficha === s.cod_ficha;
        });
        if (!found) this.fA.removeAt(index);
      });
    });
  }

  ngOnChanges(change: SimpleChanges): void {
    //this.filteredMulti.next(this.staffArr.slice());
    if(this.staffArr)
      this.listFilter = [...this.staffArr];



    if (change.settings && change.settings.firstChange) {
      this.settings = change.settings.currentValue || {
        ...CHANGING_GUARD_STAFF_LIST_DEFAULT,
      }
    } else if (change.settings && !change.settings.currentValue) {
      this.settings = {
        ...CHANGING_GUARD_STAFF_LIST_DEFAULT,
      }
    }

    if (change.settings?.currentValue?.testing) {
      this.staffArr = STAFF_ARR_DEAFAULT;
    }

    this.MultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        //this.filterBanksMulti();
        let search = this.MultiFilterCtrl.value;
        if(search){
          let a =  this.searchFilter(search);
          this.listFilter = a;
        }else{
          this.listFilter = [...this.staffArr];
        }

      });


    // console.log('StaffArr',this.staffArr);
  }

  addFG(v: Staff): void {
    const fG = this.fB.group({
      cod_ficha: [
        v.cod_ficha || "",
        this.settings.showTokenField && Validators.required,
      ],
      name_and_surname: [
        v.name_and_surname || "",
        this.settings.showNameField && Validators.required,
      ],
      protocol: [
        v.protocol || false,
        this.settings.showProtocolField && Validators.required,
      ],
      health_condition: [
        v.health_condition || "average",
        this.settings.showHealthConditionField && Validators.required,
      ],
      check_in: [
        v.check_in || "",
        this.settings.showCheckInField && Validators.required,
      ],
      guard_status: [
        v.guard_status || this.settings.guardStatus,
        Validators.required,
      ],
      check_out: [
        v.check_out || "",
        this.settings.showCheckOutField && Validators.required,
      ],
    });
    this.fA.push(fG);
  }
  searchFilter(search: string) {
    if (search) {
     // console.log(search) 

     // console.log(this.staffArr) 
     if (search.length > 2) {
      const results = this.staffArr.filter(element => {

      
         // console.log(element) 

         const regex = new RegExp(search, "gi");
          const comparison = regex.test(element.cod_ficha)
         // console.log('comparison',comparison) 

 
          if (comparison) {


            return element;
          }
          //return element;

       


      });
      return results;
    }else{
      return this.staffArr;
    }

     // console.log('results',results) 


      


    }

  }
}
