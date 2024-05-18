import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Hotel } from '../../model/hotel.model';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrl: './hotels.component.css'
})
export class HotelsComponent  implements OnInit {
  hotels: Hotel[] = [];
  filteredHotels: Hotel[] = [];
  locations: string[] = ['Horvátország', 'Balaton', 'Siófok', 'Hajdúszoboszló', 'Budapest'];
  selectedLocation: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor(private authService: AuthService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.authService.getHotels().subscribe((data) => {
      this.hotels = data.map(hotel => ({
        ...hotel,
        availableFrom: new Date(hotel.availableFrom),
        availableTo: new Date(hotel.availableTo)
      }));
      this.filterHotels();
    });
  }

  filterHotels(): void {
    this.filteredHotels = this.hotels.filter(hotel => {
      const matchesLocation = this.selectedLocation ? hotel.location.includes(this.selectedLocation) : true;
      const matchesStartDate = this.startDate ? new Date(hotel.availableFrom) <= this.startDate : true;
      const matchesEndDate = this.endDate ? new Date(hotel.availableTo) >= this.endDate : true;
      return matchesLocation && matchesStartDate && matchesEndDate;
    });
  }

  search(): void {
    this.filterHotels();
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
          const dialogRef = this.dialog.open(UserDialogComponent, {
            width: '400px',
            data: {
              hotelId: hotel.id,
              hotelName: hotel.name,
              name: userData.name,
              phone: userData.mobile ? userData.mobile.toString() : ''
            }
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              console.log('Foglalás adatai:', result);
            }
          });
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