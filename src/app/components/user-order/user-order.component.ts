import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { timer } from 'rxjs';

@Component({
  selector: 'app-user-order',
  templateUrl: './user-order.component.html',
  styleUrls: ['./user-order.component.css']
})
export class UserOrderComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }

  schedule_list = [];
  acc_request_list = [];
  pend_request_list = [];
  acc_user_list = [];
  pend_user_list = [];
  acc_user_loc = [];
  pend_user_loc = [];

  protected map: any;
  loc_timer = timer(500, 2000);
  request_timer = timer(10000, 20000);
  trackByIdentitiy = (index: number, item: any) => item;

  bus_marker_url = "./assets/icons/bus-marker.png";
  acc_user_marker_url = "./assets/icons/acc-user-marker.png";
  pend_user_marker_url = "./assets/icons/user-marker.png";

  check = false;
  searchUserSuccess = false;
  schedule_id = 0;
  current_lat = 0;
  current_lng = 0;
  zoom = 10;

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

  identify(index, item) {
    return item.name;
  }

  mapReady(map) {
  	this.map = map;
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: any) => {
        if (position) {
          this.current_lat = position.coords.latitude;
          this.current_lng = position.coords.longitude;
        }
      });
    }
  }

  watchCurrentPosition() {
    navigator.geolocation.watchPosition(
      (position: any) => {
        this.current_lat = position.coords.latitude;
        this.current_lng = position.coords.longitude;
        this.updateDriverLoc();
      }
    );
  }

  setDriverLocation() {
    var currentLatlng = new google.maps.LatLng(this.current_lat, this.current_lng);
    this.map.panTo(currentLatlng);
  }

  updateDriverLoc() {
  	let params = new HttpParams();
    params = params.append('driver_id', this.getCookie('user_id'));
    params = params.append('loc_lat', this.current_lat.toString());
    params = params.append('loc_lng', this.current_lng.toString());

    const httpOptions: { headers; observe; } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }),
      observe: 'response'
    };

    this.http.post('https://trifea.000webhostapp.com/api/update_driver_loc', params, httpOptions).subscribe(
    (resp) => {});
  }

  intervalFunction() {
  	if (this.pend_user_list.length > 0) this.getUserLoc(this.pend_user_list, 'pend');
  	if (this.acc_user_list.length > 0) this.getUserLoc(this.acc_user_list, 'acc');
  }

  onCheckSubmit(data) {
  	const httpOptions: { headers; observe; } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }),
      observe: 'response'
    };

    this.http.post('https://trifea.000webhostapp.com/api/get_user_request', data, httpOptions).subscribe(
    (resp) => {
      if(resp['body']['status']) {
      	this.schedule_id = data['schedule'];
      	this.acc_request_list = resp['body']['acc_request'];
      	this.pend_request_list = resp['body']['pend_request'];
      	this.getCurrentLocation();
      	this.setDriverLocation();
      	this.watchCurrentPosition();
      	this.pend_user_list = resp['body']['pend_user_list'];
      	this.acc_user_list = resp['body']['acc_user_list'];
      	this.loc_timer.subscribe(val => this.intervalFunction());
      	this.request_timer.subscribe(val => this.checkNewRequest());
      	this.check = true;
      }
    });
  }

  checkNewRequest() {
  	let params = new HttpParams();
    params = params.append('schedule_id', this.schedule_id.toString());

  	const httpOptions: { headers; observe; } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }),
      observe: 'response'
    };

    this.http.post('https://trifea.000webhostapp.com/api/get_user_request', params, httpOptions).subscribe(
    (resp) => {
      if(resp['body']['status']) {
      	if (this.acc_request_list.length != resp['body']['acc_request'].length) {
      		var request_list = [];
      		var new_user_list = [];

      		for (let i = 0; i < this.acc_user_list.length; i++) {
      			new_user_list.push(this.acc_user_list[i]);
      		}

      		for (let i = 0; i < this.acc_request_list.length; i++) {
      			request_list.push(this.acc_request_list[i]['request_id']);
      		}

      		for (let i = 0; i < resp['body']['acc_request'].length; i++) {
      			if (!request_list.includes(resp['body']['acc_request'][i]['request_id'])) {
      				this.acc_request_list.push(resp['body']['acc_request'][i]);
      			}
      		}

      		for (let i = 0; i < resp['body']['acc_user_list'].length; i++) {
      			if (!new_user_list.includes(resp['body']['acc_user_list'][i])) {
      				this.acc_user_list.push(resp['body']['acc_user_list'][i]);
      			}
      		}
      	}
      	if (this.pend_request_list.length != resp['body']['pend_request'].length) {
      		var request_list = [];
      		var new_user_list = [];

      		for (let i = 0; i < this.pend_user_list.length; i++) {
      			new_user_list.push(this.pend_user_list[i]);
      		}

      		for (let i = 0; i < this.pend_request_list.length; i++) {
      			request_list.push(this.pend_request_list[i]['request_id']);
      		}

      		for (let i = 0; i < resp['body']['pend_request'].length; i++) {
      			if (!request_list.includes(resp['body']['pend_request'][i]['request_id'])) {
      				this.pend_request_list.push(resp['body']['pend_request'][i]);
      			}
      		}

      		for (let i = 0; i < resp['body']['pend_user_list'].length; i++) {
      			if (!new_user_list.includes(resp['body']['pend_user_list'][i])) {
      				this.pend_user_list.push(resp['body']['pend_user_list'][i]);
      			}
      		}
      	}
      	this.intervalFunction();
      }
    });
  }

  getUserLoc(user_list, status) {
  	let params = new HttpParams();
    params = params.append('user_list', user_list.join(','));

    const httpOptions: { headers; observe; } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }),
      observe: 'response'
    };

    this.http.post('https://trifea.000webhostapp.com/api/get_user_loc', params, httpOptions).subscribe(
    (resp) => {
      if(resp['body']['status']) {
        if (status == 'acc') {
        	this.acc_user_loc = resp['body']['user_loc'];
        } else {
        	this.pend_user_loc = resp['body']['user_loc'];
        }
      }
    });
  }

  getScheduleDataApi(url) {
  	var params = '?driver_id=' + this.getCookie('user_id');
  	this.http.get(url+params).toPromise().then(resp => {
  		if (resp['status']) {
  			this.schedule_list = resp['data'];
  		}
  	});
  }

  reloadPage() {
    window.location.reload();
  }

  ngOnInit(): void {
  	this.getScheduleDataApi('https://trifea.000webhostapp.com/api/get_driver_schedule');
  }

}
