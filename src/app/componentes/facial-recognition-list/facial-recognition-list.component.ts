import { Component, OnInit, Inject } from "@angular/core";
import { FacialRecognitionService } from "../../services/facial-recognition.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatListOption, MatSelectionListChange } from "@angular/material/list";
import { DatePipe } from "@angular/common";

export interface Recognition {
  id: number;
  user_id: string;
  event_time: string;
  raw_data: any;
  movement_type: "IN" | "OUT";
  created_at: string;
  location: string | null;
  user_name: string;
}

export interface DialogData {
  recognitions: Recognition[];
}

@Component({
  selector: "app-facial-recognition-list",
  templateUrl: "./facial-recognition-list.component.html",
  styleUrls: ["./facial-recognition-list.component.css"],
})
export class FacialRecognitionListComponent implements OnInit {
  // Variable para almacenar el reconocimiento seleccionado.
  public selectedRecognition: Recognition | null = null;
  recognitions: Recognition[] = [];
  filteredRecognitions: Recognition[] = [];
  searchTerm: string = "";

  /**
   * El constructor inyecta las dependencias necesarias:
   * - MatDialogRef: para controlar el diálogo (cerrarlo, etc.).
   * - MAT_DIALOG_DATA: para recibir los datos pasados al abrir el diálogo.
   */
  constructor(
    public dialogRef: MatDialogRef<FacialRecognitionListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private facialRecognitionService: FacialRecognitionService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.facialRecognitionService
      .list({ not_paginator: true, recent: true })
      .subscribe((data: any) => {
        console.log(data);
        this.recognitions = data;
        this.filteredRecognitions = [...this.recognitions];

        // Si vienen datos del diálogo, usarlos
        if (this.data?.recognitions?.length) {
          this.recognitions = this.data.recognitions;
          this.filteredRecognitions = [...this.recognitions];
        }
      });
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

  applyFilter(): void {
    if (!this.searchTerm) {
      this.filteredRecognitions = [...this.recognitions];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();

    this.filteredRecognitions = this.recognitions.filter((recognition) => {
      return (
        recognition.user_id.toLowerCase().includes(searchTermLower) ||
        (recognition.location &&
          recognition.location.toLowerCase().includes(searchTermLower)) ||
        recognition.movement_type.toLowerCase().includes(searchTermLower) ||
        this.datePipe
          .transform(recognition.event_time, "medium")
          ?.toLowerCase()
          .includes(searchTermLower) ||
        false
      );
    });
  }

  clearSearch(): void {
    this.searchTerm = "";
    this.applyFilter();
  }
}
