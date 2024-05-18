import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { Hotel } from '../../model/hotel.model';
import { Book } from '../../model/books.model';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent implements OnInit {
  bookingForm: FormGroup;
  minDate: Date;
  bookedDates: Date[] = [];
  hotel: Hotel | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService
  ) {
    this.minDate = new Date();
    this.bookingForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      startDate: ['', [Validators.required, this.dateRangeValidator.bind(this)]],
      endDate: ['', [Validators.required, this.dateRangeValidator.bind(this)]]
    });
  }

  ngOnInit(): void {
    this.authService.getCurrentUserId().then(userId => {
      if (userId) {
        this.authService.getUserDataByUserId(userId).subscribe(userDataArray => {
          if (userDataArray.length > 0) {
            const userData = userDataArray[0];
            this.bookingForm.patchValue({
              name: userData.name || '',
              phone: userData.mobile ? userData.mobile.toString() : ''
            });
          }
        });
        this.authService.getBooksByHotelId(this.data.hotelId).subscribe(bookings => {
          this.bookedDates = bookings.map(booking => {
            return new Date(booking.startDate);
          });
        });
        this.authService.getHotelById(this.data.hotelId).subscribe(hotel => {
          this.hotel = hotel;
        });
      }
    });
  }

  dateRangeValidator() {
    const startDate = this.bookingForm?.get('startDate')?.value;
    const endDate = this.bookingForm?.get('endDate')?.value;
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return { invalidRange: true };
    }
    return null;
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) {
      return false;
    }
    const isBooked = this.bookedDates.some(bookedDate => {
      return date.getTime() === bookedDate.getTime();
    });
    return !isBooked;
  };

  onSubmit(): void {
    if (this.bookingForm.valid && this.hotel) {
      this.authService.getCurrentUserId().then(userId => {
        if (userId) {
          const booking: Book = {
            userId: userId,
            hotelId: this.data.hotelId,
            hotelName: this.data.hotelName,
            name: this.bookingForm.value.name,
            phone: this.bookingForm.value.phone,
            startDate: new Date(this.bookingForm.value.startDate),
            endDate: new Date(this.bookingForm.value.endDate),
            totalPrice: this.calculateTotalPrice(new Date(this.bookingForm.value.startDate), new Date(this.bookingForm.value.endDate))
          };
          this.authService.createBook(booking).then(() => {
            alert('Booking created successfully');
            this.dialogRef.close(booking);
          }).catch(error => {
            alert(`Error: ${error.message}`);
          });
        }
      }).catch(error => {
        alert(`Error: ${error.message}`);
      });
    }
  }

  calculateTotalPrice(startDate: Date, endDate: Date): number {
    if (!this.hotel) {
      return 0;
    }
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((startDate.getTime() - endDate.getTime()) / oneDay));
    return diffDays * this.hotel.pricePerNight;
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}