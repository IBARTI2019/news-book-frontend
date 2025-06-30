import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Person } from '../../../../interfaces';

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.scss']
})
export class GroupFormComponent implements OnInit {
  groupForm: FormGroup;
  persons: Person[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<GroupFormComponent>,
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
      if (data.personsList) {
        this.persons = data.personsList;
      }
    }
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.groupForm.valid) {
      this.dialogRef.close(this.groupForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
} 