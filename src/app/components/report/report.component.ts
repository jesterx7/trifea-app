import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  report_data : any;
  sales_data = [];
  total_income = 0;
  user_id = '';

  constructor(private http: HttpClient, private router: Router) {}

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

  buildData() {
  	let _sales = [];
    this.sales_data = [];
    this.total_income = 0;
  	this.report_data.forEach((data, index)=>{
  		if (_sales.indexOf(data.track_id) == -1) {
  			let new_data = [];
  			_sales.push(data.track_id);
	  		new_data.push(data.track_name);
	  		new_data.push(0);
	  		new_data.push(0);
	  		this.report_data.forEach((childData, childIndex)=> {
	  			if (data.track_id == childData.track_id) {
	  				new_data[1] += childData.quantity;
	  				new_data[2] += childData.quantity * childData.trip_fee;
            this.total_income += childData.quantity * childData.trip_fee;
	  			}
	  		});
	  		this.sales_data.push(new_data);
  		}
  	});
  }

  onSearchForm(data) {
    const httpOptions: { headers; observe; } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }),
      observe: 'response'
    };

    this.http.post('https://trifea.000webhostapp.com/api/get_report_by_date', data, httpOptions).subscribe(
    (resp) => {
      if(resp['body']['status']) {
        this.report_data = resp['body']['data'];
        this.buildData();
      }
    });
  }

  getReportDataAllTime() {
    this.http.get("https://trifea.000webhostapp.com/api/get_report?user_id=" + this.user_id).toPromise().then(resp => {
        this.report_data = resp;
        this.buildData();
      }
    );
  }

  getReportDataToday() {
    this.http.get("https://trifea.000webhostapp.com/api/get_report_today?user_id=" + this.user_id).toPromise().then(resp => {
        this.report_data = resp;
        this.buildData();
      }
    );
  }

  ngOnInit(): void {
    this.getReportDataToday();
    this.user_id = this.getCookie('user_id');
  }

}
