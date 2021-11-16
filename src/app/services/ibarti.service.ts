import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API } from '../utils/api'

@Injectable({
    providedIn: 'root'
})
export class IbartiService extends API<any> {
    protected URL = `${this.URL_API}/setting/ibarti/`;
    constructor(
        protected http: HttpClient,
    ) {
        super(http);
    }

    public planned_staff() {
        return this.http.get(this.URL + 'planned_staff/', {});
    }

    public oesvica_staff() {
        return this.http.get(this.URL + 'oesvica_staff/', {});
    }

    public sub_line_scope() {
        return this.http.get(this.URL + 'sub_line_scope/', {});
    }
}