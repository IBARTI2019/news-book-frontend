import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectionList } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { Material, TemplateThreeMaterials } from 'app/interfaces';
import { MaterialsService } from 'app/services/materials.service';
import { TemplateNew, TemplatesNew } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-template-three',
  templateUrl: './template-three.component.html',
  styleUrls: ['./template-three.component.css']
})
export class TemplateThreeComponent implements OnInit {
  @Output() tSubmit = new EventEmitter<TemplateThreeMaterials>();
  @Input() method: string = "view";
  @Input() name: string = "";
  @Input() operation: string = "";
  @Input() data: TemplateThreeMaterials = {
    id: "",
    notice: "",
    materiales: [],
  };
  @ViewChild("selectionList") filteredItems!: MatSelectionList;
  fg: FormGroup;
  submitted = false;
  id: string = "";
  update: boolean = false;
  selectedMaterials: string[];
  materialToSearch: string = "";
  filterMaterialsDataSet: Array<{ material: string }>;
  filteredLength = 0;
  currentTemplate: TemplateNew = {
    name: '',
    url: '',
    id: '',
    operation: '',
  }
  storageData = {
    notice: "",
    vehiculos: [],
  }
  view = true;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private materialService: MaterialsService,
  ) {
    this.fg = this.fb.group({});
    this.selectedMaterials = ["6063 WGH", "7101 SYR", "2974 UKH"];
    this.filterMaterialsDataSet = [
      {
        material: "6063 WGH",
      },
      {
        material: "7101 SYR",
      },
      {
        material: "2974 UKH",
      },
      {
        material: "2369 QUT",
      },
      {
        material: "8098 JSC",
      },
      {
        material: "7390 NOL",
      },
      {
        material: "6810 TYJ",
      },
      {
        material: "1847 CES",
      },
      {
        material: "4308 SWR",
      },
      {
        material: "6747 VOB",
      },
    ];
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.currentTemplate = TemplatesNew.filter((currentT) => currentT.name === this.name)[0]
    console.log('Current Template: ', this.currentTemplate)
    this.storageData = this.currentTemplate.id ? this.getLocalStorage(this.currentTemplate.id) : null
    this.selectedMaterials = this.storageData?.vehiculos || []
    this.setMethods();
    this.materialService.list(this.id).subscribe((data: Material[]) => {
      this.filterMaterialsDataSet = data.map((currentVehicle) => ({ material: currentVehicle.description || '' }))
    });
    this.fg = this.fb.group(
      {
        notice: [
          this.data.notice || this.storageData?.notice || null,
          this.view ? Validators.nullValidator : Validators.required,
        ],
      },
      {}
    );
    if (this.id) {
      this.update = true;
    }
  }

  private getLocalStorage(fieldName: string) {
    if (fieldName) {
      const data = localStorage.getItem(fieldName);
      return data ? JSON.parse(data) : null;
    }
    return null
  }

  private setLocalStorage(fieldName: string, value: any) {
    if (fieldName) localStorage.setItem(fieldName, JSON.stringify(value));
  }

  private deleteStorageItem(fieldName: string) {
    if (fieldName) localStorage.removeItem(fieldName)
  }

  ngAfterViewChecked(): void {
    this.filteredLength = this.filteredItems.options.length;
    this.cdRef.detectChanges();
  }

  setMethods(): void {
    switch (this.method) {
      case "update":
        this.view = false;
        this.update = true;
        break;
      case "create":
        this.view = false;
        this.update = false;
        break;
      default:
        this.view = true;
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.fg.invalid) {
      console.log("Invalid");
      this.submitted = false;
      return;
    }
    this.tSubmit.emit({
      ...this.fg.value,
      materiales: [...this.selectedMaterials],
    });
    this.submitted = false;
  }

  onReset() {
    this.submitted = false;
    this.fg.reset();
    this.deleteStorageItem(this.currentTemplate.id);
    this.selectedMaterials = []
    this.materialToSearch = ''
  }

  select(plate: string) {
    if (!this.selectedMaterials.includes(plate)) {
      this.selectedMaterials.unshift(plate);
    }
  }

  deselect(position: number) {
    this.selectedMaterials.splice(position, 1);
  }

  saveAndRediret() {
    this.setLocalStorage(this.currentTemplate.id, {
      ...this.fg.value,
      vehiculos: [...this.selectedMaterials],
    });
    this.router.navigateByUrl("/materials/crear", {
      state: { redirectTo: this.router.url },
    });
  }

}
