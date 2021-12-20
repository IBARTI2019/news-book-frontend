import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {
  MatDatepicker,
  MatDatepickerInputEvent,
} from "@angular/material/datepicker";
import { MatRadioChange } from "@angular/material/radio";
import { Router, ActivatedRoute } from "@angular/router";
import {
  GroupUser,
  NotificationSetting,
  OptionField,
  Schedule,
  TypeNew,
} from "app/interfaces";
import { ScheduleService } from "app/services/schedule.service";
import { SettingNotificationService } from "app/services/setting-notification.service";
import { TypeNewService } from "app/services/type-new.service";
import { UserGroupService } from "app/services/user-group.service";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { ErrorStateFrequencyMatcher } from "../../../../validators";

@Component({
  selector: "app-create-and-edit-notification",
  templateUrl: "./create-and-edit-notification.component.html",
  styleUrls: ["./create-and-edit-notification.component.css"],
})
export class CreateAndEditNotificationComponent implements OnInit {
  fg: FormGroup;
  submitted = false;
  update: boolean = false;
  id: string = "";
  listGroups: GroupUser[] = [];
  types: OptionField[] = [];
  listSchedule: Schedule[] = [];
  listTypeNew: TypeNew[] = [];
  fequencies: OptionField[] = [];
  frequencyMatcher = new ErrorStateFrequencyMatcher();
  public TYPE_OBLIGATORY = SettingNotificationService.TYPE_OBLIGATORY;
  public TYPE_RECURRENT = SettingNotificationService.TYPE_RECURRENT;
  public FREQUENCY_EVERY_DAY = SettingNotificationService.FREQUENCY_EVERY_DAY;
  public FREQUENCY_JUST_ONE_DAY =
    SettingNotificationService.FREQUENCY_JUST_ONE_DAY;
  public FREQUENCY_MORE_THAN_ONE_DAY =
    SettingNotificationService.FREQUENCY_MORE_THAN_ONE_DAY;
  public FREQUENCY_BY_DAY_DAYS =
    SettingNotificationService.FREQUENCY_BY_DAY_DAYS;

  public CLOSE_ON_SELECTED = false;
  public init = new Date();
  public resetModel = new Date(0);
  @ViewChild("picker_days") _picker!: MatDatepicker<Date>;

  constructor(
    private settingNotificationService: SettingNotificationService,
    private groupService: UserGroupService,
    private scheduleService: ScheduleService,
    private typeNewService: TypeNewService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.fg = this.fb.group({});
  }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.getGroups();
    this.getSchedule();
    this.getOptions();
    this.getTypeNews();
    this.fg = this.fb.group(
      {
        description: ["", Validators.required],
        type: [null, Validators.required],
        groups: [[], Validators.required],
        schedule: [[]],
        type_news: [null, Validators.required],
        week_days: [[]],
        day: [""],
        days: [[]],
        frequency: [1, Validators.required],
        is_active: [true, Validators.required],
      },
      {
        validator: this.checkFrequency,
      }
    );
    if (this.id) {
      this.update = true;
      this.getNotificationSetting();
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.fg.invalid) {
      this.submitted = false;
      return;
    }
    let data = this.fg.value;
    if (data.type === this.TYPE_RECURRENT) {
      delete data.day;
      delete data.schedule;
    } else {
      switch (this.fg.get("frequency")?.value) {
        case 1:
          data.week_days = [];
          data.day = null;
          data.days = [];
          break;
        case 2:
          data.week_days = [];
          data.days = [];
          if (data.day) data.day = moment(data.day).format("YYYY-MM-DD");
          break;
        case 3:
          data.week_days = [];
          data.day = null;
          if (data.days)
            data.days = data.days.map((date: Date) =>
              moment(date).format("YYYY-MM-DD")
            );
          break;
        case 4:
          data.day = null;
          data.days = [];
          if (data.week_days)
            data.week_days = data.week_days.map((day: string) => Number(day));
          break;
        default:
          console.warn("Unhandled Frequency");
      }
    }
    this.update ? this.updateNotificationSetting(data) : this.save(data);
  }

  onReset() {
    this.submitted = false;
    this.fg.reset();
    this.router.navigateByUrl("/notification");
  }

  save(obj: NotificationSetting) {
    this.settingNotificationService.add(obj).subscribe(
      (data) => {
        this.toastr.success("Notificación creada con éxito!");
        this.submitted = false;
        this.fg.reset();
        this.router.navigateByUrl("/notification");
      },
      (error: HttpErrorResponse) => {
        this.submitted = false;
        this.toastr.error(
          error.error.message || "Ocurrio un error al crear a la notificación."
        );
      }
    );
  }

  getNotificationSetting() {
    this.settingNotificationService
      .get(this.id || "")
      .subscribe((data: NotificationSetting) => {
        this.fg.get("description")!.setValue(data.description);
        this.fg.get("type")!.setValue(data.type);
        let _groups = data?.groups_display ? data.groups_display.map((d: GroupUser) => d.id) : [];
        this.fg.get("groups")!.setValue(_groups);
        let _schedule = data?.schedule_display ? data.schedule_display.map((d: Schedule) => d.id) : [];
        this.fg.get("schedule")!.setValue(_schedule);
        this.fg.get("type_news")!.setValue(data.type_news);
        if (data.week_days) {
          data.week_days = data.week_days.map((day: string) => String(day));
        }
        this.fg.get("week_days")!.setValue(data.week_days);
        this.fg.get("day")!.setValue(data.day);
        this.fg.get("days")!.setValue(data.days);
        this.fg.get("frequency")!.setValue(data.frequency);
        this.fg.get("is_active")!.setValue(data.is_active);
      });
  }

  updateNotificationSetting(obj: NotificationSetting) {
    this.settingNotificationService.update(this.id, obj).subscribe(
      (data) => {
        this.toastr.success("Notificación actualizada!");
        this.submitted = false;
        this.fg.reset();
        this.router.navigateByUrl("/notification");
      },
      (error: HttpErrorResponse) => {
        this.submitted = false;
        this.toastr.error(error.error.message || "No se pudo actualizar.");
      }
    );
  }

  getGroups() {
    this.groupService.list({ not_paginator: true }).subscribe((response: GroupUser[]) => {
      this.listGroups = [...response];
    });
  }

  getSchedule() {
    this.scheduleService.list({ not_paginator: true }).subscribe((response: Schedule[]) => {
      this.listSchedule = [...response];
    });
  }

  getOptions() {
    this.settingNotificationService
      .field_options_multiple(["type", "frequency"])
      .subscribe((response: any) => {
        this.types = [...response.type];
        this.fequencies = [...response.frequency];
      });
  }

  getTypeNews() {
    this.typeNewService.list({ not_paginator: true }).subscribe((response: TypeNew[]) => {
      this.listTypeNew = [...response];
    });
  }

  public dateClass = (date: Date) => {
    if (this._findDate(date) !== -1) {
      return ["selected"];
    }
    return [];
  };

  public dateChanged(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      const date = event.value;
      const index = this._findDate(date);
      if (index === -1) {
        this.fg.value.days.push(date);
      } else {
        this.fg.value.days.splice(index, 1);
      }
      this.resetModel = new Date(0);
      if (!this.CLOSE_ON_SELECTED) {
        const closeFn = this._picker?.close;
        this._picker.close = () => { };
        this._picker[
          "_popupComponentRef"
        ].instance._calendar.monthView._createWeekCells();
        setTimeout(() => {
          this._picker.close = closeFn;
        });
      }
    }
  }

  public remove(date: Date): void {
    const index = this._findDate(date);
    this.fg.value.days.splice(index, 1);
  }

  private _findDate(date: Date): number {
    return this.fg.value.days.map((m: string) => +m).indexOf(+date);
  }

  handleType = (event: MatRadioChange) => {
  };

  checkFrequency(group: FormGroup) {
    switch (group.controls.frequency.value) {
      case 2:
        if (!group.controls.day.value)
          return {
            dayIsRequired: true,
          };
        break;
      // case 3:
      //   if (!group.controls.days.value.length || (group.controls.days.value.length < 2))
      //     return {
      //       daysIsRequired: "Debe ingresar al menos 2 días.",
      //     };
      //   break;
      case 4:
        if (!group.controls.week_days.value.length)
          return {
            weekDaysIsRequired: true,
          };
        break;
      default:
        return null;
    }
  }
}
