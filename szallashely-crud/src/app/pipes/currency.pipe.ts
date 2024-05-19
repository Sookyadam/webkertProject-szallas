import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyService } from '../services/currency.service';

@Pipe({
  name: 'currencyConvert',
  pure: false
})
export class CurrencyPipe implements PipeTransform {

  private currentCurrency: string | undefined;

  constructor(private currencyService: CurrencyService) {
    this.currencyService.getCurrency().subscribe(currency => {
      this.currentCurrency = currency;
    });
  }

  transform(value: number): string {
    if (!value) {
      return `${value} HUF`;
    }
    const convertedValue = this.currencyService.convert(value, this.currentCurrency!);
    return `${convertedValue.toFixed(2)} ${this.currentCurrency}`;
  }
}
