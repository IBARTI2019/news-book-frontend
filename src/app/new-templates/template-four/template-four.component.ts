import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TemplateFour } from 'app/interfaces';
import { TemplateNew, TemplatesNew } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-template-four',
  templateUrl: './template-four.component.html',
  styleUrls: ['./template-four.component.css']
})
export class TemplateFourComponent implements OnInit {
  @Output() tSubmit = new EventEmitter<TemplateFour>();
  @Input() method: string = "view";
  @Input() name: string = '';
  @Input() operation: string = '';
  @Input() data: TemplateFour = {
    id: "",
    notice: "",
  };
  fg: FormGroup;
  submitted = false;
  id: string = "";
  update: boolean = false;
  view = true;
  storageData = {
    notice: "",
    perimetro: "",
    alumbrado: "",
    alarmas: "",
    sCI: "",
  }
  currentTemplate: TemplateNew = {
    name: '',
    url: '',
    id: '',
    operation: '',
  }

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private route: ActivatedRoute,
  ) {
    this.fg = this.fb.group({});
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.currentTemplate = TemplatesNew.filter((currentT) => currentT.name === this.name)[0]
    console.log('Current Template: ', this.currentTemplate)
    this.storageData = this.currentTemplate.id ? this.getLocalStorage(this.currentTemplate.id) : null
    this.setMethods();
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

  private deleteStorageItem(fieldName: string) {
    if (fieldName) localStorage.removeItem(fieldName)
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

  onReset() {
    this.submitted = false;
    this.fg.reset();
    this.deleteStorageItem(this.currentTemplate.id);
  }

}
