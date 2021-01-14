import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'bus-app';
  login = false;

  constructor(updates: SwUpdate, private router: Router) {
  	updates.available.subscribe(evet => {
  		updates.activateUpdate().then(() => document.location.reload());		
  	});
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

  ngOnInit(): void {
  	var name = this.getCookie('name');
  	if(name) {
      this.login = true;
      this.router.navigate(['bus']);
  	}
  }
}
