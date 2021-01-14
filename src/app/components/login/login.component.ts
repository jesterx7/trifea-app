import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  constructor(private http:HttpClient, private router: Router) { }

  onLoginSubmit(data) {
  	const httpOptions: { headers; observe; } = {
  		headers: new HttpHeaders({
  			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  		}),
  		observe: 'response'
  	};

  	this.http.post('https://trifea.000webhostapp.com/api/login_employee', data, httpOptions).subscribe(
  	(resp) => {
  		if(resp['body']['status']) {
        this.setCookie('user_id', resp['body']['user_id'].toString(), 1, 'USER_COOKIE');
  			this.setCookie('name', resp['body']['name'], 1, 'USER_COOKIE');
  			this.setCookie('email', resp['body']['email'], 1, 'USER_COOKIE');
        this.setCookie('address', resp['body']['address'], 1, 'USER_COOKIE');
        this.setCookie('phone_number', resp['body']['phone_number'], 1, 'USER_COOKIE');
        this.setCookie('occupation_name', resp['body']['occupation_name'], 1, 'USER_COOKIE');
        this.setCookie('occupation_id', resp['body']['occupation_id'], 1, 'USER_COOKIE');
        window.location.href = '/';
  		}
  	});
  }
  
  setCookie(name: string, value: string, expireDays: number, path: string = '') {
  	let d:Date = new Date();
  	d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
  	const expires = `expires=${d.toUTCString()}`;
  	const cpath = path ? `; path=${path}` : '';
  	document.cookie = `${name}=${value}; ${expires}${cpath}; SameSite=Lax`;
  }

  ngOnInit(): void {
  }
}
