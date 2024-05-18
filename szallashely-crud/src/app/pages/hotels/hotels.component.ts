import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Hotel } from '../../model/hotel.model';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css']
})
export class HotelsComponent implements OnInit {
  hotels: Hotel[] = [];
  
  constructor(private authService: AuthService, private dialogService: DialogService) {}

  ngOnInit(): void {
    this.authService.getHotels().subscribe((data) => {
      this.hotels = data.map(hotel => ({
        ...hotel,
        availableFrom: new Date(hotel.availableFrom),
        availableTo: new Date(hotel.availableTo)
      }));
    });
  }

  openDialog(hotel: Hotel): void {
    const email = window.localStorage.getItem('email');
    if (!email) {
      alert('User is not logged in.');
      return;
    }

    this.authService.getCurrentUserId().then(uid => {
      if (!uid) {
        alert('User ID not found.');
        return;
      }

      this.authService.getUserDataByUserId(uid).subscribe(userDataArray => {
        if (userDataArray.length > 0) {
          const userData = userDataArray[0];
          this.dialogService.openHotelDialog(hotel, userData);
        } else {
          alert('User data not found.');
        }
      }, error => {
        console.error('Error fetching user data:', error);
      });
    }).catch(error => {
      console.error('Error fetching user ID:', error);
    });
  }
}
