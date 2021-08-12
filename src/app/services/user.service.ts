import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API } from '../utils/api';
import { User } from '../interfaces'

@Injectable({
    providedIn: 'root'
})
export class UserService extends API<User> {
    protected URL = `${this.URL_API}/security/user`;
    constructor(
        protected http: HttpClient,
    ) {
        super(http);
    }
}
