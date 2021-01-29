import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-schedule-info',
  templateUrl: './schedule-info.component.html',
  styleUrls: ['./schedule-info.component.css']
})
export class ScheduleInfoComponent implements OnInit {
  schedule_id = '';
  schedule: any;

  constructor(private http: HttpClient) { }

  getCookie(name: string) {
    let ca: Array<string> = document.cookie.split(';');
    let caLen: number = ca.length;
    let cookieName = `${name}=`;
    let c: string;

    for (let i: number = 0; i < caLen; i += 1) {
      c = ca[i].replace(/^\s+/g, '');
      if (c.indexOf(cookieName) == 0) {
        return c.substring(cookieName.length, c.length);
      }
    }
    return '';
  }

  getScheduleDataApi(url) {
    var params = '?schedule_id=' + this.schedule_id;
    this.http.get(url+params).toPromise().then(resp => {
      if (resp['status']) {
        this.schedule = resp['data'];
      }
    });
  }

  ngOnInit(): void {
    this.schedule_id = this.getCookie('selected_schedule');
    this.getScheduleDataApi('https://trifea.000webhostapp.com/api/get_schedule_data');
  }

}
