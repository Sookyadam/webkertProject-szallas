import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../model/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('',[Validators.required])

  constructor(private authservice:AuthService,private router: Router){}

  signInUser(){
    let user:User = {email:this.email.value as string,password:this.password.value as string};
    this.authservice.signInWithEmailAndPassword(user);
    localStorage.setItem("email",this.email.value as string);
    alert("Sikeres bejelentkezés");
    this.router.navigate(['/main']);
  }

  getErrorMessage() {
    return this.password.hasError('required') ? 'You must enter a value' : '';
  }

  getEmailErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

}
