import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Person } from '../../interfaces';

@Component({
  selector: 'app-blacklist-alert',
  templateUrl: './blacklist-alert.component.html',
  styleUrls: ['./blacklist-alert.component.css']
})
export class BlacklistAlertComponent {
  constructor(
    public dialogRef: MatDialogRef<BlacklistAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { person: Person }
  ) { }
}
