import { Pipe, PipeTransform } from '@angular/core';
import moment from 'jalali-moment';

@Pipe({
  name: 'jalaliDate',
})
export class JalaliDatePipe implements PipeTransform {
  transform(
    value: Date | string | number,
    type: 'date' | 'datetime' = 'date',
  ): string {
    if (!value) return '';

    const m = moment(value);

    if (type === 'datetime') {
      return m.format('jYYYY/jMM/jDD HH:mm');
    }

    return m.format('jYYYY/jMM/jDD');
  }
}
