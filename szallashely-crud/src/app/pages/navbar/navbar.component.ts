import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private authservice:AuthService, private router:Router){

  }
  signOut(){
    this.authservice.logout();
    alert("Sikeres kilépés, szia:(")
    this.router.navigate(["/main"]);

  }
  isLogedIn(){
    return this.authservice.isLogedIn();
  }


}
