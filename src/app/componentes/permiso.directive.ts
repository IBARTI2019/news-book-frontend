import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Metodo, Permiso, Usuario } from 'app/seguridad/servicios/interface';
import { UsuarioService } from "app/seguridad/servicios/usuario.service";

@Directive({
  selector: '[appPermiso]'
})
export class PermisoDirective {
  usuario!: any | Usuario;
  @Input()
  ruta!: string;
  @Input()
  metodo!: string | Array<string>;
  @Input()
  ocultar: boolean = false;

  constructor(private eleRef: ElementRef, private renderer: Renderer2, private usuarioService: UsuarioService, private router: Router) {
    this.ruta = this.ruta ? this.ruta : router.url.substring(1);
  }

  ngOnInit() {
    this.usuario = this.usuarioService.actual();
    if (this.usuario) {
      let permisos = [];
      let permisos_metodos = [];
      return true
      if (this.usuario.roll.SU === false) {
        permisos = this.usuario.permisos.filter((permiso: any) => permiso?.routers ? permiso.routers.includes(this.ruta) : false);
        if (permisos.length > 0) {
          if (this.metodo) {
            permisos_metodos = permisos?.filter((p: Permiso) => p.metodos.find((m: Metodo | any) => {
              if (typeof this.metodo === 'object') {
                return this.metodo.includes(m.metodo);
              } else {
                return this.metodo === m.metodo;
              }
            }));
            if (permisos_metodos.length === 0) {
              this.ocultarElemento();
            }
          }
        } else {
          this.ocultarElemento();
        }
      }
    } else {
      this.ocultarElemento();
    }
  }

  ocultarElemento() {
    if (this.ocultar) {
      this.renderer.setStyle(this.eleRef.nativeElement, 'display', 'none');
    } else {
      this.renderer.setAttribute(this.eleRef.nativeElement, 'disabled', 'true');
    }
  }
}
