// jalali-datepicker.component.ts
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import moment from 'jalali-moment'; // import پیش‌فرض

@Component({
  selector: 'app-jalali-datepicker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative w-full">
      <input
        type="text"
        [value]="displayValue"
        (click)="toggle()"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm 
               focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
               cursor-pointer placeholder:text-gray-400"
        [placeholder]="placeholder || 'مثلاً ۱۴۰۳/۰۴/۱۵'"
        readonly
      />

      <div
        *ngIf="isOpen"
        class="absolute z-50 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 w-full"
        style="min-width: 320px;"
      >
        <!-- Header: Month & Year -->
        <div class="flex items-center justify-between mb-4">
          <button
            type="button"
            (click)="prevMonth()"
            class="p-2 hover:bg-gray-100 rounded-full"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <span class="text-sm font-semibold text-gray-800">
            {{ getMonthName() }} {{ getYear() }}
          </span>
          <button
            (click)="nextMonth()"
            class="p-2 hover:bg-gray-100 rounded-full"
          >
            <svg
              class="w-5 h-5 transform rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        <!-- Weekday headers -->
        <div class="grid grid-cols-7 gap-1 mb-2">
          <div
            *ngFor="let d of weekDays"
            class="text-center text-xs font-medium text-gray-400 py-2"
          >
            {{ d }}
          </div>
        </div>

        <!-- Days grid -->
        <div class="grid grid-cols-7 gap-1">
          <button
            type="button"
            *ngFor="let day of days; let i = index"
            (click)="selectDay(day)"
            [disabled]="!day"
            class="py-2 text-sm rounded-lg transition-colors
                   disabled:opacity-0 disabled:cursor-default
                   hover:bg-indigo-50"
            [class.bg-indigo-600]="isSelectedDay(day)"
            [class.text-white]="isSelectedDay(day)"
            [class.text-gray-700]="!isSelectedDay(day)"
          >
            {{ day }}
          </button>
        </div>

        <!-- Today button -->
        <div class="mt-3 text-center border-t pt-2">
          <button
            (click)="goToToday()"
            class="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            امروز
          </button>
        </div>
      </div>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JalaliDatepickerComponent),
      multi: true,
    },
  ],
})
export class JalaliDatepickerComponent implements ControlValueAccessor {
  @Input() placeholder = 'تاریخ را انتخاب کنید';

  isOpen = false;
  weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
  days: number[] = [];

  // نام ماه‌های فارسی به ترتیب از فروردین تا اسفند
  persianMonths = [
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

  calendarMoment = moment();

  private selectedDate: string | null = null;
  displayValue = '';

  private onChange: (val: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  constructor(private elementRef: ElementRef) {
    this.generateDays();
  }

  // --- ControlValueAccessor ---
  writeValue(value: string): void {
    this.selectedDate = value || null;
    this.updateDisplay();
    if (value) {
      const m = moment(value);
      if (m.isValid()) {
        this.calendarMoment = m.clone();
        this.generateDays();
      }
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // --- UI ---
  toggle() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.updateCalendarToSelectedOrDefault();
    }
  }

  close() {
    this.isOpen = false;
    this.onTouched();
  }

  prevMonth() {
    this.calendarMoment = this.calendarMoment.clone().subtract(1, 'jMonth');
    this.generateDays();
  }

  nextMonth() {
    this.calendarMoment = this.calendarMoment.clone().add(1, 'jMonth');
    this.generateDays();
  }

  selectDay(day: number) {
    if (!day) return;
    const selected = this.calendarMoment.clone().jDate(day);
    this.selectedDate = selected.format('YYYY-MM-DD');
    this.onChange(this.selectedDate);
    this.updateDisplay();
    this.isOpen = false;
    this.onTouched();
  }

  goToToday() {
    const today = moment();
    this.calendarMoment = today.clone();
    this.generateDays();
    this.selectDay(today.jDate());
  }

  // استفاده از آرایه‌ی فارسی به جای moment.locale()
  getMonthName(): string {
    const monthIndex = this.calendarMoment.jMonth(); // 0-based
    return this.persianMonths[monthIndex];
  }

  getYear(): number {
    return this.calendarMoment.jYear();
  }

  isSelectedDay(day: number): boolean {
    if (!day || !this.selectedDate) return false;
    const sel = moment(this.selectedDate);
    return (
      sel.jDate() === day &&
      sel.jMonth() === this.calendarMoment.jMonth() &&
      sel.jYear() === this.calendarMoment.jYear()
    );
  }

  private generateDays() {
    const startOfMonth = this.calendarMoment.clone().startOf('jMonth');
    const endOfMonth = this.calendarMoment.clone().endOf('jMonth');
    const startDay = startOfMonth.day();

    this.days = [];
    for (let i = 0; i < startDay; i++) {
      this.days.push(0);
    }
    for (let i = 1; i <= endOfMonth.jDate(); i++) {
      this.days.push(i);
    }
  }

  private updateCalendarToSelectedOrDefault() {
    if (this.selectedDate) {
      const m = moment(this.selectedDate);
      if (m.isValid()) {
        this.calendarMoment = m.clone();
      }
    }
    this.generateDays();
  }

  private updateDisplay() {
    if (this.selectedDate) {
      const m = moment(this.selectedDate);
      this.displayValue = m.format('jYYYY/jMM/jDD');
    } else {
      this.displayValue = '';
    }
  }
}
