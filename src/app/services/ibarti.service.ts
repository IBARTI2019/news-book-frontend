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

    public planned_staff(code_location?: string) {
        return this.http.get(this.URL + 'planned_staff/', {});
    }

    public oesvica_staff(code_location?: string) {
        return this.http.get(this.URL + 'oesvica_staff/', {});
    }
}