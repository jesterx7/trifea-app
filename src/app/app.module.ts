import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { UserHeaderComponent } from './components/layout/user-header/user-header.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AgmCoreModule } from '@agm/core';
import { UserCheckTicketComponent } from './components/user-check-ticket/user-check-ticket.component';
import { UserOrderComponent } from './components/user-order/user-order.component';
import { JadwalComponent } from './components/jadwal/jadwal.component';
import { ReportComponent } from './components/report/report.component';
import { ScheduleInfoComponent } from './components/schedule-info/schedule-info.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    UserHeaderComponent,
    UserHomeComponent,
    UserProfileComponent,
    UserCheckTicketComponent,
    UserOrderComponent,
    JadwalComponent,
    ReportComponent,
    ScheduleInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAEGGw0nGGqnYP2LR53UaoHHor_HCSdVeQ'
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
