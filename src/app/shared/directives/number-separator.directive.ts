import {
  Directive,
  ElementRef,
  HostListener,
  OnInit,
  Optional,
} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNumberSeparator]',
})
export class NumberSeparatorDirective implements OnInit {
  constructor(
    private el: ElementRef<HTMLInputElement>,
    @Optional() private ngControl: NgControl,
  ) {}

  ngOnInit(): void {
    const control = this.ngControl?.control;

    if (!control) {
      return;
    }

    // مقدار اولیه هنگام باز شدن فرم / edit
    this.formatValue(control.value);

    // تغییرات بعدی FormControl مثل patchValue و setValue
    control.valueChanges.subscribe((value) => {
      this.formatValue(value);
    });
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    const rawValue = input.value.replace(/,/g, '').replace(/\D/g, '');

    if (!rawValue) {
      this.ngControl?.control?.setValue('', {
        emitEvent: false,
      });

      input.value = '';
      return;
    }

    this.ngControl?.control?.setValue(rawValue, {
      emitEvent: false,
    });

    input.value = this.addSeparator(rawValue);
  }

  private formatValue(value: unknown): void {
    const input = this.el.nativeElement;

    if (value === null || value === undefined || value === '') {
      input.value = '';
      return;
    }

    const rawValue = String(value).replace(/,/g, '').replace(/\D/g, '');

    input.value = rawValue ? this.addSeparator(rawValue) : '';
  }

  private addSeparator(value: string): string {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
