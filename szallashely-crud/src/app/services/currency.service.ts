import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private readonly localStorageKey = 'selectedCurrency';
  private exchangeRates: { [key: string]: number } = {
    'HUF': 1,
    'USD': 0.0032, 
    'EUR': 0.0027  
  };

  private currencySubject: BehaviorSubject<string>;

  constructor() {
    const storedCurrency = localStorage.getItem(this.localStorageKey) || 'HUF';
    this.currencySubject = new BehaviorSubject<string>(storedCurrency);
  }

  getCurrency(): Observable<string> {
    return this.currencySubject.asObservable();
  }

  setCurrency(currency: string) {
    if (this.exchangeRates[currency]) {
      localStorage.setItem(this.localStorageKey, currency);
      this.currencySubject.next(currency);
    }
  }

  convert(price: number, currency: string): number {
    return price * this.exchangeRates[currency];
  }
}
