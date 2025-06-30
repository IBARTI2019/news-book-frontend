import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GroupFormComponent } from '../group-form/group-form.component';
import { AccessGroupService } from '../../../../services/access-group.service';
import { PersonService } from '../../../../services/person.service';
import { AccessGroupModel, Person } from '../../../../interfaces';
import { ConfirmDialogService } from '../../../../componentes/confirm-dialog/confirm-dialog.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-access-groups',
  templateUrl: './access-group.component.html',
  styleUrls: ['./access-group.component.scss']
})
export class AccessGroupsComponent implements OnInit {
  groups: AccessGroupModel[] = [];
  loading = false;
  persons: Person[] = [];

  constructor(
    private dialog: MatDialog,
    private accessGroupService: AccessGroupService,
    private personService: PersonService,
    private dialogService: ConfirmDialogService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadGroups();
    this.loadPersons();
  }

  loadGroups() {
    this.loading = true;
    this.accessGroupService.getAll({not_paginator: true}).subscribe({
      next: (groups) => {
        this.groups = groups;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadPersons() {
    this.personService.list({not_paginator: true}).subscribe({
      next: (persons) => {
        this.persons = persons;
      }
    });
  }

  getPersonName(id: string): string {
    const person = this.persons.find(p => p.id! === id);
    return person ? person.name! : 'Unknown';
  }

  newGroup() {
    const dialogRef = this.dialog.open(GroupFormComponent, {
      width: '400px',
      data: { persons: this.persons }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.accessGroupService.create(result).subscribe(() => {
          this.toastr.success("Grupo creado con exito!.");
          this.loadGroups();
        });
      }
    });
  }

  editGroup(group: AccessGroupModel) {
    const dialogRef = this.dialog.open(GroupFormComponent, {
      width: '400px',
      data: { ...group, personsList: this.persons }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.accessGroupService.updateAccessGroup(group.id, result).subscribe(() => {
          this.toastr.success("Grupo actualizado con exito!.");
          this.loadGroups();
        });
      }
    });
  }

  deleteGroup(group: AccessGroupModel) {
    this.dialogService.open({
      message: `Esta seguro de que desea eliminar la información de ${group.name}?`,
    });
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.accessGroupService.deleteAccessGroup(group.id).subscribe(() => {
          this.toastr.success("Grupo eliminado con exito!.");
          this.loadGroups();
        });
      }
    });
  }
} 