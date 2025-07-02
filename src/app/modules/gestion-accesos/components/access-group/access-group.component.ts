import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GroupFormComponent } from '../group-form/group-form.component';
import { AccessGroupService } from '../../../../services/access-group.service';
import { AccessGroupModel } from '../../../../interfaces';
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

  constructor(
    private dialog: MatDialog,
    private accessGroupService: AccessGroupService,
    private dialogService: ConfirmDialogService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadGroups();
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
    
  newGroup() {
    const dialogRef = this.dialog.open(GroupFormComponent, {
      width: '400px',
      data: { }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadGroups();
      }
    });
  }

  editGroup(group: AccessGroupModel) {
    const dialogRef = this.dialog.open(GroupFormComponent, {
      width: '400px',
      data: { ...group }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadGroups();
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