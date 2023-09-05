import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/Environment/environment';
import { User } from '../Models/user';


@Injectable({ providedIn: 'root' })
export class SignalrService {
  constructor(
    public toastr: ToastrService,
    public router: Router
  ) { }


  hubConnection!: signalR.HubConnection;
  personName!: string;
  public userData: User=new User();
  //3Tutorial
  ssSubj = new Subject<any>();
  ssObs(): Observable<any> {
    return this.ssSubj.asObservable();
  }

  startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/chat`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();

    this.hubConnection
      .start()
      .then(() => {
        this.ssSubj.next({ type: "HubConnStarted" });
      })
      .catch(err => console.log('Error while starting connection: ' + err))
  }


}