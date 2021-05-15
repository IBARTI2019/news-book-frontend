import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.css']
})
export class InfoDialogComponent implements OnInit {
  message: string = ''

  constructor(
    private dialogRef: MatDialogRef<InfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) { }

  ngOnInit(): void {
    if (!this.data || (typeof this.data !== 'string')) {
      this.message = 'No hay informacion'
    } else {
      this.message = this.data
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
