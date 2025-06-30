import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Person } from '../../interfaces';
import { AccessEntryService } from '../../services/access-entry.service';

@Component({
  selector: 'app-blacklist-alert',
  templateUrl: './blacklist-alert.component.html',
  styleUrls: ['./blacklist-alert.component.css']
})
export class BlacklistAlertComponent {
  weekDaysES = AccessEntryService.weekDays;
  public SINGLE = AccessEntryService.SINGLE;
  public RECURRING = AccessEntryService.RECURRING;

  constructor(
    public dialogRef: MatDialogRef<BlacklistAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { person: Person, message?: string, noAccess?: boolean, access_list?: any[] }
  ) { }

  public weekDayLabel(day: string): string {
    const found = this.weekDaysES.find(d => d.value === day);
    return found ? found.label : day;
  }

  public weekDaysToSpanish(days: string[]): string {
    if (!days) return '';
    return days.map(day => this.weekDayLabel(day)).join(', ');
  }
}
