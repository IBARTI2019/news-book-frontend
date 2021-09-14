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
}