import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QuestionBaseParams } from '../interfaces';
import { API } from '../utils/api';

@Injectable({
  providedIn: 'root'
})
export class serviceficha extends API<QuestionBaseParams> {
  protected URL = `${this.URL_API}/setting/ibarti/valid_ficha/`;
  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }

  ficha(data:string): Observable<any> {
    return this.http.get(this.URL+'?ficha='+data);


}
}
