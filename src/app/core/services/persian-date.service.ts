// persian-date.service.ts
import { Injectable } from '@angular/core';
import moment from 'jalali-moment';

@Injectable({
  providedIn: 'root',
})
export class PersianDateService {
  constructor() {
    moment.locale('fa');
  }

  getCurrentPersianMonth() {
    const today = moment();
    const persianDate = today.format('jYYYY/jMM/jDD');

    const parts = persianDate.split('/');
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]);

    // روز اول ماه شمسی
    const firstDayPersian = moment(`${year}/${month}/1`, 'jYYYY/jMM/jDD');

    // روز آخر ماه شمسی
    const daysInMonth = this.getDaysInPersianMonth(year, month);
    const lastDayPersian = moment(
      `${year}/${month}/${daysInMonth}`,
      'jYYYY/jMM/jDD',
    );

    return {
      persianMonth: month,
      persianMonthName: this.getPersianMonthName(month),
      persianYear: year,
      // فرمت YYYY-MM-DD برای خروجی میلادی
      firstDayGregorian: firstDayPersian.format('YYYY-MM-DD'),
      lastDayGregorian: lastDayPersian.format('YYYY-MM-DD'),
      // اگر به شیء Date هم نیاز داری
      firstDayDate: firstDayPersian.toDate(),
      lastDayDate: lastDayPersian.toDate(),
    };
  }

  private getDaysInPersianMonth(year: number, month: number): number {
    if (month <= 6) return 31;
    if (month <= 11) return 30;
    return this.isLeapYear(year) ? 30 : 29;
  }

  private isLeapYear(year: number): boolean {
    const remainder = year % 33;
    return (
      remainder === 1 ||
      remainder === 5 ||
      remainder === 9 ||
      remainder === 13 ||
      remainder === 17 ||
      remainder === 22 ||
      remainder === 26 ||
      remainder === 30
    );
  }

  private getPersianMonthName(month: number): string {
    const monthNames = [
      'فروردین',
      'اردیبهشت',
      'خرداد',
      'تیر',
      'مرداد',
      'شهریور',
      'مهر',
      'آبان',
      'آذر',
      'دی',
      'بهمن',
      'اسفند',
    ];
    return monthNames[month - 1];
  }
}
