import { Component, OnInit, Inject } from '@angular/core';
import { FacialRecognitionService } from '../../services/facial-recognition.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatListOption, MatSelectionListChange } from '@angular/material/list';

export interface Recognition {
  id: number;
  user_id: string;
  event_time: string;
  raw_data: any; // Se puede definir una interfaz más estricta si es necesario
  movement_type: 'IN' | 'OUT';
  created_at: string;
  location: string | null;
}

// Interfaz para los datos que se pasarán al diálogo.
export interface DialogData {
  recognitions: Recognition[];
}

@Component({
  selector: 'app-facial-recognition-list',
  templateUrl: './facial-recognition-list.component.html',
  styleUrls: ['./facial-recognition-list.component.css']
})
export class FacialRecognitionListComponent implements OnInit {

  // Variable para almacenar el reconocimiento seleccionado.
  public selectedRecognition: Recognition | null = null;
  recognitions: Recognition[] = [];

  /**
   * El constructor inyecta las dependencias necesarias:
   * - MatDialogRef: para controlar el diálogo (cerrarlo, etc.).
   * - MAT_DIALOG_DATA: para recibir los datos pasados al abrir el diálogo.
   */
  constructor(
    public dialogRef: MatDialogRef<FacialRecognitionListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private facialRecognitionService: FacialRecognitionService
  ) {}



  ngOnInit(): void {
    this.facialRecognitionService.list({not_paginator: true, recent: true}).subscribe((data: any) => {
      console.log(data);
      this.recognitions = data;
    })
  }

   /**
   * Se ejecuta cuando el usuario cambia la selección en la lista.
   * @param event - El evento de cambio de selección de la lista.
   */
   onSelectionChange(event: MatSelectionListChange): void {
    // La lista no es múltiple, por lo que tomamos la primera opción seleccionada.
    const selectedOption: MatListOption = event.option;
    this.selectedRecognition = selectedOption ? selectedOption.value : null;
  }

  /**
   * Cierra el diálogo sin devolver ningún valor.
   * Se llama al hacer clic en el botón "Cancelar".
   */
  onCancel(): void {
    this.dialogRef.close();
  }

  /**
   * Cierra el diálogo y devuelve el reconocimiento seleccionado.
   * El botón "Confirmar" llama a esta función a través de [mat-dialog-close].
   * No es estrictamente necesario tener este método si solo se usa [mat-dialog-close],
   * pero es útil si se necesita lógica adicional antes de cerrar.
   */
  onConfirm(): void {
    if (this.selectedRecognition) {
      this.dialogRef.close(this.selectedRecognition);
    }
  }
  
}
