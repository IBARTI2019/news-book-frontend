import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { QuestionBase } from '../../../../dynamic-forms/classes';
import { QuestionService } from '../../../../dynamic-forms/services/question.service';
import { TemplateTypeNew, New } from '../../../../interfaces';
import { NewService } from '../../../../services/new.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { IbartiService } from 'app/services/ibarti.service';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-view-new',
  templateUrl: './view-new.component.html',
  styleUrls: ['./view-new.component.css'],
  providers: [QuestionService]
})
export class ViewNewComponent implements OnInit {

  id = "";
  controls$!: Observable<QuestionBase[]>;
  generating = true;
  _new: New = { id: "", employee: "" };
  client: any;
  submitted = false;
  loading = true;
  
  constructor(private newService: NewService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private serviceQuestion: QuestionService,
    private ibartiService: IbartiService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data?: New,
  ) {
  }

  ngOnInit(): void {
    // this.id = this.route.snapshot.params.id;
    this.id = this.data?.id || '';
    this.ibartiService.location_current().subscribe((client) => {
      this.client = client;
    });
    this.loading = true;
    this.newService.get(this.id).subscribe(
      (_new: New) => {
        this._new = _new;
        try {
          this._new.template = JSON.parse(this._new.template);
        } catch (e) {
          this._new.template = []
        }
        this.generateControls(this._new.template);
        this.loading = false;
      },
      (error: HttpErrorResponse) => {
        this.loading = false;
        this.toastr.error(
          error.error.message || "No se pudo obtener el tipo de novedad."
        );
      }
    );
  }

  generateControls(template: TemplateTypeNew[]) {
    this.generating = true
    this.controls$ = this.serviceQuestion.generatePreviewQuentions(template);
    this.generating = false
  }

  updateNew(data: any) {
    this.submitted = true
    try{
      this._new.template = JSON.parse(this._new.template);
    } catch { }

    this.newService.update_patch(this.id, { info: data, template: this._new.template}).subscribe(
      (data) => {
        this.toastr.success("La Novedad se actualizo correctamente.");
        this.router.navigate(["new", "view"]);
      },
      (error: HttpErrorResponse) => {
        this.toastr.error(
          error.error.message || "No se pudo actualizar la Novedad."
        );
      }
    ).add(() => this.submitted = false);
  }

  openLink() {
    window.open(this._new.link!, '_blank');
  }

  copyLink() {
    navigator.clipboard.writeText(this._new.link!).then(() => {
      this.toastr.success("Enlace copiado al portapapeles");
    }).catch(err => {
      this.toastr.error("Error al copiar el enlace");
      console.error('Error al copiar el enlace: ', err);
    });
  }
}
