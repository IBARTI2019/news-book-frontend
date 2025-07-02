import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccessGroupModel, Person } from '../../../../interfaces';
import { AccessEntryService } from '../../../../services/access-entry.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ToastrService } from 'ngx-toastr';
import { startWith, map } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PersonService } from '../../../../services/person.service';
import { AccessGroupService } from '../../../../services/access-group.service';

@Component({
  selector: 'app-access-entry-form',
  templateUrl: './access-form.component.html',
  styleUrls: ['./access-form.component.scss']
})
export class AccessEntryFormComponent implements OnInit, OnDestroy {
  accessForm: FormGroup;


  persons: Person[] = [];
  groups: AccessGroupModel[] = [];  

  RECURRING = AccessEntryService.RECURRING;
  SINGLE = AccessEntryService.SINGLE;
  weekDays = AccessEntryService.weekDays;

  accessTypes = [
    { value: this.SINGLE, label: 'Simple' },
    { value: this.RECURRING, label: 'Recurrente' }
  ];

  isMonthMode = false; // false = días de la semana, true = días del mes

  personSearchCtrl = new FormControl('');
  filteredPersons: Person[] = [];
  selectedPersons: Person[] = [];

  descriptionSearchCtrl = new FormControl('');

  previewUrl: SafeUrl | string | null | any = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AccessEntryFormComponent>,
    private accessEntryService: AccessEntryService,
    private toast: ToastrService,
    private sanitizer: DomSanitizer,
    private personService: PersonService,
    private accessGroupService: AccessGroupService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.accessForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      access_type: [this.SINGLE, Validators.required],
      date_start: [null],
      date_end: [null],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
       week_days: this.fb.array([]), 
      persons: [[]],
      group: [''],
      specific_days: [[]],
      voucher: [null]
    });
  }

  ngOnInit(): void {
    this.loadPersons();
    this.loadGroups();
    
    if (this.data && Object.keys(this.data).length) {
      delete this.data.voucher;
      this.accessForm.patchValue(this.data);

      // Inicializar personas seleccionadas si ya hay
      if (this.data.persons && this.data.persons.length) {
        this.selectedPersons = this.data.persons_display;
        this.accessForm.get('persons')?.setValue(this.data.persons);
      }
      // Filtrado inicial tras cargar persons
      this.filteredPersons = this._filterPersons('');
      if (this.data.week_days && this.data.week_days.length) {
        const weekDaysArray = this.accessForm.get('week_days') as FormArray;
        this.weekDays.forEach(day => {
          if (this.data.week_days.includes(day.value)) {
            weekDaysArray.push(new FormControl(day.value));
          }
        });
      }
      // Si viene specific_days, activar modo mes
      if (this.data.specific_days && this.data.specific_days.length) {
        this.isMonthMode = true;
      }
    }
    this.accessForm.get('access_type')?.valueChanges.subscribe(type => {
      if (type === this.SINGLE) {
        // Limpiar los días seleccionados cuando cambia a tipo simple
        const weekDaysArray = this.accessForm.get('week_days') as FormArray;
        weekDaysArray.clear();
        this.isMonthMode = false;
      }
    });
    // Filtrado reactivo
    this.personSearchCtrl.valueChanges.pipe(
      startWith(''),
      map(value => {
        return this._filterPersons(value)
      })  
    ).subscribe(filtered => this.filteredPersons = filtered);
  }

  loadPersons() {
    this.personService.list({not_paginator: true, requires_access_verification: true}).subscribe({
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

  personsWithCompany = () => this.persons.filter(p => p.company !== null && p.company !== undefined && p.company !== '' && p.company !== 'null' && p.company !== 'undefined'  );

  selectDescription(company: string) {
    this.accessForm.get('description')?.setValue(company);
  }

  private _filterPersons(value: string): Person[] {
    const filterValue = value && typeof value === 'string' ? value.toLowerCase() : '';
    return this.persons.filter(person =>
      (person.name && person.name?.toLowerCase().includes(filterValue)) ||
      (person.last_name && person.last_name?.toLowerCase().includes(filterValue)) ||
      (person.doc_ident && person.doc_ident?.toLowerCase().includes(filterValue)) ||
      (person.identification_number && person.identification_number?.toLowerCase().includes(filterValue))
    ).filter(p => !this.selectedPersons.some(sel => sel.id === p.id));
  }

  selectPerson(person: Person) {
    if (!this.selectedPersons.some(p => p.id === person.id)) {
      this.selectedPersons.push(person);
      this.accessForm.get('persons')?.setValue(this.selectedPersons.map(p => p.id));
      this.personSearchCtrl.setValue('');
    }
  }

  removePerson(person: Person) {
    this.selectedPersons = this.selectedPersons.filter(p => p.id !== person.id);
    this.accessForm.get('persons')?.setValue(this.selectedPersons.map(p => p.id));
  }

  addPersonFromInput(event: any) {
    // No se usa, pero se deja para compatibilidad con chips
    this.personSearchCtrl.setValue('');
  }

  onSubmit() {
    if (this.accessForm.valid) {
      const formValue = this.accessForm.value;
      
      // Formatear fechas a YYYY-MM-DD
      if (formValue.date_start) {
        formValue.date_start = this.formatDate(formValue.date_start);
      }
      if (formValue.date_end) {
        formValue.date_end = this.formatDate(formValue.date_end);
      }

      let formDate = new FormData();
      formDate.append('title', formValue.title);
      formDate.append('description', formValue.description);
      formDate.append('access_type', formValue.access_type);
      formDate.append('date_start', formValue.date_start || '');
      formDate.append('date_end', formValue.date_end || '');
      formDate.append('start_time', formValue.start_time || '');
      formDate.append('end_time', formValue.end_time || '');

      formDate.append('week_days', JSON.stringify(formValue.week_days));
      formDate.append('specific_days', JSON.stringify(formValue.specific_days));
    
      if (formValue.persons && formValue.persons.length) {
        formValue.persons.forEach((person: string) => {
          formDate.append('persons', person);
        });
      }

      if (formValue.group) {
        formDate.append('group', formValue.group);
      }
      debugger;
      if (formValue.voucher) {
        formDate.append('voucher', formValue.voucher);
      }

      if (this.data.id) {
      this.accessEntryService.updateAccessEntry(this.data.id, formDate).subscribe(() => {
        this.toast.success('Acceso actualizado correctamente');
        this.dialogRef.close(formValue);
        }, error => {
          this.toast.error('Error al actualizar el acceso');
        });
      } else {
        this.accessEntryService.create(formDate).subscribe(() => {
          this.toast.success('Acceso creado correctamente');
          this.dialogRef.close(formValue);
        }, error => {
          this.toast.error('Error al crear el acceso');
        });
      }
    }
  }

  private formatDate(date: Date | string): string {
    if (!date) return '';
    
    let d: Date;
    if (typeof date === 'string') {
      d = new Date(date);
    } else {
      d = date;
    }
    
    return d.toISOString().split('T')[0];
  }

  onCancel() {
    this.dialogRef.close();
  }

  daysOfMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  
  getWeekDayControl(dayValue: string): FormControl {
    const weekDaysArray = this.accessForm.get('week_days') as FormArray;
    const index = weekDaysArray.value.indexOf(dayValue);
    return new FormControl(index !== -1);
  }
  
  // Método para manejar cambios en los checkboxes
  onWeekDayChange(event: MatCheckboxChange, dayValue: string): void {
    const weekDaysArray = this.accessForm.get('week_days') as FormArray;
    
    if (event.checked) {
      weekDaysArray.push(new FormControl(dayValue));
    } else {
      const index = weekDaysArray.value.indexOf(dayValue);
      if (index >= 0) {
        weekDaysArray.removeAt(index);
      }
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Limpiar la URL anterior si existe
      this.cleanUpPreviewUrl();
      
      // Validaciones de tipo y tamaño
      if (!file.type.match('image.*')) {
        this.toast.warning('Solo se permiten imágenes');
        return;
      }
      
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        this.toast.warning('El archivo es demasiado grande (máx. 10MB)');
        return;
      }
      
      // Actualizar formulario
      this.accessForm.patchValue({ voucher: file });
      this.accessForm.get('voucher')?.updateValueAndValidity();
      
      // Generar URL segura
      const blobUrl = URL.createObjectURL(file);
      this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(blobUrl);
    }
  }
  
  private cleanUpPreviewUrl() {
    if (this.previewUrl) {
      // Revocar la URL previa si es un string (blob URL)
      if (typeof this.previewUrl === 'string') {
        URL.revokeObjectURL(this.previewUrl);
      } else if (this.previewUrl && typeof this.previewUrl['changingThisBreaksApplicationSecurity'] === 'string') {
        // Extraer la URL real del SafeUrl (Angular la guarda en la propiedad interna 'changingThisBreaksApplicationSecurity')
        URL.revokeObjectURL(this.previewUrl['changingThisBreaksApplicationSecurity']);
      }
      this.previewUrl = null;
    }
  }
  
  getImagePreview(): SafeUrl | string | null {
    const file = this.accessForm.get('voucher')?.value;
    if (file instanceof File) {
      return this.previewUrl;
    }

    if (this.data.voucher_display) {
      return this.data.voucher_display;
    }
    return file; // URL existente en modo edición
  }
  
  ngOnDestroy() {
    this.cleanUpPreviewUrl();
  }
} 