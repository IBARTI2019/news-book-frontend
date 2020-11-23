import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { map, take } from 'rxjs/operators';

interface OpcionesDialog {
  title?: string;
  message: string
  cancelText?: string;
  confirmText?: string;
}

@Injectable()
export class ConfirmDialogService {
  constructor(private dialog: MatDialog) { }
  dialogRef: MatDialogRef<ConfirmDialogComponent> | any = null;

  public open(options: OpcionesDialog) {
    options.title = options.title ? options.title : 'CONFIRM';
    options.cancelText = options.cancelText ? options.cancelText : 'CANCELAR';
    options.confirmText = options.confirmText ? options.confirmText : 'CONFIRMAR';

    this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: options.title,
        message: options.message,
        cancelText: options.cancelText,
        confirmText: options.confirmText
      }
    });
  }

  public confirmed(): Observable<any> {
    return this.dialogRef.afterClosed().pipe(take(1), map(res => {
      return res;
    }));
  }

  public close() {
    this.dialogRef.close();
  }
}