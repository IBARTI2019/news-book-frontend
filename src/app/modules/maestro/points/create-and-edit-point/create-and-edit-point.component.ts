import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Point } from '../../../../interfaces';
import { PointsService } from '../../../../services/points.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-and-edit-point',
  templateUrl: './create-and-edit-point.component.html',
  styleUrls: ['./create-and-edit-point.component.css']
})
export class CreateAndEditPointComponent implements OnInit {
  fg: FormGroup;
  submitted = false;
  update = false;
  id = "";
  routeState: any;
  redirectTo = "";

  constructor(
    private pointsService: PointsService,
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
        code: ["", Validators.required],
        name: ["", Validators.required],
        is_active: [true, Validators.required],
      },
      {}
    );
    if (this.id) {
      this.update = true;
      this.getPoint();
    }
  }

  onSubmit() {
    if (this.fg.invalid) {
      return;
    }
    this.submitted = true;
    this.update ? this.updatePoint() : this.save();
  }

  onReset() {
    this.submitted = false;
    this.fg.reset();
    this.router.navigate([this.redirectTo || "Points"]);
  }

  save() {
    this.pointsService.add(this.fg.value).subscribe(
      (data) => {
        this.toastr.success("Libro creado con éxito");
        this.submitted = false;
        this.fg.reset();
        this.router.navigate([this.redirectTo || "locations"]);
      },
      (error: HttpErrorResponse) => {
        this.submitted = false;
        this.toastr.error(error.error.message || "No se pudo crear los datos");
      }
    );
  }

  getPoint() {
    this.pointsService.get(this.id).subscribe((data: Point) => {
      this.fg.get("code")!.setValue(data.code);
      this.fg.get("name")!.setValue(data.name);
      this.fg.get("is_active")!.setValue(data.is_active);
    },
      (error: HttpErrorResponse) => {
        this.toastr.error(error.error.message || 'Error al obtener el libro');
      }
    );
  }

  updatePoint() {
    this.pointsService.update(this.id, this.fg.value).subscribe(
      (data) => {
        this.toastr.success("Datos del Libro actualizados");
        this.submitted = false;
        this.fg.reset();
        this.router.navigate(["points"]);
      },
      (error: HttpErrorResponse) => {
        this.submitted = false;
        this.toastr.error(
          error.error.message || "No se logro actualizar el libro"
        );
      }
    );
  }
}
