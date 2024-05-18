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

//   userDataForm = new FormGroup({
//     name: new FormControl('', [Validators.required]),
//     mobile: new FormControl('', [Validators.required]),
//     country: new FormControl('', [Validators.required]),
//     postNumber: new FormControl('', [Validators.required]),
//     city: new FormControl('', [Validators.required]),
//     address: new FormControl('', [Validators.required])
//   });

//   userDataId: string | null = null;  // Ensure this is either string or null

//   constructor(private authService: AuthService) {}

//   ngOnInit() {
//     this.authService.getCurrentUserId().then(userId => {
//       if (userId) {
//         this.authService.getUserDataByUserId(userId).subscribe(userDataArray => {
//           if (userDataArray.length > 0) {
//             const userData = userDataArray[0];
//             this.userDataId = userData.id || null;  // Ensure userDataId is either string or null
//             this.userDataForm.setValue({
//               name: userData.name || '',
//               mobile: userData.mobile ? userData.mobile.toString() : '',
//               country: userData.country || '',
//               postNumber: userData.postNumber ? userData.postNumber.toString() : '',
//               city: userData.city || '',
//               address: userData.address || ''
//             });
//           }
//         });
//       }
//     });
//   }

//   saveUserData() {
//     if (this.userDataForm.valid) {
//       this.authService.getCurrentUserId().then(userId => {
//         if (userId) {
//           const userData: UserData = {
//             id: this.userDataId || '',  // Use existing ID or generate a new one
//             userId: userId,
//             name: this.userDataForm.value.name || '',
//             mobile: parseInt(this.userDataForm.value.mobile || '0'),
//             country: this.userDataForm.value.country || '',
//             postNumber: parseInt(this.userDataForm.value.postNumber || '0'),
//             city: this.userDataForm.value.city || '',
//             address: this.userDataForm.value.address || ''
//           };

//           if (this.userDataId) {
//             this.authService.updateUserData(userData).then(() => {
//               alert('User data updated successfully!');
//             }).catch(error => {
//               console.error('Error updating user data:', error);
//             });
//           } else {
//             this.authService.createUserData(userData).then(() => {
//               alert('User data saved successfully!');
//             }).catch(error => {
//               console.error('Error saving user data:', error);
//             });
//           }
//         }
//       });
//     }
//   }
// }