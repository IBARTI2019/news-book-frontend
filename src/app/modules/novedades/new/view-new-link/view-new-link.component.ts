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
  selector: 'app-view-new-link',
  templateUrl: './view-new-link.component.html',
  styleUrls: ['./view-new-link.component.css'],
  providers: [QuestionService]
})
export class ViewNewLinkComponent implements OnInit {

  id = "";
  controls$!: Observable<QuestionBase[]>;
  generating = true;
  _new: New = { id: "", employee: "" };
  client: {cliente?: string, ubicacion?: string} = {};
  client_schema: string = "";
  constructor(private newService: NewService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private serviceQuestion: QuestionService,
    private ibartiService: IbartiService,
  ) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.client_schema = this.route.snapshot.params.client_schema;
    this.newService.getAllow(this.id, this.client_schema).subscribe(
      (_new: any) => {
        this._new = _new.new;
        this.client.cliente = _new.client;
        this.client.ubicacion = _new.new?.location_display ? _new.new?.location_display.name : 'N/A';
        try{
          this._new.template = JSON.parse(this._new.template);
        }catch(e){
          this._new.template = []
          console.log(e);
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
