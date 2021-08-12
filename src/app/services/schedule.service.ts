import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Schedule } from '../interfaces';
import { API } from '../utils/api'

@Injectable({
  providedIn: 'root'
})
export class ScheduleService extends API<Schedule> {
  protected URL = `${this.URL_API}/main/schedule/`;
  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }
}
