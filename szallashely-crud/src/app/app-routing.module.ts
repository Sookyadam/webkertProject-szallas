import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { authguardGuard } from './services/authguard.guard';
import { HotelsComponent } from './pages/hotels/hotels.component';
import { MyDataComponent } from './pages/my-data/my-data.component';
import { MyBooksComponent } from './pages/mybooks/mybooks.component';


const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: 'main', component: MainComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: SignupComponent,},
  { path: 'hotels', component: HotelsComponent, canActivate : [authguardGuard]},
  { path: 'data', component: MyDataComponent, canActivate : [authguardGuard]},
  { path: 'mybook', component: MyBooksComponent, canActivate : [authguardGuard]},
  // canActivate : [authguardGuard]

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
