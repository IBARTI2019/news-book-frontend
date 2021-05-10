import { Directive, ElementRef, Input, Renderer2 } from "@angular/core";
import { Router } from "@angular/router";
import { Metodo, Permiso, User } from "app/interfaces";
import { SessionService } from "app/services/session.service";

@Directive({
  selector: "[appPermiso]",
})
export class PermisoDirective {
  usuario!: User;
  @Input()
  ruta!: string;
  @Input()
  metodo!: string | Array<string>;
  @Input()
  ocultar: boolean = false;

  constructor(
    private eleRef: ElementRef,
    private renderer: Renderer2,
    private sessionService: SessionService,
    private router: Router
  ) {
    this.ruta = this.ruta ? this.ruta : router.url.substring(1);
  }

  ngOnInit() {
    this.sessionService.actual().subscribe((user: User) => {
      this.usuario = user;
      if (this.usuario) {
        let permisos = [];
        let permisos_metodos = [];
        return true;
      } else {
        this.ocultarElemento();
      }
    });
    
  }

  ocultarElemento() {
    if (this.ocultar) {
      this.renderer.setStyle(this.eleRef.nativeElement, "display", "none");
    } else {
      this.renderer.setAttribute(this.eleRef.nativeElement, "disabled", "true");
    }
  }
}
