import {
  AfterViewChecked,
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
import { TemplateTwoVehicle, Vehicle } from "app/interfaces";
import { VehicleService } from "app/services/vehicle.service";
import { TemplateNew, TemplatesNew } from "environments/environment";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-template-two",
  templateUrl: "./template-two.component.html",
  styleUrls: ["./template-two.component.css"],
})
export class TemplateTwoComponent implements OnInit, AfterViewChecked {
  @Output() tSubmit = new EventEmitter<TemplateTwoVehicle>();
  @Input() method: string = "view";
  @Input() name: string = "";
  @Input() operation: string = "";
  @Input() data: TemplateTwoVehicle = {
    id: "",
    message: "",
    vehicles: [],
  };
  @ViewChild("selectionList") filteredItems!: MatSelectionList;
  fg: FormGroup;
  submitted = false;
  id: string = "";
  update: boolean = false;
  selectedPlates: string[];
  plateToSearch: string = "";
  filterPlatesDataSet: Array<{ plate: string }>;
  filteredLength = 0;
  currentTemplate: TemplateNew = {
    name: "",
    url: "",
    id: "",
    operation: "",
  };
  storageData = {
    message: "",
    vehicles: [],
  };
  view = true;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private vehicleService: VehicleService
  ) {
    this.fg = this.fb.group({});
    this.selectedPlates = ["6063 WGH", "7101 SYR", "2974 UKH"];
    this.filterPlatesDataSet = [
      {
        plate: "6063 WGH",
      },
      {
        plate: "7101 SYR",
      },
      {
        plate: "2974 UKH",
      },
      {
        plate: "2369 QUT",
      },
      {
        plate: "8098 JSC",
      },
      {
        plate: "7390 NOL",
      },
      {
        plate: "6810 TYJ",
      },
      {
        plate: "1847 CES",
      },
      {
        plate: "4308 SWR",
      },
      {
        plate: "6747 VOB",
      },
    ];
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.currentTemplate = TemplatesNew.filter(
      (currentT) => currentT.name === this.name
    )[0];
    console.log("Current Template: ", this.currentTemplate);
    this.storageData = this.currentTemplate.id
      ? this.getLocalStorage(this.currentTemplate.id)
      : null;
    this.selectedPlates = this.storageData?.vehicles || [];
    this.setMethods();

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
      this.vehicleService.list(this.id).subscribe((data: Vehicle[]) => {
        this.filterPlatesDataSet = data.map((currentVehicle) => ({
          plate: currentVehicle.license_plate || "",
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
      vehicles: [...this.selectedPlates],
    });
    this.submitted = false;
  }

  onReset() {
    this.submitted = false;
    this.fg.reset();
    this.deleteStorageItem(this.currentTemplate.id);
    this.selectedPlates = [];
    this.plateToSearch = "";
  }

  select(plate: string) {
    if (!this.selectedPlates.includes(plate)) {
      this.selectedPlates.unshift(plate);
    }
  }

  deselect(position: number) {
    this.selectedPlates.splice(position, 1);
  }

  saveAndRediret() {
    this.setLocalStorage(this.currentTemplate.id, {
      ...this.fg.value,
      vehicles: [...this.selectedPlates],
    });
    this.router.navigateByUrl("/vehicle/crear", {
      state: { redirectTo: this.router.url },
    });
  }
}
