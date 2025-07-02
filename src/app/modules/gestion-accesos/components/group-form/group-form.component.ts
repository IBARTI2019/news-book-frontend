import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Person } from '../../../../interfaces';
import { ToastrService } from 'ngx-toastr';
import { startWith, map } from 'rxjs/operators';
import { PersonService } from '../../../../services/person.service';
import { AccessGroupService } from '../../../../services/access-group.service';

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.scss']
})
export class GroupFormComponent implements OnInit {
  groupForm: FormGroup;
  persons: Person[] = [];

  personSearchCtrl = new FormControl('');
  filteredPersons: Person[] = [];
  selectedPersons: Person[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<GroupFormComponent>,
    private toast: ToastrService,
    private personService: PersonService,
    private accessGroupService: AccessGroupService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.groupForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      persons: [[]]
    });
    if (data) {
      this.groupForm.patchValue({
        name: data.name,
        description: data.description,
        persons: Array.isArray(data.persons) ? [...data.persons] : []
      });
    }
  }

  ngOnInit(): void {
    this.loadPersons();
    if (this.data.persons && this.data.persons.length) {
      this.selectedPersons = this.data.persons_display;
      this.groupForm.get('persons')?.setValue(this.selectedPersons.map(p => p.id));
    }
    // Filtrado inicial tras cargar persons
    this.filteredPersons = this._filterPersons('');
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

  onSubmit() {
    if (this.groupForm.valid) {
      if (this.data.id) {
        this.accessGroupService.updateAccessGroup(this.data.id, this.groupForm.value).subscribe(() => {
          this.toast.success("Grupo actualizado con exito!.");
          this.dialogRef.close(this.groupForm.value);
        }, (error) => {
          this.toast.error(error.error.message);
        });
      } else {
        this.accessGroupService.create(this.groupForm.value).subscribe(() => {
          this.toast.success("Grupo creado con exito!.");
          this.dialogRef.close(this.groupForm.value);
        }, (error) => {
          this.toast.error(error.error.message);
        });
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
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
    this.selectedPersons.push(person);
    this.groupForm.get('persons')?.setValue(this.selectedPersons.map(p => p.id));
    this.personSearchCtrl.setValue('');
  }

  removePerson(person: Person) {
    const index = this.selectedPersons.indexOf(person);
    if (index >= 0) {
      this.selectedPersons.splice(index, 1);
      this.groupForm.get('persons')?.setValue(this.selectedPersons.map(p => p.id));
    }
  }

  addPersonFromInput(event: any) {
    // No se usa, pero se deja para compatibilidad con chips
    this.personSearchCtrl.setValue('');
  }
} 