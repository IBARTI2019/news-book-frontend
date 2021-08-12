import { Injectable } from '@angular/core';
import { API } from '../utils/api';
import { GroupUser } from '../interfaces'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserGroupService extends API<GroupUser>{
  protected URL = `${this.URL_API}/security/group/`;
  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }
}
