import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccessEntryFormComponent } from '../access-form/access-form.component';
import { AccessEntryService } from '../../../../services/access-entry.service';
import { AccessEntryModel } from '../../../../interfaces';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h2 mat-dialog-title>Confirm deletion</h2>
    <mat-dialog-content>Are you sure you want to delete this access?</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>No</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">Yes, delete</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {}


@Component({
  selector: 'app-access-entries-calendar',
  templateUrl: './access-calendar.component.html',
  styleUrls: ['./access-calendar.component.scss']
})
export class AccessEntriesCalendarComponent implements OnInit {
  selectedDate: Date = new Date();
  accesses: AccessEntryModel[] = [];
  loading = false;
  RECURRING = AccessEntryService.RECURRING;

  constructor(
    private dialog: MatDialog,
    private accessEntryService: AccessEntryService
  ) {}

  ngOnInit() {
    this.loadAccesses();
  }

  loadAccesses() {
    this.loading = true;
    this.accessEntryService.getAll({not_paginator: true}).subscribe({
      next: (accesses) => {
        this.accesses = accesses;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  get accessesOfDay(): AccessEntryModel[] {
    return this.accesses.filter(a => {
      const selectedDateObj = new Date(this.selectedDate);
      const startDateObj = new Date(a.date_start);
      const endDateObj = new Date(a.date_end);
      
      // Accesos normales (single) que coinciden exactamente con la fecha seleccionada
      const isSingleAccess = a.access_type === AccessEntryService.SINGLE
        && selectedDateObj >= startDateObj && selectedDateObj <= endDateObj;
  
      // Accesos recurrentes que aplican para el día seleccionado
      const isRecurringAccess = a.access_type === AccessEntryService.RECURRING
        && this.matchesWeekDay(a.week_days || [], a.specific_days || [], this.selectedDate);
  
      return isSingleAccess || isRecurringAccess;
    });
  }
  
  // Función para verificar si el día seleccionado coincide con los días de la semana del acceso recurrente
  private matchesWeekDay(weekDays: string[], specificDays: number[], selectedDate: Date): boolean {
    const dayNames = AccessEntryService.weekDays.map(day => day.value);
    const dayIndex = selectedDate.getDay();
    const dayNumber = selectedDate.getDate();
    const currentDay = dayNames[dayIndex];
    return weekDays.includes(currentDay) || specificDays.includes(dayNumber);
  }

  selectDate(date: Date) {
    this.selectedDate = date;
  }

  openNewAccess() {
    const dialogRef = this.dialog.open(AccessEntryFormComponent, {
      width: '500px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAccesses();
      }
    });
  }

  editAccess(access: AccessEntryModel) {
    const dialogRef = this.dialog.open(AccessEntryFormComponent, {
      width: '500px',
      data: { ...access}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAccesses();
      }
    });
  }

  deleteAccess(access: AccessEntryModel) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {data: {title: 'Eliminar acceso', message: '¿Estás seguro de querer eliminar este acceso?', confirmText: 'Eliminar', cancelText: 'Cancelar'}});
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.accessEntryService.deleteAccessEntry(access.id).subscribe(() => this.loadAccesses());
      }
    });
  }
} 