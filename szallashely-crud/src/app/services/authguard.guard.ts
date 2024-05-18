import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class authguardGuard implements CanActivate{
  constructor(private auth: AuthService, private router: Router) { }


  canActivate() {
    if (this.auth.isLogedIn()) {
        return true;
      } else {
        alert("Nem vagy bejelentkezve");
        this.router.navigate(['/login'])
        return false;
      }
    }
  };