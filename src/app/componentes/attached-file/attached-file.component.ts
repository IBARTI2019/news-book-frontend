import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  @Input() id: string = '';
  @Input() label: string = 'Subir archivos';
  @Input() settings: AttachedFileSettings = ATTACHED_FILE_DEFAULT;
  @Input() readOnly: boolean = false;

  files: { file: File, url: SafeUrl }[] = [];
  isDragActive = false;

  @Input() fGRoot!: FormGroup;
  fAttachedFile!: FormGroup;
  defaultValues = { ...ATTACHED_FILE_DEFAULT };

  isCameraOpen = false;
  mediaStream: MediaStream | null = null;
  usingFrontCamera = true;
  isMultipleCameras = false;
  availableCameras: MediaDeviceInfo[] = [];

  constructor(
    private fB: FormBuilder,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    if (this.fGRoot && this.id && this.fGRoot.get(this.id)) {
      this.fAttachedFile = this.fGRoot.get(this.id) as FormGroup;
    }
    this.detectCameras();
  }

  getFileIcon(filename: string): string {
    if (this.isImage(filename)) return 'image';
    if (this.isPdf(filename)) return 'picture_as_pdf';
    return 'insert_drive_file';
  }

  async detectCameras() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.availableCameras = devices.filter(device => device.kind === 'videoinput');
      this.isMultipleCameras = this.availableCameras.length > 1;
    } catch (error) {
      console.error('Error al detectar cámaras:', error);
      this.isMultipleCameras = false;
    }
  }

  async openCamera() {
    try {
      this.isCameraOpen = true;
      const constraints = {
        video: {
          facingMode: this.usingFrontCamera ? 'user' : 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.videoElement.nativeElement.srcObject = this.mediaStream;
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      this.isCameraOpen = false;
    }
  }

  async switchCamera() {
    if (!this.isMultipleCameras) return;

    this.usingFrontCamera = !this.usingFrontCamera;
    this.closeCamera();
    await this.openCamera();
  }

  captureImage() {
    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');

    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        if (blob) {
          const file = new File([blob], `captura-${new Date().getTime()}.png`, { type: 'image/png' });
          const url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
          this.files.push({ file, url });
          this.cdr.detectChanges();
          this.updateFormControl();
        }
      }, 'image/png');
    }

    this.closeCamera();
  }

  closeCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    this.isCameraOpen = false;
  }

  isImage(filename: string): boolean {
    return /\.(jpe?g|png|gif|bmp|webp|svg)$/i.test(filename);
  }

  isPdf(filename: string): boolean {
    return /\.pdf$/i.test(filename);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        const url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
        this.files.push({ file, url });
      }
      this.updateFormControl();
      input.value = ''; // Reset input para permitir seleccionar el mismo archivo otra vez
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragActive = false;

    if (event.dataTransfer?.files) {
      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        const file = event.dataTransfer.files[i];
        const url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
        this.files.push({ file, url });
      }
      this.updateFormControl();
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragActive = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragActive = false;
  }

  removeSelectedFile(index: number) {
    if (index >= 0 && index < this.files.length) {
      URL.revokeObjectURL(this.files[index].url as string);
      this.files.splice(index, 1);
      this.cdr.detectChanges();
      this.updateFormControl();
    }
  }

  async updateFormControl() {
    try {
      const filesBase64 = await Promise.all(
        this.files.map(async file => {
          const base64 = await this.fileToBase64(file.file);
          return {
            name: file.file.name,
            type: file.file.type,
            base64: base64.split(',')[1]
          };
        })
      );

      this.fAttachedFile.get('attachedFiles')?.setValue(filesBase64);
    } catch (error) {
      console.error('Error converting files to Base64:', error);
    }
  }

  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  ngOnDestroy() {
    this.closeCamera();
    this.files.forEach(file => URL.revokeObjectURL(file.url as string));
  }
}