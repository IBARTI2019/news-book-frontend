import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { QuestionBase } from '../../../../dynamic-forms/classes';
import { QuestionService } from '../../../../dynamic-forms/services/question.service';
import { TemplateTypeNew, New } from 'app/interfaces';
import { NewService } from '../../../../services/new.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { IbartiService } from 'app/services/ibarti.service';

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
  constructor(private newService: NewService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private serviceQuestion: QuestionService,
    private ibartiService: IbartiService
  ) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.ibartiService.location_current().subscribe((client) => {
      this.client = client;
    });
    this.newService.get(this.id).subscribe(
      (_new: New) => {
        this._new = _new;
        try {
          this._new.template = JSON.parse(this._new.template);
        } catch (e) {
          this._new.template = []
        }
        this.generateControls(this._new.template);
      },
      (error: HttpErrorResponse) => {
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
}
