import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  name: string = '';
  email: string = '';
  	
  constructor() { }

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

  ngOnInit(): void {
  	var name = this.getCookie('name');
  	var email = this.getCookie('email')
  	if(name && email) {
  		this.name = name;
  		this.email = email;
  	}
  }

}
