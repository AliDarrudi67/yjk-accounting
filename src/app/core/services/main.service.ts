import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import moment from 'jalali-moment';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  baseUrl = environment.baseUrl;
  defaultDialogConfig = {
    disableClose: false,
    autoFocus: false,
    minWidth: '350px',
    maxHeight: '80vh',
    maxWidth: '95vw',
    panelClass: 'custom-dialog',
    data: {},
  };
  token = '';
  adminInfo = signal<any>({});
  options = signal<any>([]);
  showSidebar = signal<boolean>(true);

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
  ) {
    this.token = localStorage.getItem('token')!;
  }

  get(
    endPoint: string,
    queryString: any = { token: this.token },
  ): Observable<any> {
    this.token = localStorage.getItem('token')!;
    return this.http.get(this.baseUrl + endPoint, {
      params: this.prepareQueryString(queryString),
    });
  }

  prepareQueryString(queryString: any) {
    let params = new HttpParams();
    const fields = Object.keys(queryString);
    fields.forEach((item) => {
      if (queryString[item] && queryString[item] !== -1)
        params = params.append(item, queryString[item]);
    });
    return params;
  }

  post(endPoint: string, data: any): Observable<any> {
    this.token = localStorage.getItem('token')!;
    return this.http.post(
      this.baseUrl + endPoint + `?token=${this.token}`,
      data,
    );
  }

  delete(endPoint: string, id: number) {
    this.token = localStorage.getItem('token')!;
    return this.http.get(
      this.baseUrl + endPoint + `?id=${id}&token=${this.token}`,
    );
  }

  getFormData(form: any, type = 'form') {
    let fields: any;
    if (type !== 'form') {
      fields = Object.keys(form);
      const formData = new FormData();
      fields.forEach((item: any) => {
        formData.append(item, form[item]);
      });
      return formData;
    } else {
      fields = Object.keys(form.value);
      const formData = new FormData();
      fields.forEach((item: any) => {
        formData.append(item, form.get(item).value);
      });
      return formData;
    }
  }

  getFormDataObject(object: any) {
    const fields = Object.keys(object);
    const formData = new FormData();
    fields.forEach((item) => {
      formData.append(item, object[item]);
    });
    return formData;
  }

  formatDuration(seconds: number): string {
    // رند کردن ثانیه‌ها
    seconds = Math.round(seconds);

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    // ساختن خروجی پویا
    const parts: string[] = [];

    if (h > 0) {
      parts.push(this.pad(h));
    }

    if (m > 0 || h > 0) {
      parts.push(this.pad(m));
    }

    // ثانیه همیشه هست:
    parts.push(this.pad(s));

    return parts.join(':');
  }

  pad(num: number): string {
    return num.toString().padStart(2, '0');
  }

  back() {
    window.history.back();
  }

  success(message: string) {
    this.toastr.success(message);
  }

  error(message: string) {
    this.toastr.error(message);
  }

  normalizeDate(input: any): string {
    // اگر Date object بود
    if (input instanceof Date) {
      return moment(input).format('YYYY-MM-DD');
    }

    // اگر رشته میلادی بود
    if (typeof input === 'string' && isNaN(Date.parse(input)) === false) {
      return moment(new Date(input)).format('YYYY-MM-DD');
    }

    // اگر فارسی (جلالی) بود → مثل ۱۴۰۵/۰۳/۲۴
    if (typeof input === 'string') {
      const m = moment.from(input, 'fa', 'jYYYY/jMM/jDD');
      if (m.isValid()) {
        return m.format('YYYY-MM-DD');
      }
    }

    // در غیر این صورت هم میلادی استاندارد بساز
    return moment(input).format('YYYY-MM-DD');
  }
}
