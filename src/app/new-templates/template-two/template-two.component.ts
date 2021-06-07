import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TemplateTwoVehicle } from 'app/interfaces';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-template-two',
  templateUrl: './template-two.component.html',
  styleUrls: ['./template-two.component.css']
})
export class TemplateTwoComponent implements OnInit {
  @Output() tSubmit = new EventEmitter<TemplateTwoVehicle>();
  @Input() method: string = "view";
  @Input() name: string = '';
  @Input() operation: string = '';
  @Input() data: TemplateTwoVehicle = {
    id: "",
    notice: "",
    vehiculos: []
  };
  fg: FormGroup;
  submitted = false;
  id: string = "";
  update: boolean = false;
  selectedPlates: string[];
  view = true;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private route: ActivatedRoute,
  ) {
    this.fg = this.fb.group({});
    this.selectedPlates = ['Placa_1', 'Placa_2', 'Placa_3', 'Placa_1', 'Placa_2', 'Placa_3', 'Placa_1', 'Placa_2', 'Placa_3'];
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    console.log('Metodo: ', this.method)
    this.setMethods();
    this.fg = this.fb.group(
      {
        notice: [
          this.data.notice,
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
    // this.tSubmit.emit(this.fg.value);
    this.submitted = false;
  }

  deselect(position: number) {
    const newArray = [ ...this.selectedPlates ]
    newArray.splice(position, 1)
    this.selectedPlates = [ ...newArray ]
  }

}
