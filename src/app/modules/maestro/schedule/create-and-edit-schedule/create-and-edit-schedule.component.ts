import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmDialogComponent } from 'app/componentes/confirm-dialog/confirm-dialog.component';
import { Schedule } from 'app/interfaces';
import { ScheduleService } from 'app/services/schedule.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-and-edit-schedule',
  templateUrl: './create-and-edit-schedule.component.html',
  styleUrls: ['./create-and-edit-schedule.component.css']
})
export class CreateAndEditScheduleComponent implements OnInit {
  fg: FormGroup;
  submitted = false;
  update: boolean = false;
  id: string = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      modal: boolean,
      id: string,
    },
    private mdDialogRef: MatDialogRef<ConfirmDialogComponent>,
    private scheduleService: ScheduleService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.fg = this.fb.group({});
  }

  ngOnInit() {
    this.id = this.route.snapshot.params.id ? this.route.snapshot.params.id : this.data.id;
    this.fg = this.fb.group(
      {
        description: ["", Validators.required],
        start_time: ["", Validators.required],
        final_hour: ["", Validators.required],
        is_active: [true, Validators.required],
      },
      {}
    );
    if (this.id) {
      this.update = true;
      this.getSchedule();
    }
    console.log('Modal', this.data.modal);
  }

  onSubmit() {
    this.submitted = true;
    if (this.fg.invalid) {
      this.submitted = false;
      return;
    }
    this.update ? this.updateSchedule() : this.save();
  }

  onReset() {
    this.submitted = false;
    this.fg.reset();
    if(this.data.modal == false){
      this.router.navigate(["schedule"]);
    }
  }

  save() {
    if (this.fg.value.start_time < this.fg.value.final_hour) {
      this.scheduleService.add(this.fg.value).subscribe(
        (data) => {
          this.toastr.success("Horario creada con éxito!");
          this.submitted = false;
          this.fg.reset();
          if (this.id) {
            if(this.data.modal == false){
              this.router.navigate(["schedule"]);
              this.mdDialogRef.close();
            }
          } else {
            this.submitted = false;
            this.fg.reset();
          }

        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          this.toastr.error(
            error.error.message || "Ocurrio un error al crear a el horario."
          );
        }
      );
    } else {
      this.toastr.error("La hora inicial debe ser menor a la hora final");
    }
  }

  getSchedule() {
    this.scheduleService.get(this.id || '').subscribe((data: Schedule) => {
      this.fg.get("description")!.setValue(data.description);
      this.fg.get("start_time")!.setValue(data.start_time);
      this.fg.get("final_hour")!.setValue(data.final_hour);
      this.fg.get("is_active")!.setValue(data.is_active);
    });
  }

  updateSchedule() {
    this.scheduleService.update(this.id, this.fg.value).subscribe(
      (data) => {
        this.toastr.success("Horario actualizado!");
        this.submitted = false;
        this.fg.reset();
        if(this.data.modal == false){
          this.router.navigate(["schedule"]);
        }
        this.mdDialogRef.close();
      },
      (error: HttpErrorResponse) => {
        this.submitted = false;
        this.toastr.error(error.error.message || "No se pudo actualizar el horario.");
      }
    );
  }
}
