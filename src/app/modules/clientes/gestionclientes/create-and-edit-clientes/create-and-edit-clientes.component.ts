import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Client} from 'app/interfaces';
import { ClientsService } from 'app/services/clients.service';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private clientesService: ClientsService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.fg = this.fb.group({});
    this.routeState = history.state
  }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.redirectTo = this.routeState.redirectTo || ""

    this.fg = this.fb.group(
      {
        schema_name: ["", Validators.required],
        name: ["", Validators.required],
        paid_until: [""],
        on_trial: [true, Validators.required],
      },
      {}
    );
    if (this.id) {
      this.update = true;
      this.getCliente();
    }
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
    this.clientesService.add(this.fg.value).subscribe(
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
    );
  }

  getCliente() {
    this.clientesService.get(this.id).subscribe((data: Client) => {
      this.fg.get("schema_name")!.setValue(data.schema_name);
      this.fg.get("name")!.setValue(data.name);
      this.fg.get("paid_until")!.setValue(data.paid_until);
      this.fg.get("on_trial")!.setValue(data.on_trial);
    },
      (error: HttpErrorResponse) => {
        this.toastr.error(error.error.message || 'Error al obtener el Cliente');
      }
    );
  }

  updateCliente() {
    this.clientesService.update(this.id, this.fg.value).subscribe(
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
    );
  }
}
