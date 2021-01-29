import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserCheckTicketComponent } from './components/user-check-ticket/user-check-ticket.component';
import { UserOrderComponent } from './components/user-order/user-order.component';
import { JadwalComponent } from './components/jadwal/jadwal.component';
import { ReportComponent } from './components/report/report.component';
import { ScheduleInfoComponent } from './components/schedule-info/schedule-info.component';

const routes: Routes = [
	{
		path: '',
		component: LoginComponent
	},
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'bus',
		component: UserHomeComponent
	},
	{
		path: 'profile',
		component: UserProfileComponent
	},
	{
		path: 'check_ticket',
		component: UserCheckTicketComponent
	},
	{
		path: 'order',
		component: UserOrderComponent
	},
	{
		path: 'schedule',
		component: JadwalComponent
	},
	{
		path: 'sales_report',
		component: ReportComponent
	},
	{
		path: 'schedule_info',
		component: ScheduleInfoComponent
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
