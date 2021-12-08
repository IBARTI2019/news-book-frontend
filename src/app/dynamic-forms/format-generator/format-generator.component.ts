import { Component, Inject, OnInit } from "@angular/core";
import { TypeNewService } from "../../services/type-new.service";
import { Observable } from "rxjs";
import { TemplateData, TemplateTypeNew, TypeNew } from "../../interfaces";
import { QuestionBase } from "../classes";
import { QuestionService } from "../services/question.service";
import {
  CdkDragDrop,
  moveItemInArray,
  copyArrayItem,
} from "@angular/cdk/drag-drop";
import { ControlService } from "../services/control.service";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { HttpErrorResponse } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-dialog-overview-example-dialog",
  templateUrl: "./modal-options.component.html",
})
export class ParamsControlDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ParamsControlDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.data.element.code === 'SELECTION' && !this.data.element.options) {
      this.data.element.options = [];
    }
  }

  selection_current: string = "";

  addSelection() {
    this.data.element.options.push({ key: this.selection_current, value: this.selection_current });
    this.selection_current = "";
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: "app-format-generator",
  templateUrl: "./format-generator.component.html",
  styleUrls: ["./format-generator.component.css"],
  providers: [QuestionService, ControlService],
})
export class FormatGeneratorComponent implements OnInit {
  datos: TemplateData[] = [];
  questions$: Observable<QuestionBase[]>;
  generating_preview: boolean = false;
  typeNews: TypeNew[] = [];
  typeNew: TypeNew = { id: "", template: [] };

  constructor(
    private typeNewService: TypeNewService,
    private service: QuestionService,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {
    this.questions$ = this.service.generatePreviewQuentions(
      this.typeNew.template
    );
  }

  ngOnInit(): void {
    this.typeNewService.list().subscribe(
      (typeNewsResponse: TypeNew[]) => {
        this.typeNews = [...typeNewsResponse];
      },
      (error: HttpErrorResponse) => {
        this.toastr.error(
          error.error.message || "Error obteniendo los Tipos de Novedades."
        );
      }
    );
    this.typeNewService.getCodesTemplate().subscribe((data: any) => {
      data.forEach((d: string[], index: number) => {
        this.datos.push({
          code: d[0],
          code_display: d[1],
          percentage_per_row: 100,
          maximum_characters: 255
        });
      });
    });
  }

  openDialog(element: TemplateTypeNew, index: number): void {
    let _element = {};
    if (element.code === "PLANNED_STAFF" || element.code === "OESVICA_STAFF" || element.code === "FORMER_GUARD") {
      if (element.code === 'FORMER_GUARD') {
        _element = {
          ...element,
          settings: element.settings || {
            testing: false,
            guardStatus: "REGULAR",
            percentage: 100,
            showTokenField: true,
            showNameField: true,
            showProtocolField: true,
            showHealthConditionField: true,
            showCheckInField: false,
            showCheckOutField: true,
            showGuardStatusField: false,
          },
        }
      } else {
        _element = {
          ...element,
          settings: element.settings || {
            testing: false,
            guardStatus: "REGULAR",
            percentage: 100,
            showTokenField: true,
            showNameField: true,
            showProtocolField: true,
            showHealthConditionField: true,
            showCheckInField: true,
            showCheckOutField: false,
            showGuardStatusField: true,
          },
        }
      }
    } else {
      if (element.code === 'SUB_LINE') {
        _element = {
          ...element,
          settings: element.settings || {
            percentage: 100,
            showItemField: true,
            showTokenField: true,
            showNameField: true,
            showAmountField: true,
            showHealthConditionField: true,
            showObservationField: true
          }
        }
      } else {
        _element = element
      }
    }
    const dialogRef = this.dialog.open(ParamsControlDialogComponent, {
      width: element.code !== "PLANNED_STAFF" && element.code !== "OESVICA_STAFF" && element.code !== "SUB_LINE" && element.code !== "FORMER_GUARD" ? "300px" : "500px",
      data: {
        element: _element,
        index: index,
      },
    });

    dialogRef
      .afterClosed()
      .subscribe((result: { element: TemplateTypeNew; index: number }) => {
        if (result) {
          if (result.element.settings?.percentage) {
            result.element.percentage_per_row = result.element.settings.percentage
          }
          this.typeNew.template[index] = { ...result.element };
          this.generatePreview();
        }
      });
  }

  deleteControl(element: TemplateTypeNew, index: number) {
    this.typeNew.template.splice(index, 1);
    this.generatePreview();
  }

  generatePreview() {
    this.generating_preview = true;
    this.questions$ = this.service.generatePreviewQuentions(
      this.typeNew.template
    );
    this.generating_preview = false;
  }

  drop(event: CdkDragDrop<TemplateData[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      copyArrayItem(
        event.previousContainer.data,
        this.typeNew.template,
        event.previousIndex,
        event.currentIndex
      );
      this.typeNew.template[event.currentIndex] = {
        ...event.previousContainer.data[event.previousIndex],
      };
    }
    this.generatePreview();
  }

  async selectionTypeChange(event: any) {
    this.typeNew = await this.typeNewService.get(event.value).toPromise();
    if (typeof this.typeNew.template !== "object") {
      this.typeNew.template = [];
    }
    this.generatePreview();
  }

  saveTemplate() {
    this.typeNewService
      .update_patch(this.typeNew.id, { template: this.typeNew.template })
      .subscribe(
        (data) => {
          this.toastr.success("Plantilla guardada exitosamente");
        },
        (error: HttpErrorResponse) => {
          this.toastr.error(
            error.error.message || "Error guardando la plantilla."
          );
        }
      );
  }
}
