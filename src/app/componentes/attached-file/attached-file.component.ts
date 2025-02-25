import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AttachedFileSettings } from '../../interfaces';
import { FormBuilder, FormGroup } from '@angular/forms';

export const ATTACHED_FILE_DEFAULT: AttachedFileSettings = {
  percentage: 100
};

@Component({
  selector: 'app-attached-file',
  templateUrl: './attached-file.component.html',
  styleUrls: ['./attached-file.component.css']
})
export class AttachedFileComponent implements OnInit, OnDestroy {
  
  @Input() id: string = '';
  @Input() label!: string;
  @Input() settings: AttachedFileSettings = ATTACHED_FILE_DEFAULT;
  @Input() readOnly: boolean = false;

  files: { file: File, url: SafeUrl }[] = []; // Almacena el archivo y su URL temporal
  @Input() urlFiles: { name: string, url: string }[] = [];

  @Input() fGRoot!: FormGroup;
  fAttachedFile!: FormGroup;
  defaultValues = { ...ATTACHED_FILE_DEFAULT };

  constructor(private fB: FormBuilder, private sanitizer: DomSanitizer) { }
  
  ngOnInit(): void {

    if (this.fGRoot && this.id && this.fGRoot.get(this.id)) {
      this.fAttachedFile = this.fGRoot.get(this.id) as FormGroup;
    }
  }

  // Función para verificar si una URL es una imagen
  isImage(url: string): boolean {
    return /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i.test(url);
  }

  isPdf(url: string): boolean {
    return /\.pdf$/i.test(url);
  }

  // Función para generar una URL de un archivo
  getFileUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  // Función para eliminar un archivo seleccionado
  removeSelectedFile(index: number) {
    if (index >= 0 && index < this.files.length) {
      URL.revokeObjectURL(this.files[index].url as string); // Liberar la URL temporal
      this.files.splice(index, 1); // Eliminar el archivo de la lista
      this.updateFormControl(); // Actualizar el control del formulario
    }
  }

  onFileSelected(event: any) {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file)); // Marca la URL como segura
        this.files.push({ file, url });
      }
      this.updateFormControl(); 
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file)); // Marca la URL como segura
        this.files.push({ file, url });
      }
      this.updateFormControl(); 
    }
  }

  // Función para actualizar el control del formulario
  updateFormControl() {
    const files = this.files.map(f => f.file); // Obtener solo los archivos (sin las URLs)
    this.fAttachedFile.get('attachedFiles')?.setValue(files); // Actualizar el control
  }
  
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }


  ngOnChanges(change: SimpleChanges): void {
    if (change.settings && change.settings.firstChange) {
      this.settings = change.settings.currentValue || {
        ...ATTACHED_FILE_DEFAULT,
      }
    } else if (change.settings && !change.settings.currentValue) {
      this.settings = {
        ...ATTACHED_FILE_DEFAULT,
      }
    }
  }

  ngOnDestroy() {
    // Liberar las URLs temporales
    this.files.forEach(file => URL.revokeObjectURL(file.url as string));
  }
}