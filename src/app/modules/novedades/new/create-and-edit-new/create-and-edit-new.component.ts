import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { QuestionBase } from "app/dynamic-forms/classes";
import { QuestionService } from "../../../../dynamic-forms/services/question.service";
import { New, TemplateTypeNew, TypeNew } from "app/interfaces";
import { IbartiService } from "app/services/ibarti.service";
import { NewService } from "../../../../services/new.service";
import { TypeNewService } from "app/services/type-new.service";
import { TemplateNew } from "environments/environment";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";

@Component({
  selector: "app-create-and-edit-new",
  templateUrl: "./create-and-edit-new.component.html",
  styleUrls: ["./create-and-edit-new.component.css"],
  providers: [QuestionService]
})
export class CreateAndEditNewComponent implements OnInit {
  showOne = false;
  showTwo = false;
  showThree = false;
  showFour = false;
  showFive = false;
  showSix = false;
  showSeven = false;
  showEight = false;
  showNotFound = false;
  templateUrl = "";
  template: TemplateNew = {
    name: "",
    id: "",
    url: "",
    operation: "",
  };
  update = false;
  submitted = false;
  id = "";
  idTN = "";
  currentNew: New = {
    id: "",
    employee: "",
  };
  controls$!: Observable<QuestionBase[]>;
  generating = true;
  client: any;
  constructor(
    private newService: NewService,
    private typeNewService: TypeNewService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private serviceQuestion: QuestionService,
    private ibartiService: IbartiService,
  ) {
    //  this.controls$ = serviceQuestion.getQuestions([], true);
  }

  ngOnInit(): void {
    this.ibartiService.location_current().subscribe((client) => {
      this.client = client;
      console.log(this.client);
    });
    this.idTN = this.route.snapshot.params.idTN;
    this.currentNew.employee = this.getLocalStorage('id_user')
    this.currentNew.type_news = this.idTN;
    this.typeNewService.get(this.idTN).subscribe(
      (typeNew: TypeNew) => {
        try{
          this.currentNew.template = JSON.parse(typeNew.template);
        }catch(e){
          this.currentNew.template = [];
          console.log(e);
        }
        this.generateControls(this.currentNew.template !== 'object' ? this.currentNew.template : [])
      },
      (error: HttpErrorResponse) => {
        this.toastr.error(
          error.error.message || "No se pudo obtener el tipo de novedad."
        );
      }
    );
  }

  private getLocalStorage(fieldName: string) {
    if (fieldName) {
      const data = localStorage.getItem(fieldName);
      return data ? JSON.parse(data) : null;
    }
    return null
  }

  private deleteStorageItem(fieldName: string) {
    if (fieldName) localStorage.removeItem(fieldName)
  }

  generateControls(template: TemplateTypeNew[]) {
    this.generating = true
    this.controls$ = this.serviceQuestion.generatePreviewQuentions(template);
    this.generating = false
  }

  save(data: any) {
    this.submitted = true;
    this.currentNew.info = data;
    try{
      this.currentNew.template = JSON.parse(this.currentNew.template);
    } catch { }
    
    this.newService.add(this.currentNew).subscribe(
      (data) => {
        this.toastr.success("Novedad creada con éxito.");
        this.submitted = false;
        this.deleteStorageItem(this.template.id)
        this.deleteStorageItem('id_user')
        this.router.navigate(["new"]);
      },
      (error: HttpErrorResponse) => {
        this.toastr.error(
          error.error.message || "No se pudo crear la Novedad."
        );
      }
    ).add(() => this.submitted = false);
  }
}
