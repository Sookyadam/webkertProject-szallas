import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserData } from '../../model/userData.model';

@Component({
  selector: 'app-my-data',
  templateUrl: './my-data.component.html',
  styleUrls: ['./my-data.component.css']
})
export class MyDataComponent implements OnInit {
  userData: UserData | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getCurrentUserId().then(userId => {
      if (userId) {
        this.authService.getUserDataByUserId(userId).subscribe(userDataArray => {
          if (userDataArray.length > 0) {
            this.userData = userDataArray[0];
          }
        });
      }
    });
  }

  onSave(updatedUserData: UserData) {
    this.authService.getCurrentUserId().then(userId => {
      if (userId) {
        updatedUserData.userId = userId;
        if (this.userData && this.userData.id) {
          updatedUserData.id = this.userData.id;
          this.authService.updateUserData(updatedUserData).then(() => {
            alert('User data updated successfully!');
          }).catch(error => {
            console.error('Error updating user data:', error);
          });
        } else {
          this.authService.createUserData(updatedUserData).then(() => {
            alert('User data saved successfully!');
          }).catch(error => {
            console.error('Error saving user data:', error);
          });
        }
      }
    });
  }
}