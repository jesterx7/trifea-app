import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(private http:HttpClient) { }

  name: String;
  email: String;
  address: String;
  phone: String;

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

  setCookie(name: string, value: string, expireDays: number, path: string = '') {
  	let d:Date = new Date();
  	d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
  	const expires = `expires=${d.toUTCString()}`;
  	const cpath = path ? `; path=${path}` : '';
  	document.cookie = `${name}=${value}; ${expires}${cpath}; SameSite=Lax`;
  }

  onUpdateForm(data) {
  	const httpOptions: { headers; observe; } = {
  		headers: new HttpHeaders({
  			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  		}),
  		observe: 'response'
  	};

  	this.http.post('https://trifea.000webhostapp.com/api/update_employee_profile', data, httpOptions).subscribe(
  	(resp) => {
      console.log(resp);
  		if(resp['body']['status']) {
  			window.location.href = '/profile';
  			this.setCookie('address', data.address, 1, 'USER_COOKIE');
  			this.setCookie('phone_number', data.phone_number, 1, 'USER_COOKIE');
  		}
  	});
  }

  ngOnInit(): void {
  	this.name = this.getCookie("name");
  	this.email = this.getCookie("email");
  	this.address = this.getCookie("address");
  	this.phone = this.getCookie("phone_number");
  }

}
