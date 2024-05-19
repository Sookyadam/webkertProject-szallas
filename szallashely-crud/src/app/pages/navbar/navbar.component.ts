import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  public selectedCurrency: string | undefined;

  constructor(private authservice:AuthService, private router:Router,private currencyService: CurrencyService){
  }
  ngOnInit(){
    this.selectedCurrency = localStorage.getItem('selectedCurrency') || 'HUF';
  }
  signOut(){
    this.authservice.logout();
    alert("Sikeres kilépés, szia:(")
    this.router.navigate(["/main"]);

  }
  isLogedIn(){
    return this.authservice.isLogedIn();
  }
  changeCurrency(currency: string) {
    this.currencyService.setCurrency(currency);
    this.selectedCurrency = currency;
  }
}
