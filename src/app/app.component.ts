import { Component, OnDestroy, OnInit } from '@angular/core';
import { SignalrService } from './Services/signalr.service';
import { AuthService } from './Services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'JIC.ChatAppFront';

  constructor(private signalrService: SignalrService, public authService: AuthService ) { }
  ngOnInit() {
    this.signalrService.startConnection();

  }
  ngOnDestroy() {
    this.signalrService.hubConnection.off("askServerResponse");
  }
}
