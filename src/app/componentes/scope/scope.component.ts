import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Scope, ScopeSettings } from 'app/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { CreateAndEditMaterialComponent } from 'app/modules/maestro/materials/create-and-edit-material/create-and-edit-material.component';
import { Person } from 'app/interfaces';
import { IbartiService } from 'app/services/ibarti.service';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


const HEALTH_CONDITIONS = [
  {
    id: "good",
    text: "Buena",
  },
  {
    id: "average",
    text: "Regular",
  },
  {
    id: "bad",
    text: "Mala",
  },
  {
    id: "not_in_service",
    text: "No se encuentra en el servicio",
  },
];

const SCOPE_ARR_DEAFAULT: Scope[] = [];

export const SCOPE_LIST_DEFAULT: ScopeSettings = {
  percentage: 100,
  showItemField: true,
  showTokenField: true,
  showNameField: true,
  showHealthConditionField: true,
  showObservationField: true,
  showAmountField: true,
};

@Component({
  selector: 'app-scope',
  templateUrl: './scope.component.html',
  styleUrls: ['./scope.component.css']
})
export class ScopeComponent implements OnInit, OnChanges {

  public MultiFilterCtrl: FormControl = new FormControl();

  protected _onDestroy = new Subject<void>();
  public filteredMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(
    1
  );

  @Input() id: string = '';
  @Input() value: any = null;
  @Input() settings: ScopeSettings = SCOPE_LIST_DEFAULT;
  @Input() scopeArrSelected: Scope[] = [];
  @Input() personsArr: Person[] = [];
  @Input() scopeArr: Scope[] = SCOPE_ARR_DEAFAULT;
  @Input() fGRoot!: FormGroup;
  @Input() readOnly: boolean = false;
  fPerson!: FormGroup;
  @Output() isValid: EventEmitter<boolean> = new EventEmitter<boolean>();

     
  fScope: FormArray = new FormArray([]);
  healthConditions = [...HEALTH_CONDITIONS];
  fGscope = new FormGroup({});
  defaultValues = { ...SCOPE_LIST_DEFAULT }
  scopeCurrent: any = { amount: 0 };
  router: any;
  listFilter: Scope[] | undefined = [];

  constructor(private fB: FormBuilder,public dialog: MatDialog, private ibartiService: IbartiService) { }

  ngOnInit(): void {
    
    if (this.fGRoot && this.id && this.fGRoot.get(this.id)) {
      this.fScope = this.fGRoot.get(this.id) as FormArray;
    }

    this.fScope.statusChanges.subscribe((currentStatus) => {
      this.isValid.emit(currentStatus === "VALID" ? true : false);
    });

    this.scopeArrSelected.forEach((v) => {
      this.addFG(v);
    });

    this.fGscope = this.fB.group({
      scope: [this.scopeArrSelected.map((v) => v)],
    });

    this.fGscope.valueChanges.subscribe((values) => {
      this.scopeCurrent = values.scope;
    });
  }

  ngOnChanges(change: SimpleChanges): void {
    if(this.scopeArr)
      this.listFilter = [... this.scopeArr];

    if (change.settings && change.settings.firstChange) {
      this.settings = change.settings.currentValue || {
        ...SCOPE_LIST_DEFAULT,
      }
    } else if (change.settings && !change.settings.currentValue) {
      this.settings = {
        ...SCOPE_LIST_DEFAULT,
      }
    }

    this.MultiFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      //this.filterBanksMulti();
      let search = this.MultiFilterCtrl.value;
      if (search) {
        let a = this.searchFilter(search);
        this.listFilter = a;
      } else {
        this.listFilter = [...this.scopeArr];
      }

    });
  }

  addFG(v: Scope): void {
    const fG = this.fB.group({
      item: [
        v.item || ""
      ],
      code: [
        v.code || "",
        this.settings.showTokenField && Validators.required,
      ],
      name: [
        v.name || "",
        this.settings.showNameField && Validators.required,
      ],
      amount: [
        v.amount,
        this.settings.showAmountField && Validators.required,
      ],
      health_condition: [
        v.health_condition || "average",
        this.settings.showHealthConditionField && Validators.required,
      ],
      observation: [
        v.observation || '',
        this.settings.showObservationField && Validators.required,
      ],
    });
    this.fScope.push(fG);
  }

  addSubLine() {
    this.addFG(this.scopeCurrent);
    /*     this.fScope.value.forEach((v: any, index: number) => {
          const found = this.fGscope.value.scope.some((s: Scope) => {
            return v.code === s.code;
          });
          if (!found) this.fScope.removeAt(index);
        }); */
  }

  removeSubLine(index: number) {
    this.fScope.removeAt(index);
  }
  getPerson(identification_number: string) {
    let index = this.personsArr.findIndex(v => v.identification_number == identification_number);
    if (index > -1) {
      this.fPerson.get("full_name")!.setValue(this.personsArr[index].full_name);
    }
  }
  
  getmaterial(cod_material: string) {
    console.log(cod_material)
    let index = this.scopeArr.findIndex(z => z.code == cod_material);
    if (index > -1) {
      this.fScope.get("descripcion")!.setValue(this.scopeArr[index].description);
    } else {
      this.fScope.get("descripcion")!.setValue('');
    }
  }
  
  

  createMaterial() {
    const dialogRef = this.dialog.open(CreateAndEditMaterialComponent, {
      data: {
        modal: true
      },
    });
    dialogRef.afterClosed().subscribe(result => {
    
      if (result?.code) {
        result['name'] = result.description;
        this.scopeArr.push(result);
        this.listFilter=this.scopeArr;
      }
    });
    
  }

  searchFilter(search: string) { //Funcion de filtro de buscador
    if (search) {
      if (search.length > 2) {
        const results = this.scopeArr.filter(element => {
         
          const regex = new RegExp(search, "gi");
          const comparison = regex.test(element.name)
         // const comparison1 = regex.test(element.name_and_surname)
        
          if (comparison) {
           
            return element;
          }
        });
        return results;
      } else {
        return this.scopeArr;
      }
    }

  }
}
