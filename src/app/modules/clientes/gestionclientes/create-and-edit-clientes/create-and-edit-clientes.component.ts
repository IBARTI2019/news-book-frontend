import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Client, TypeNew} from '../../../../interfaces';
import { ClientsService } from 'app/services/clients.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from "moment";
import { TypeNewService } from '../../../../services/type-new.service';

@Component({
  selector: 'app-create-and-edit-clientes',
  templateUrl: './create-and-edit-clientes.component.html',
  styleUrls: ['./create-and-edit-clientes.component.css']
})
export class CreateAndEditClientescomponent implements OnInit {
  fg: FormGroup;
  submitted = false;
  update = false;
  id = "";
  routeState: any;
  redirectTo = "";
  guardando = false;
  typesNews: TypeNew[] = [];

  constructor(
    private clientesService: ClientsService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public typeNewService: TypeNewService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.fg = this.fb.group({});
    this.routeState = history.state
  }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.redirectTo = this.routeState.redirectTo || ""
    this.getTypeNews();
    this.fg = this.fb.group(
      {
        schema_name: ["", Validators.required],
        name: ["", Validators.required],
        email: ["", Validators.required],
        paid_until: [""],
        on_trial: [true],
        facial_recognition: [false],
        type_news: [[]],
      },
      {}
    );
    if (this.id) {
      this.update = true;
      this.getCliente();
    }
  }

  getTypeNews() {
    this.typeNewService.list({ not_paginator: true}).subscribe(data => {
      this.typesNews = data;
    }, error => {
      this.toastr.error(error.error.message || 'Error al obtener los tipos de novedades');
    })
  }

  onSubmit() {
    if (this.fg.invalid) {
      return;
    }
    this.submitted = true;
    this.update ? this.updateCliente() : this.save();
  }

  onReset() {
    this.submitted = false;
    this.fg.reset();
    this.router.navigate([this.redirectTo || "Clientes"]);
  }

  save() {
    this.guardando = true;
    let data = this.fg.value;
    data['paid_until'] = moment(this.fg.value.paid_until).format("YYYY-MM-DD")
    this.clientesService.add(data).subscribe(
      (data) => {
        this.toastr.success("Cliente creado con éxito");
        this.submitted = false;
        this.fg.reset();
        this.router.navigate([this.redirectTo || "clientes"]);
      },
      (error: HttpErrorResponse) => {
        this.submitted = false;
        this.toastr.error(error.error.message || "No se pudo crear los datos");
      }
    ).add(()=>this.guardando=false);
  }

  getCliente() {
    this.clientesService.get(this.id).subscribe((data: Client) => {
      this.fg.get("schema_name")!.setValue(data.schema_name);
      this.fg.get("name")!.setValue(data.name);
      this.fg.get("email")!.setValue(data.email);
      this.fg.get("paid_until")!.setValue(data.paid_until);
      this.fg.get("on_trial")!.setValue(data.on_trial);
      this.fg.get("type_news")!.setValue(data.type_news);
      this.fg.get("facial_recognition")!.setValue(data.facial_recognition);
    },
      (error: HttpErrorResponse) => {
        this.toastr.error(error.error.message || 'Error al obtener el Cliente');
      }
    );
  }

  updateCliente() {
    this.guardando = true;
    let data = this.fg.value;
    data['paid_until'] = moment(this.fg.value.paid_until).format("YYYY-MM-DD")
    this.clientesService.update(this.id, data).subscribe(
      (data) => {
        this.toastr.success("Datos del Cliente actualizados");
        this.submitted = false;
        this.fg.reset();
        this.router.navigate(["clientes"]);
      },
      (error: HttpErrorResponse) => {
        this.submitted = false;
        this.toastr.error(
          error.error.message || "No se logro actualizar el Cliente"
        );
      }
    ).add(()=>this.guardando=false);;
  }
}
