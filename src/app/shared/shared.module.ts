import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NumberSeparatorDirective } from './directives/number-separator.directive';
import { JalaliDatePipe } from './pipes/jalali-date.pipe';

@NgModule({
  declarations: [JalaliDatePipe, NumberSeparatorDirective],
  imports: [CommonModule],
  exports: [JalaliDatePipe, NumberSeparatorDirective],
})
export class SharedModule {}
