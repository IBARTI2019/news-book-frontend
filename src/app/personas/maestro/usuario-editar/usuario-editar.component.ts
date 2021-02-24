import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from 'app/personas/servicios/usuario.service';
import { TipopersonaService } from 'app/personas/servicios/tipopersonas.service';
import { Tipopersona } from 'app/personas/servicios/interface';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Usuario } from 'app/personas/servicios/interface';
//import { RolService } from "app/seguridad/servicios/rol.service";
//import { SucursalService } from 'app/maestro/servicios/sucursal.service';
//import { Sucursal } from 'app/maestro/servicios/interface';

@Component({
  selector: 'app-usuario-editar',
  templateUrl: './usuario-editar.component.html',
  styleUrls: ['./usuario-editar.component.css']
})
export class UsuarioEditarComponent implements OnInit {
  fg: any | FormGroup;
  // modal variables
  submitted = false;
  errors: any;
  id: string = '';
  listap: Tipopersona[] = [];
  //roles: Roll[] = [];
  //sucursales: Sucursal[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private servicepersonat:TipopersonaService,
    //private sucursalService: SucursalService,
    //private rolService: RolService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.fg = this.fb.group({});
  }


  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.servicepersonat.list().subscribe((data: Tipopersona[]) => {
      this.listap= data;
    });
    this.fg = this.fb.group({
      cod_person: ['', Validators.required],
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      doc_ident: ['', Validators.required],
      addres: ['', Validators.required],
      phono: ['', Validators.required],
      movil: ['', Validators.required],
      id_type_person:['', Validators.required],
      status: [true, Validators.required],
      
      }, {});
    this.getUsuario();
  }

  onSubmit() {
    this.submitted = true;
    if (this.fg.invalid) {
      return;
    }
    this.actualizar();
  }

  onReset() {
    this.submitted = false;
    this.fg.reset();
    this.router.navigate(['inicio/personas/maestro']);
  }

  getUsuario() {
    this.usuarioService.get(this.id).subscribe(
      (data: Usuario) => {
        this.fg.get('cod_person').setValue(data.cod_person);
        this.fg.get('name').setValue(data.name);
        this.fg.get('lastname').setValue(data.lastname);
        this.fg.get('status').setValue(data.status);
        this.fg.get('doc_ident').setValue(data.doc_ident);
        this.fg.get('addres').setValue(data.addres);
        this.fg.get('phono').setValue(data.phono);
        this.fg.get('movil').setValue(data.movil);
        this.fg.get('id_type_person').setValue(data.id_type_person);
        
      });
  }

  actualizar() {
    this.usuarioService.update(this.id, this.fg.value).subscribe(
      data => {
        console.log(data);
        this.toastr.success('Datos Personas actualizado');
        this.submitted = false;
        this.fg.reset();
        this.router.navigate(['inicio/personas/maestro']);
      },
      (result: any) => {
        this.errors = result.errors;
        this.toastr.error('No se pudo actualizar los Datos');
      }
    );
  }
}
