import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccessGroupModel, Person } from '../../../../interfaces';
import { AccessEntryService } from '../../../../services/access-entry.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-access-entry-form',
  templateUrl: './access-form.component.html',
  styleUrls: ['./access-form.component.scss']
})
export class AccessEntryFormComponent implements OnInit {
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

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AccessEntryFormComponent>,
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
      group: ['']
    });
  }

  ngOnInit(): void {
    if (this.data && Object.keys(this.data).length) {
      this.accessForm.patchValue(this.data);
      this.persons = this.data.personsList;
      this.groups = this.data.groupsList;

      if (this.data.week_days && this.data.week_days.length) {
        const weekDaysArray = this.accessForm.get('week_days') as FormArray;
        this.weekDays.forEach(day => {
          if (this.data.week_days.includes(day.value)) {
            weekDaysArray.push(new FormControl(day.value));
          }
        });
      }
    }
    this.accessForm.get('access_type')?.valueChanges.subscribe(type => {
      if (type === this.SINGLE) {
        // Limpiar los días seleccionados cuando cambia a tipo simple
        const weekDaysArray = this.accessForm.get('week_days') as FormArray;
        weekDaysArray.clear();
      }
    });
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
  
      this.dialogRef.close(formValue);
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
} 