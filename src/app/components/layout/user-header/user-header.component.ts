import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})
export class UserHeaderComponent implements OnInit {
  name:string = '';
  isCondectur = false;
  constructor(private router:Router) { }

  setCookie(name: string, value: string, expireDays: number, path: string = '') {
  	let d:Date = new Date();
  	d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
  	const expires = `expires=${d.toUTCString()}`;
  	const cpath = path ? `; path=${path}` : '';
  	document.cookie = `${name}=${value}; ${expires}${cpath}; SameSite=Lax`;
  }

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

  deleteCookie(name) {
  	this.setCookie(name, '', -1);
  }

  onLogoutSubmit() {
  	this.deleteCookie('name');
  	this.deleteCookie('email');

  	window.location.href = '/';
  }

  ngOnInit(): void {
  	this.name = this.getCookie('name');
    if (this.getCookie('occupation_id') == '3') {
		this.isCondectur = true;
		this.router.navigate(['bus']);
    } else {
		this.router.navigate(['request']);
    }
  }

}
