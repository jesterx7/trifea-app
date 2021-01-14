import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-jadwal',
  templateUrl: './jadwal.component.html',
  styleUrls: ['./jadwal.component.css']
})
export class JadwalComponent implements OnInit {

  schedule_list = [];
  constructor(private router: Router, private http: HttpClient) { }

  getScheduleDataApi(url) {
  	this.http.get(url).toPromise().then(resp => {
  		if (resp['status']) {
  			this.schedule_list = resp['data'];
  		}
  	});
  }
  ngOnInit(): void {
  	this.getScheduleDataApi('https://trifea.000webhostapp.com/api/get_employee_schedule');
  }

}
