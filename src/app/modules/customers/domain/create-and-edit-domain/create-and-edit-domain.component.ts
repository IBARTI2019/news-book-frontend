import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DomainsService } from '../../../../services/domains.service';
import { ClientsService } from '../../../../services/clients.service';
import { ToastrService } from 'ngx-toastr';
import { Client, Domain } from '../../../../interfaces';

@Component({
  selector: 'app-create-and-edit-domain',
  templateUrl: './create-and-edit-domain.component.html',
  styleUrls: ['./create-and-edit-domain.component.css']
})
export class CreateAndEditDomainComponent implements OnInit {
  fg: FormGroup;
  submitted = false;
  update = false;
  id = "";
  routeState: any;
  redirectTo = "";
  clients: Client[] = [];
  constructor(
    private domainsService: DomainsService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private clientsService: ClientsService,
  ) {
    this.fg = this.fb.group({});
    this.routeState = history.state
  }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.redirectTo = this.routeState.redirectTo || ""
    this.clientsService.list({ not_paginator: true }).subscribe(data => {
      this.clients = data;
    });
    this.fg = this.fb.group(
      {
        domain: ["", Validators.required],
        tenant_id: ["", Validators.required],
      },
      {}
    );
    if (this.id) {
      this.update = true;
      this.getDomain();
    }
  }

  onSubmit() {
    if (this.fg.invalid) {
      return;
    }
    this.submitted = true;
    this.update ? this.updateDomain() : this.save();
  }

  onReset() {
    this.submitted = false;
    this.fg.reset();
    this.router.navigate([this.redirectTo || "Domains"]);
  }

  save() {
    this.domainsService.add(this.fg.value).subscribe(
      (data) => {
        this.toastr.success("Dominio creado con éxito");
        this.submitted = false;
        this.fg.reset();
        this.router.navigate([this.redirectTo || "domains"]);
      },
      (error: HttpErrorResponse) => {
        this.submitted = false;
        this.toastr.error(error.error.message || "No se pudo crear los datos");
      }
    );
  }

  getDomain() {
    this.domainsService.get(this.id).subscribe((data: Domain) => {
      this.fg.get("domain")!.setValue(data.domain);
      this.fg.get("tenant_id")!.setValue(data.tenant_id);
    },
      (error: HttpErrorResponse) => {
        this.toastr.error(error.error.message || 'Error al obtener el Dominio');
      }
    );
  }

  updateDomain() {
    this.domainsService.update(this.id, this.fg.value).subscribe(
      (data) => {
        this.toastr.success("Datos del Dominio actualizados");
        this.submitted = false;
        this.fg.reset();
        this.router.navigate(["domains"]);
      },
      (error: HttpErrorResponse) => {
        this.submitted = false;
        this.toastr.error(
          error.error.message || "No se logro actualizar el Dominio"
        );
      }
    );
  }
}
