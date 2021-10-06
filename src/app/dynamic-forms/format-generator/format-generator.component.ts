import { Component, Inject, OnInit } from '@angular/core';
import { TypeNewService } from '../../services/type-new.service';
import { Observable } from 'rxjs';
import { TemplateData, TemplateTypeNew, TypeNew } from '../../interfaces';
import { QuestionBase } from '../classes';
import { QuestionService } from '../services/question.service';
import { CdkDragDrop, moveItemInArray, copyArrayItem } from '@angular/cdk/drag-drop';
import { ControlService } from '../services/control.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-overview-example-dialog',
  template: `<h1 mat-dialog-title>{{data.element?.code_display}}</h1>
<div mat-dialog-content>
    <mat-form-field>
      <mat-label>Porcentaje en fila</mat-label>
      <input matInput tabindex="1" [(ngModel)]="data.element.percentage_per_row">
    </mat-form-field>
    <mat-form-field>
      <mat-label>Valor por defecto</mat-label>
      <input matInput tabindex="1" [(ngModel)]="data.element.value">
    </mat-form-field>
    <mat-form-field>
      <mat-label>Etiqueta</mat-label>
      <input matInput tabindex="1" [(ngModel)]="data.element.label">
  </mat-form-field>
</div>
{{data | json}}
<div mat-dialog-actions>
  <button mat-button [mat-dialog-close]="data" tabindex="2">Ok</button>
  <button mat-button (click)="onNoClick()" tabindex="-1">Cancelar</button>
</div>`
})

export class ParamsControlDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ParamsControlDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-format-generator',
  templateUrl: './format-generator.component.html',
  styleUrls: ['./format-generator.component.css'],
  providers: [QuestionService, ControlService]
})
export class FormatGeneratorComponent implements OnInit {
  datos: TemplateData[] = [];
  questions$: Observable<QuestionBase[]>;
  generating_preview: boolean = false;
  typeNews: TypeNew[] = [];
  typeNew: TypeNew = { id: "", template: [] };

  constructor(private typeNewService: TypeNewService, private service: QuestionService, public dialog: MatDialog, private toastr: ToastrService) {
    this.questions$ = this.service.generatePreviewQuentions(this.typeNew.template);
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
        this.datos.push(
          {
            "code": d[0],
            "code_display": d[1],
            "percentage_per_row": 100
          }
        );
      })
    });
  }

  openDialog(element: TemplateTypeNew, index: number): void {
    const dialogRef = this.dialog.open(ParamsControlDialogComponent, {
      width: '300px',
      data: { element, index: index }
    });

    dialogRef.afterClosed().subscribe((result: { element: TemplateTypeNew, index: number }) => {
      console.log(result)
      if (result) {
        this.typeNew.template[index] = { ...result.element };
        this.generatePreview();
      }
    });
  }

  deleteControl(element: TemplateTypeNew, index: number) {
    this.typeNew.template.splice(index, 1);
  }

  generatePreview() {
    this.generating_preview = true
    this.questions$ = this.service.generatePreviewQuentions(this.typeNew.template);
    this.generating_preview = false
  }

  drop(event: CdkDragDrop<TemplateData[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      copyArrayItem(event.previousContainer.data, this.typeNew.template, event.previousIndex, event.currentIndex);
      this.typeNew.template[event.currentIndex] = { ...event.previousContainer.data[event.previousIndex] }
    }
    this.generatePreview();
  }

  async selectionTypeChange(event: any) {
    this.typeNew = await this.typeNewService.get(event.value).toPromise();
    if (typeof this.typeNew.template !== 'object') {
      this.typeNew.template = []
    }
    this.generatePreview();
  }

  saveTemplate() {
    this.typeNewService.update_patch(this.typeNew.id, { template: this.typeNew.template }).subscribe(data => {
      this.toastr.success("Plantilla guardada exitosamente");
    }, (error: HttpErrorResponse) => {
      this.toastr.error(
        error.error.message || "Error guardando la plantilla."
      );
    });
  };

}
