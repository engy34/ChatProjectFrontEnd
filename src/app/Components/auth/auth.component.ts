
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { SignalrService } from 'src/app/Services/signalr.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})

//Added in tutorial 2
export class AuthComponent implements OnInit, OnDestroy {
  
  constructor(
    public signalrService: SignalrService,
    private router:Router,
    private authService:AuthService
  ) { }

  ngOnInit(): void {
    this.authService.authMeListenerSuccess();
    this.authService.authMeListenerFail();
  }

  ngOnDestroy(): void {
    this.signalrService.hubConnection.off("authMeResponseSuccess");
    this.signalrService.hubConnection.off("authMeResponseFail");
  }


  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
 /*    form.value.userName="engy";
    form.value.password="pass"; */
    
    this.authService.authMe(form.value.userName, form.value.password);
    form.reset();
  }


 /*  async authMe(user: string, pass: string) {
    let personInfo = {userName: user, password: pass};

    await this.signalrService.hubConnection.invoke("authMe", personInfo)
    .finally(() => {
      this.signalrService.toastr.info("Loging in attempt...")
    })
    .catch(err => console.error(err));
  } */



  private authMeListenerSuccess() {
    this.signalrService.hubConnection.on("authMeResponseSuccess", (personInfo: any) => {
        console.log(this.signalrService.router);
        this.signalrService.personName = personInfo.name;
        this.signalrService.toastr.success("Login successful!");
/*         this.signalrService.router.navigate(["/home"]); */
        this.router.navigate(["/home"]);
    });
  }


  private authMeListenerFail() {
    this.signalrService.hubConnection.on("authMeResponseFail", () => {
      this.signalrService.toastr.error("Wrong credentials!");
    });
  }


}