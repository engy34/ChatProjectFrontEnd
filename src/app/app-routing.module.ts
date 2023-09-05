import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './Components/auth/auth.component';
import { HomeComponent } from './Components/home/home.component';
import { AuthGuard } from './Services/Guards/auth.guard';

const routes: Routes = [
{
    path:'',redirectTo:"auth",pathMatch:"full"
},
{
  path:'auth',component:AuthComponent
},
/* {
  path:'home',component:HomeComponent
}, */
{ path: 'home', loadChildren: () => import('./Components/home/home.module').then(m => m.HomeModule),
canActivate:[AuthGuard] },
{
  path:"**",redirectTo:"auth",pathMatch:"full"
},

];

@NgModule({
  //optimization of the lazy loading 
  imports: [RouterModule.forRoot(routes,{preloadingStrategy:PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
