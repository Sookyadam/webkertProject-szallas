import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../model/user.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  constructor(private authservice: AuthService,private router: Router) {}

  signUpUser() {
    let user: User = {
      email: this.email.value as string,
      password: this.password.value as string,
    };
    this.authservice.registerWithEmailAndPassword(user).then(() => {
      alert("Sikeres regisztráció!");
      this.router.navigate(['/login']);
    }).catch(error => {
      alert("Regisztrációs hiba: " + error.message);
    });
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
