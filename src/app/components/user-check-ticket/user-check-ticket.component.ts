import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Ticket } from '../../model/ticket.type';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-check-ticket',
  templateUrl: './user-check-ticket.component.html',
  styleUrls: ['./user-check-ticket.component.css']
})
export class UserCheckTicketComponent implements OnInit {
  ticket: Ticket;
  constructor(private router: Router, private http: HttpClient, private loc: Location) { 
  	this.ticket = this.router.getCurrentNavigation().extras.state.checkTicket;
  }

  backClicked() {
    this.loc.back();
  }

  onConfirmTicket() {
  	var body = 'schedule_id=' + this.ticket.schedule_id + '&trip_id=' + this.ticket.trip_id + '&quantity=' + this.ticket.quantity.toString();

  	const httpOptions: { headers; observe; } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }),
      observe: 'response'
    };

  	this.http.post('https://trifea.000webhostapp.com/api/buy_ticket', body, httpOptions).subscribe(
    (resp) => {
      if(resp['body']['status']) {
      	this.router.navigate(['bus'], {
      		state : {
      			success: true
      		}
      	});
      }
    });
  }

  ngOnInit(): void {}
}
