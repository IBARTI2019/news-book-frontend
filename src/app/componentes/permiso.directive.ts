import { Directive, ElementRef, Input, Renderer2 } from "@angular/core";
import { Router } from "@angular/router";
import { Metodo, Permiso, User } from "app/interfaces";
import { SessionService } from "app/services/session.service";
import { UserService } from 'app/services/user.service';

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
    private userService: UserService,
    private router: Router
  ) {
    this.ruta = this.ruta || router.url.substring(1);
  }

  ngOnInit() {
    this.userService.user$.subscribe((user) => {
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
