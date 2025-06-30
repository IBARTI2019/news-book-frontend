import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccessEntryFormComponent } from '../access-form/access-form.component';
import { AccessEntryService } from '../../../../services/access-entry.service';
import { PersonService } from '../../../../services/person.service';
import { AccessGroupService } from '../../../../services/access-group.service';
import { AccessEntryModel, AccessGroupModel, Person } from '../../../../interfaces';

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
  persons: Person[] = [];
  groups: AccessGroupModel[] = [];
  RECURRING = AccessEntryService.RECURRING;

  constructor(
    private dialog: MatDialog,
    private accessEntryService: AccessEntryService,
    private personService: PersonService,
    private accessGroupService: AccessGroupService
  ) {}

  ngOnInit() {
    this.loadAccesses();
    this.loadPersons();
    this.loadGroups();
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

  loadPersons() {
    this.personService.list({not_paginator: true}).subscribe({
      next: (persons) => {
        this.persons = persons;
      }
    });
  }

  loadGroups() {
    this.accessGroupService.getAll({not_paginator: true}).subscribe({
      next: (groups) => {
        this.groups = groups;
      }
    });
  }

  get accessesOfDay(): AccessEntryModel[] {
    return this.accesses.filter(a => {
      // Accesos normales (single) que coinciden exactamente con la fecha seleccionada
      const isSingleAccess = a.access_type === AccessEntryService.SINGLE && new Date(a.date_start).toDateString() >= this.selectedDate.toDateString() &&
      new Date(a.date_end).toDateString() <= this.selectedDate.toDateString()
  
      // Accesos recurrentes que aplican para el día seleccionado
      const isRecurringAccess = a.access_type === AccessEntryService.RECURRING
        && this.matchesWeekDay(a.week_days || [], this.selectedDate);
  
      return isSingleAccess || isRecurringAccess;
    });
  }
  
  // Función para verificar si el día seleccionado coincide con los días de la semana del acceso recurrente
  private matchesWeekDay(weekDays: string[], selectedDate: Date): boolean {
    if (!weekDays || weekDays.length === 0) return false;
    
    const dayNames = AccessEntryService.weekDays.map(day => day.value);
    const currentDay = dayNames[selectedDate.getDay()-1];
    
    return weekDays.includes(currentDay);
  }

  selectDate(date: Date) {
    this.selectedDate = date;
  }

  openNewAccess() {
    const dialogRef = this.dialog.open(AccessEntryFormComponent, {
      width: '500px',
      data: { personsList: this.persons, groupsList: this.groups }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.accessEntryService.create(result).subscribe(() => this.loadAccesses());
      }
    });
  }

  editAccess(access: AccessEntryModel) {
    const dialogRef = this.dialog.open(AccessEntryFormComponent, {
      width: '500px',
      data: { ...access, personsList: this.persons, groupsList: this.groups }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.accessEntryService.updateAccessEntry(access.id, result).subscribe(() => this.loadAccesses());
      }
    });
  }

  deleteAccess(access: AccessEntryModel) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.accessEntryService.deleteAccessEntry(access.id).subscribe(() => this.loadAccesses());
      }
    });
  }
} 