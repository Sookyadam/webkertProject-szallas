import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserDialogComponent } from '../pages/user-dialog/user-dialog.component';
import { Hotel } from '../model/hotel.model';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialogOpen: boolean = false;

  constructor(private dialog: MatDialog, private router: Router) {}

  openHotelDialog(hotel: Hotel, userData: any): void {
    if (this.dialogOpen) {
      return;
    }

    // Ellenőrizzük, hogy az aktuális útvonal a HotelsComponent-hez tartozik-e
    if (this.router.url !== '/hotels') {
      return;
    }

    this.dialogOpen = true;
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
      this.dialogOpen = false;
      if (result) {
        console.log('Foglalás adatai:', result);
      }
    });
  }
}
