import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TemplateOne } from "app/interfaces";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-template-one",
  templateUrl: "./template-one.component.html",
  styleUrls: ["./template-one.component.css"],
})
export class TemplateOneComponent implements OnInit {
  @Output() tSubmit = new EventEmitter<TemplateOne>();
  @Input() method: string = "view";
  @Input() name: string = '';
  @Input() operation: string = '';
  @Input() data: TemplateOne = {
    id: "",
    perimetro: "",
    alumbrado: "",
    alarmas: "",
    sCI: "",
  };
  fg: FormGroup;
  submitted = false;
  id: string = "";
  update: boolean = false;
  view = true;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private route: ActivatedRoute,
  ) {
    this.fg = this.fb.group({});
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    console.log('Metodo: ', this.method)
    this.setMethods();
    this.fg = this.fb.group(
      {
        perimetro: [
          this.data.perimetro,
          this.view ? Validators.nullValidator : Validators.required,
        ],
        alumbrado: [
          this.data.alumbrado,
          this.view ? Validators.nullValidator : Validators.required,
        ],
        alarmas: [
          this.data.alarmas,
          this.view ? Validators.nullValidator : Validators.required,
        ],
        sCI: [
          this.data.sCI,
          this.view ? Validators.nullValidator : Validators.required,
        ],
      },
      {}
    );
    if (this.id) {
      this.update = true;
    }
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
      console.log('Invalid')
      this.submitted = false;
      return;
    }
    console.log('Valid')
    this.tSubmit.emit(this.fg.value);
    this.submitted = false;
  }
}
