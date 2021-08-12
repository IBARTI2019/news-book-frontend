import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationSetting } from '../interfaces';
import { API } from '../utils/api'

@Injectable({
  providedIn: 'root'
})
export class SettingNotificationService extends API<NotificationSetting> {
  public static readonly TYPE_RECURRENT = 0;
  public static readonly TYPE_OBLIGATORY = 1;
  public static readonly FREQUENCY_EVERY_DAY = 1;  // Todos los días
  public static readonly FREQUENCY_JUST_ONE_DAY = 2; // Solo un día
  public static readonly FREQUENCY_MORE_THAN_ONE_DAY = 3 // Mas de un dia
  public static readonly FREQUENCY_BY_DAY_DAYS = 4 // Dias por semana

  protected URL = `${this.URL_API}/setting/notification/`;
  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }
}
