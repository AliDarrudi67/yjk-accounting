import { CommonModule } from '@angular/common';
import { Component, effect, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MainService } from '../../core/services/main.service';
import { JalaliDatepickerComponent } from '../../shared/jalali-datepicker/jalali-datepicker.component';
import { SharedModule } from '../../shared/shared.module';
import { ViewTransactionComponent } from '../view-transaction/view-transaction.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FormsModule,
    JalaliDatepickerComponent,
  ],
})
export class HeaderComponent implements OnInit {
  // تاریخ امروز
  todayDate: string | null = null;
  adminInfo: any;

  // وضعیت دراپ‌داون‌ها
  isUserMenuOpen = false;
  isNotificationsOpen = false;

  // نوتیفیکیشن‌ها
  notificationCount = 5;
  notifications = [
    {
      id: 1,
      title: 'تراکنش جدید',
      message: 'یک تراکنش جدید ثبت شد',
      time: '۱۰ دقیقه پیش',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'bg-blue-500',
    },
  ];

  // آیتم‌های منوی کاربر
  userMenuItems = [
    {
      label: 'پروفایل من',
      route: '/profile',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    },
    {
      label: 'تنظیمات حساب',
      route: '/settings',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
    },
    {
      label: 'تغییر رمز عبور',
      route: '/change-password',
      icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z',
    },
  ];

  todayDueDocuments: any[] = [];

  constructor(
    private mainService: MainService,
    private authService: AuthService,
    private dialog: MatDialog,
  ) {
    effect(() => {
      this.adminInfo = mainService.adminInfo();
    });
  }
  ngOnInit() {
    this.todayDate = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Tehran',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());

    const savedDate = localStorage.getItem('date');

    if (savedDate) {
      this.todayDate = savedDate;
    }
  }

  // توابع toggle برای دراپ‌داون‌ها
  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    // بستن نوتیفیکیشن اگر باز است
    if (this.isUserMenuOpen) {
      this.isNotificationsOpen = false;
    }
  }

  toggleNotifications() {
    this.isNotificationsOpen = !this.isNotificationsOpen;
    // بستن منوی کاربر اگر باز است
    if (this.isNotificationsOpen) {
      this.isUserMenuOpen = false;
    }
  }

  // بستن دراپ‌داون‌ها با کلیک بیرون
  @HostListener('document:click', ['$event'])
  closeDropdowns(event: Event) {
    const target = event.target as HTMLElement;

    if (!target.closest('.relative')) {
      this.isUserMenuOpen = false;
      this.isNotificationsOpen = false;
    }
  }

  // تابع خروج
  logout() {
    this.authService.logout();
  }

  // تابع برای خواندن همه نوتیفیکیشن‌ها
  markAllAsRead() {
    this.notificationCount = 0;
    this.isNotificationsOpen = false;
  }

  viewDocument(event: Event, item: any) {
    event.preventDefault();
    event.stopPropagation();

    const dialogConfig = {
      ...this.mainService.defaultDialogConfig,
      data: item,
    };

    this.dialog.open(ViewTransactionComponent, dialogConfig);
  }

  onDateChange(date: string) {
    console.log('selected date:', date);
    localStorage.setItem('date', date);
    location.reload();
  }
}
