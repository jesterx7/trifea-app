import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { NgModule } from '@angular/core'; 
import { Router } from '@angular/router';
import { Ticket } from '../../model/ticket.type';
import { timer } from 'rxjs';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})

export class UserHomeComponent implements OnInit {
  alertVisible = false;
  schedule_list = [];
  acc_order_list = [];
  pend_order_list = [];
  acc_user_list = [];
  pend_user_list = [];
  acc_user_loc = [];
  pend_user_loc = [];

  protected map: any;
  loc_timer = timer(500, 2000);
  order_timer = timer(10000, 20000);
  trackByIdentitiy = (index: number, item: any) => item;

  acc_user_marker_url = "./assets/icons/acc-user-marker.png";
  pend_user_marker_url = "./assets/icons/user-marker.png";

  trip_list: any;
  schedule: any;

  check = false;
  searchUserSuccess = false;
  schedule_id = '';
  track_id = 0;
  current_lat = 0;
  current_lng = 0;
  zoom = 10;

  constructor(private http:HttpClient, private router: Router) {
    if (this.router.getCurrentNavigation().extras.state != null) {
      this.alertVisible = true;
      setTimeout(() => {
        this.alertVisible = false;
      }, 2000);
    }
  }

  error = false;
  error_message = '';
  trip_id = 0;
  ticketChecked = false;
  user_id = '';

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

  onCheckOutSubmit(data) {
    const httpOptions: { headers; observe; } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }),
      observe: 'response'
    };

    this.http.post('https://trifea.000webhostapp.com/api/checkout_ticket', data, httpOptions).subscribe(
    (resp) => {
      if(resp['body']['status']) {
        let ticket: Ticket = {
          schedule_id : resp['body']['schedule_id'],
          track : resp['body']['track'],
          track_id : this.schedule['track_id'],
          trip : resp['body']['trip'],
          trip_id : resp['body']['trip_id'],
          bus_type : resp['body']['type'],
          bus_fee : parseInt(resp['body']['bus_fee']),
          trip_fee : parseInt(resp['body']['trip_fee']),
          quantity : data['quantity'],
        }
        this.router.navigate(['/check_ticket'], {
          state : {
            checkTicket : ticket
          }
        });
      } else {
        this.error = true;
        this.error_message = 'No Schedule Found';
      }
    });
  }

  onConfirmOrder(order_id, user_index, infoWindow) {
    let params = new HttpParams();
    params = params.append('order_id', order_id);

    const httpOptions: { headers; observe; } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }),
      observe: 'response'
    };

    this.http.post('https://trifea.000webhostapp.com/api/update_user_order', params, httpOptions).subscribe(
    (resp) => {
      if(resp['body']['status']) {
        this.acc_order_list.push(this.pend_order_list[user_index]);
        this.acc_user_list.push(this.pend_user_list[user_index]);
        this.pend_order_list[user_index]['status'] = 'ACC';
        infoWindow.close();
      } else {
        console.log('FAILED');
      }
    });
  }

  onBoardUser(order_id, user_index, infoWindow) {
    let params = new HttpParams();
    params = params.append('order_id', order_id);

    const httpOptions: { headers; observe; } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }),
      observe: 'response'
    };

    this.http.post('https://trifea.000webhostapp.com/api/pickup_user_order', params, httpOptions).subscribe(
    (resp) => {
      if(resp['body']['status']) {
        this.acc_order_list[user_index]['status'] = 'BRD';
        infoWindow.close();
        let ticket: Ticket = {
          schedule_id : this.acc_order_list[user_index]['schedule_id'],
          track : this.acc_order_list[user_index]['track_name'],
          track_id : this.acc_order_list[user_index]['track_id'],
          trip : this.acc_order_list[user_index]['trip_name'],
          trip_id : this.acc_order_list[user_index]['trip_id'],
          bus_type : this.acc_order_list[user_index]['type_name'],
          bus_fee : parseInt(this.acc_order_list[user_index]['bus_fee']),
          trip_fee : parseInt(this.acc_order_list[user_index]['trip_fee']),
          quantity : parseInt(this.acc_order_list[user_index]['quantity']),
        }
        this.router.navigate(['/check_ticket'], {
          state : {
            checkTicket : ticket
          }
        });
      } else {
        this.error = true;
        this.error_message = 'Error Order Not Valid';
      }
    });
  }

  onDeclineOrder(order_id, user_index, infoWindow) {
    let params = new HttpParams();
    params = params.append('order_id', order_id);

    const httpOptions: { headers; observe; } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }),
      observe: 'response'
    };

    this.http.post('https://trifea.000webhostapp.com/api/decline_user_order', params, httpOptions).subscribe(
    (resp) => {
      if(resp['body']['status']) {
        this.pend_order_list[user_index]['status'] = 'DEC';
        infoWindow.close();
      } else {
        console.log('FAILED');
      }
    });
  }

  getTripDataApi(url) {
    var params = '?track=' + this.schedule['track_id'];
    this.http.get(url+params).toPromise().then(resp => {
      if (resp['status']) {
        this.trip_list = resp['data'];
      }
    });
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

  onCheckSubmit(data) {
    this.getCurrentLocation();
    const httpOptions: { headers; observe; } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }),
      observe: 'response'
    };

    this.http.post('https://trifea.000webhostapp.com/api/get_user_order', data, httpOptions).subscribe(
    (resp) => {
      if(resp['body']['status']) {
        this.schedule_id = data['schedule'];
        this.acc_order_list = resp['body']['acc_order'];
        this.pend_order_list = resp['body']['pend_order'];
        this.pend_user_list = resp['body']['pend_user_list'];
        this.acc_user_list = resp['body']['acc_user_list'];
        this.loc_timer.subscribe(val => this.intervalFunction());
        this.order_timer.subscribe(val => this.checkNewOrder());
        this.check = true;
      } else {
        this.error = true;
        this.error_message = 'No Track Found';
      }
    });
  }

  onSetSchedule(data) {
    this.setCookie('selected_schedule', data['schedule'], 1, 'USER_COOKIE');
    this.schedule_id = data['schedule'];
    if (this.schedule_id) {
      this.error = false;
    }
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

  intervalFunction() {
    if (this.pend_user_list.length > 0) this.getUserLoc(this.pend_user_list, 'pend');
    if (this.acc_user_list.length > 0) this.getUserLoc(this.acc_user_list, 'acc');
  }

  checkNewOrder() {
    let params = new HttpParams();
    params = params.append('schedule_id', this.schedule_id.toString());

    const httpOptions: { headers; observe; } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }),
      observe: 'response'
    };

    this.http.post('https://trifea.000webhostapp.com/api/get_user_order', params, httpOptions).subscribe(
    (resp) => {
      if(resp['body']['status']) {
        if (this.acc_order_list.length != resp['body']['acc_order'].length) {
          var order_list = [];
          var new_user_list = [];

          for (let i = 0; i < this.acc_user_list.length; i++) {
            new_user_list.push(this.acc_user_list[i]);
          }

          for (let i = 0; i < this.acc_order_list.length; i++) {
            order_list.push(this.acc_order_list[i]['order_id']);
          }

          for (let i = 0; i < resp['body']['acc_order'].length; i++) {
            if (!order_list.includes(resp['body']['acc_order'][i]['order_id'])) {
              this.acc_order_list.push(resp['body']['acc_order'][i]);
            }
          }

          for (let i = 0; i < resp['body']['acc_user_list'].length; i++) {
            if (!new_user_list.includes(resp['body']['acc_user_list'][i])) {
              this.acc_user_list.push(resp['body']['acc_user_list'][i]);
            }
          }
        }
        if (this.pend_order_list.length != resp['body']['pend_order'].length) {
          var order_list = [];
          var new_user_list = [];

          for (let i = 0; i < this.pend_user_list.length; i++) {
            new_user_list.push(this.pend_user_list[i]);
          }

          for (let i = 0; i < this.pend_order_list.length; i++) {
            order_list.push(this.pend_order_list[i]['order_id']);
          }

          for (let i = 0; i < resp['body']['pend_order'].length; i++) {
            if (!order_list.includes(resp['body']['pend_order'][i]['order_id'])) {
              this.pend_order_list.push(resp['body']['pend_order'][i]);
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

  identify(index, item) {
    return item.name;
  }

  mapReady(map) {
    this.map = map;
  }

  getScheduleDataApi(url) {
    var params = '?conductor_id=' + this.user_id;
    this.http.get(url+params).toPromise().then(resp => {
      if (resp['status']) {
        this.schedule_list = resp['data'];
      }
    });
  }

  getDetailSchedule(url) {
    var params = '?schedule_id=' + this.schedule_id;
    this.http.get(url+params).toPromise().then(resp => {
      if (resp['status']) {
        this.schedule = resp['data'];
        this.track_id = resp['data']['track_id'];
        this.getTripDataApi('https://trifea.000webhostapp.com/api/get_trip');
      }
    });    
  }

  checkSchedule() {
    this.schedule_id = this.getCookie('selected_schedule');
    if (this.schedule_id) {
      this.getDetailSchedule('https://trifea.000webhostapp.com/api/get_schedule_data');
      this.error = false;
    } else {
      this.error = true;
      this.error_message = 'Please Set Schedule First';
    }
  }

  ngOnInit(): void {
    this.user_id = this.getCookie('user_id');
    this.checkSchedule();
    this.getScheduleDataApi('https://trifea.000webhostapp.com/api/get_conductor_schedule');
  }
}
