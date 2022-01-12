import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmDialogService } from '../../../componentes/confirm-dialog/confirm-dialog.service';
import { GenericTableComponent } from '../../../componentes/generic-table/generic-table.component';
import { DTColumn } from '../../../componentes/generic-table/interface';
import { ToastrService } from 'ngx-toastr';
import { DomainsService } from "../../../services/domains.service";
import { Domain } from '../../../interfaces';

@Component({
  selector: 'app-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.css']
})
export class DomainComponent implements OnInit {
  @ViewChild("table") table!: GenericTableComponent;
  columns: DTColumn[] = [];
  constructor(
    public domainsService: DomainsService,
    private router: Router,
    private dialogService: ConfirmDialogService,
    private toastr: ToastrService
  ) { }

  showCheck = () => true;

  ngOnInit(): void {
    this.columns = [
      {
        dataAttribute: "domain",
        header: "Dominio",
      },
      {
        dataAttribute: "tenant.name",
        header: "Cliente",
      },
      {
        attribute: "id",
        header: "Opciones",
        template: "opciones",
        default: 'false'
      },
    ];
  }

  update(id: string) {
    this.router.navigate(["domains", id]);
  }

  delete(domain: Domain) {
    this.dialogService.open({
      message: `Esta seguro de que desea eliminar la información de ${domain.domain}?`,
    });
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.domainsService.remove(domain.id || '').subscribe(
          (data) => {
            this.toastr.success("Dominio eliminado con exito!.");
            this.table.refresh();
          },
          (error: HttpErrorResponse) => {
            this.toastr.error(
              error.error.mesaage ||
              "No se logro eliminar el dominio"
            );
          }
        );
      }
    });
  }
}
