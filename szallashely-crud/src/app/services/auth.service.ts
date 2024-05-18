import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '../model/user.model';
import { Hotel } from '../model/hotel.model';
import { Observable, map } from 'rxjs';
import { UserData } from '../model/userData.model';
import { Book } from '../model/books.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afs: AngularFireAuth, private firestore: AngularFirestore) {

  }

  isLoggedIn(): Promise<boolean> {
    return new Promise((resolve: any) => {
      this.afs.onAuthStateChanged((user: any) => {
        user ? resolve(true) : resolve(false);
      });
    });
  }


  public getLoggedInUser() {
    return this.afs.user;
  }
  registerWithEmailAndPassword(user: User) {
    return this.afs.createUserWithEmailAndPassword(user.email, user.password)
      .then(result => {
        return this.firestore.collection('users').doc(result.user?.uid).set({
          id: result.user?.uid,
          email: user.email
        });
      });
  }

  signInWithEmailAndPassword(user: User) {
    return this.afs.signInWithEmailAndPassword(user.email, user.password);
  }

  logout() {
    window.localStorage.setItem('email', "");
    return this.afs.signOut();
  }

  getCurrentUserId(): Promise<string | null> {
    const email = window.localStorage.getItem('email');
    if (!email) {
      return Promise.resolve(null);
    }
    return this.firestore.collection('users', ref => ref.where('email', '==', email)).get().toPromise().then(snapshot => {
      if (!snapshot!.empty) {
        return snapshot!.docs[0].id;
      } else {
        return null;
      }
    });
  }

  isLogedIn() {
    return !!localStorage.getItem('email');
  }

  // Users
  createUser(user: User): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection('users').doc(id).set({ ...user, id });
  }

  getUserById(id: string): Observable<User> {
    return this.firestore.collection('users').doc<User>(id).valueChanges().pipe(
      map(user => {
        if (user) {
          return user;
        } else {
          throw new Error('User not found');
        }
      })
    );
  }

  // UserData
  createUserData(userData: UserData): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection('user-data').doc(id).set({ ...userData, id });
  }

  getUserDataByUserId(userId: string): Observable<UserData[]> {
    return this.firestore.collection<UserData>('user-data', ref => ref.where('userId', '==', userId)).valueChanges();
  }

  updateUserData(userData: UserData): Promise<void> {
    return this.firestore.collection('user-data').doc(userData.id).update(userData);
  }

  // Books
  createBook(book: Book): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection('books').doc(id).set({ ...book, id });
  }

  getBooksByUserId(userId: string): Observable<Book[]> {
    return this.firestore.collection<Book>('books', ref => ref.where('userId', '==', userId)).valueChanges();
  }

  getBooksByHotelId(hotelId: string): Observable<Book[]> {
    return this.firestore.collection<Book>('books', ref => ref.where('hotelId', '==', hotelId)).valueChanges();
  }

  getBookById(id: string): Observable<Book> {
    return this.firestore.collection('books').doc<Book>(id).valueChanges().pipe(
      map(book => {
        if (book) {
          return book;
        } else {
          throw new Error('Book not found');
        }
      })
    );
  }
  deleteBook(id: string): Promise<void> {
    return this.firestore.collection('books').doc(id).delete();
  }
  
  getBooksByUserIdWithSorting(userId: string, sortOption: string, sortAscending: boolean): Observable<Book[]> {
    const queryFn: QueryFn = ref => {
      let query = ref.where('userId', '==', userId);
      if (sortOption === 'price') {
        query = query.orderBy('totalPrice', sortAscending ? 'asc' : 'desc');
      } else if (sortOption === 'date') {
        query = query.orderBy('startDate', sortAscending ? 'asc' : 'desc');
      }
      return query;
    };
    return this.firestore.collection<Book>('books', queryFn).valueChanges();
  }


  //hotels
  getHotels(): Observable<Hotel[]> {
    return this.firestore.collection<Hotel>('hotels').valueChanges();
  }

  getHotelById(id: string): Observable<Hotel> {
    return this.firestore.collection('hotels').doc<Hotel>(id).valueChanges().pipe(
      map(hotel => {
        if (hotel) {
          return hotel;
        } else {
          throw new Error('Hotel not found');
        }
      })
    );
  }

  createHotel(hotel: Hotel): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection('hotels').doc(id).set({ ...hotel, id });
  }

}
