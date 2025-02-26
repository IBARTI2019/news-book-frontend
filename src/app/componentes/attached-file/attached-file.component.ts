import { Component, ElementRef, Input, OnDestroy, OnInit, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
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
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>; // Referencia al elemento de video

  @Input() id: string = '';
  @Input() label!: string;
  @Input() settings: AttachedFileSettings = ATTACHED_FILE_DEFAULT;
  @Input() readOnly: boolean = false;

  files: { file: File, url: SafeUrl }[] = []; // Almacena el archivo y su URL temporal

  @Input() fGRoot!: FormGroup;
  fAttachedFile!: FormGroup;
  defaultValues = { ...ATTACHED_FILE_DEFAULT };

  isCameraOpen = false; // Estado de la cámara
  mediaStream: MediaStream | null = null;
  openningCamera = false;

  constructor(private fB: FormBuilder, private sanitizer: DomSanitizer,  private cdr: ChangeDetectorRef ) { }
  
  ngOnInit(): void {

    if (this.fGRoot && this.id && this.fGRoot.get(this.id)) {
      this.fAttachedFile = this.fGRoot.get(this.id) as FormGroup;
    }
  }

   // Función para abrir la cámara
  async openCamera() {
     this.openningCamera = true
    try {
      this.isCameraOpen = true;
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.videoElement.nativeElement.srcObject = this.mediaStream;
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      alert('No se pudo acceder a la cámara. Asegúrate de permitir el acceso.');
    }
    this.openningCamera = false
  }

  // Función para capturar una imagen desde la cámara
  async captureImage() {
    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');

    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], 'captured-image.png', { type: 'image/png' });
          const url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
          this.files.push({ file, url });
          await this.updateFormControl(); // Convertir a Base64 y actualizar el control

          // Forzar la detección de cambios
          this.cdr.detectChanges();
        }
      }, 'image/png');
    }

    this.closeCamera(); // Cerrar la cámara después de capturar la imagen
  }

  // Función para cerrar la cámara
  closeCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop()); // Detener el stream de la cámara
      this.mediaStream = null;
    }
    this.isCameraOpen = false;
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
  async removeSelectedFile(index: number) {
    if (index >= 0 && index < this.files.length) {
      URL.revokeObjectURL(this.files[index]?.url as string); // Liberar la URL temporal
      this.files.splice(index, 1); // Eliminar el archivo de la lista
      await this.updateFormControl(); // Actualizar el control del formulario
    }
  }

  async onFileSelected(event: any) {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file)); // Marca la URL como segura
        this.files.push({ file, url });
      }
      await this.updateFormControl(); 
    }
  }

  async onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file)); // Marca la URL como segura
        this.files.push({ file, url });
      }
      await this.updateFormControl(); 
    }
  }

  // Función para actualizar el control del formulario
  async updateFormControl() {
    try {
      // Convertir los archivos a Base64
      const filesBase64 = await Promise.all(
        this.files.map(async (file) => {
          const base64 = await this.fileToBase64(file.file);
          return {
            name: file.file.name,
            type: file.file.type,
            base64: base64.split(',')[1] // Eliminar el prefijo "data:*/*;base64,"
          };
        })
      );
  
      // Actualizar el control del formulario con los archivos en Base64
      this.fAttachedFile.get('attachedFiles')?.setValue(filesBase64);
    } catch (error) {
      console.error('Error al convertir archivos a Base64:', error);
    }
  }

  // Función para convertir un archivo a Base64
  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Convierte el archivo a Base64
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
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
    this.closeCamera(); // Cerrar la cámara al destruir el componente
    // Liberar las URLs temporales
    this.files.forEach(file => URL.revokeObjectURL(file.url as string));
  }
}