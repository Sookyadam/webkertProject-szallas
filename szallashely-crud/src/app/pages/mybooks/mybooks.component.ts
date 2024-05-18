import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { AuthService } from '../../services/auth.service';
import { Book } from '../../model/books.model';

@Component({
  selector: 'app-mybooks',
  templateUrl: './mybooks.component.html',
  styleUrls: ['./mybooks.component.css']
})
export class MyBooksComponent implements OnInit {
  displayedColumns: string[] = ['hotelName', 'price', 'date', 'actions'];
  dataSource = new MatTableDataSource<Book>();
  sortOption = 'date';
  sortAscending = true;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchBookings();
  }

  fetchBookings(): void {
    const email = localStorage.getItem('email');
    if (!email) {
      alert('User is not logged in.');
      return;
    }

    this.authService.getCurrentUserId().then(uid => {
      if (!uid) {
        alert('User ID not found.');
        return;
      }

      this.authService.getBooksByUserIdWithSorting(uid, this.sortOption, this.sortAscending).subscribe(bookings => {
        bookings.forEach(booking => {
          booking.startDate = (booking.startDate as any).toDate();
          booking.endDate = (booking.endDate as any).toDate();
        });
        this.dataSource.data = bookings;
        this.dataSource.sort = this.sort;
      }, error => {
        console.error('Error fetching bookings:', error);
      });
    }).catch(error => {
      console.error('Error fetching user ID:', error);
    });
  }

  sortData(): void {
    this.fetchBookings();
  }

  editBooking(booking: Book): void {
    // Implement edit booking logic here
    console.log('Edit booking:', booking);
  }

  deleteBooking(id: string): void {
    if (confirm('Are you sure you want to delete this booking?')) {
      this.authService.deleteBook(id).then(() => {
        this.fetchBookings();
      }).catch(error => {
        console.error('Error deleting booking:', error);
      });
    }
  }
}