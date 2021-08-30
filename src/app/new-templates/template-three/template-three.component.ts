import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSelectionList } from "@angular/material/list";
import { ActivatedRoute, Router } from "@angular/router";
import { Material, TemplateThreeMaterials } from "app/interfaces";
import { MaterialsService } from "app/services/materials.service";
import { TemplateNew, TemplatesNew } from "environments/environment";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-template-three",
  templateUrl: "./template-three.component.html",
  styleUrls: ["./template-three.component.css"],
})
export class TemplateThreeComponent implements OnInit {
  @Output() tSubmit = new EventEmitter<TemplateThreeMaterials>();
  @Input() method: string = "view";
  @Input() name: string = "";
  @Input() operation: string = "";
  @Input() data: TemplateThreeMaterials = {
    id: "",
    message: "",
    materials: [],
  };
  @ViewChild("selectionList") filteredItems!: MatSelectionList;
  fg: FormGroup;
  submitted = false;
  id: string = "";
  update: boolean = false;
  selectedMaterials: Material[] = [];
  materialToSearch: string = "";
  filterMaterialsDataSet: Array<{ description: string }>;
  filteredLength = 0;
  currentTemplate: TemplateNew = {
    name: "",
    url: "",
    id: "",
    operation: "",
  };
  storageData = {
    message: "",
    materials: [],
  };
  view = true;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private materialService: MaterialsService
  ) {
    this.fg = this.fb.group({});
    this.filterMaterialsDataSet = [
      {
        description: "6063 WGH",
      },
      {
        description: "7101 SYR",
      },
      {
        description: "2974 UKH",
      },
      {
        description: "2369 QUT",
      },
      {
        description: "8098 JSC",
      },
      {
        description: "7390 NOL",
      },
      {
        description: "6810 TYJ",
      },
      {
        description: "1847 CES",
      },
      {
        description: "4308 SWR",
      },
      {
        description: "6747 VOB",
      },
    ];
  }

  ngOnInit(): void {
    this.setMethods();
    this.currentTemplate = TemplatesNew.filter(
      (currentT) => currentT.name === this.name
    )[0];
    this.storageData = this.currentTemplate.id
      ? this.getLocalStorage(this.currentTemplate.id)
      : null;
    this.fg = this.fb.group(
      {
        message: [
          this.data.message || this.storageData?.message || null,
          this.view ? Validators.nullValidator : Validators.required,
        ],
      },
      {}
    );
    if (!this.view) {
      this.selectedMaterials = this.storageData?.materials || [];
      this.id = this.route.snapshot.params.id;
      this.materialService.list(this.id).subscribe((data: Material[]) => {
        this.filterMaterialsDataSet = data.map((currentVehicle) => ({
          id: currentVehicle.id,
          description: currentVehicle.description || "",
        }));
      });
      if (this.id) {
        this.update = true;
      }
    }
  }

  private getLocalStorage(fieldName: string) {
    if (fieldName) {
      const data = localStorage.getItem(fieldName);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  private setLocalStorage(fieldName: string, value: any) {
    if (fieldName) localStorage.setItem(fieldName, JSON.stringify(value));
  }

  private deleteStorageItem(fieldName: string) {
    if (fieldName) localStorage.removeItem(fieldName);
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
    this.selectedMaterials = [];
    this.materialToSearch = "";
  }

  select(material: Material) {
    if (!this.selectedMaterials.includes(material)) {
      this.selectedMaterials.unshift(material);
    }
  }

  deselect(position: number) {
    this.selectedMaterials.splice(position, 1);
  }

  saveAndRediret() {
    this.setLocalStorage(this.currentTemplate.id, {
      ...this.fg.value,
      materials: [...this.selectedMaterials],
    });
    this.router.navigateByUrl("/materials/crear", {
      state: { redirectTo: this.router.url },
    });
  }
}
