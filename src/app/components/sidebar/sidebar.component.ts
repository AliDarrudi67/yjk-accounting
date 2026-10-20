import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  EventEmitter,
  HostBinding,
  OnInit,
  Output,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiEndpoints } from '../../core/config/apiEndpoints';
import { MainService } from '../../core/services/main.service';
import { SafeHtmlPipe } from '../../shared/pipes/safe-html.pipe';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('sidebarState', [
      state('expanded', style({ width: '16rem', opacity: 1 })),
      state('collapsed', style({ width: '4.5rem', opacity: 1 })),
      transition('expanded <=> collapsed', animate('250ms ease-in-out')),
    ]),
  ],
  imports: [CommonModule, RouterModule, SafeHtmlPipe],
  standalone: true,
})
export class SidebarComponent implements OnInit {
  @HostBinding('@sidebarState') state: 'expanded' | 'collapsed' = 'expanded';
  @Output() toggleEvent = new EventEmitter<boolean>();
  @Output() logoutEvent = new EventEmitter<void>(); // ← خروجی جدید
  adminInfo: any;
  // متغیر برای وضعیت باز/بسته بودن منوی شرکت‌ها
  isCompanyMenuOpen = false;

  // تابع برای toggle کردن منوی شرکت‌ها
  toggleCompanyMenu() {
    this.isCompanyMenuOpen = !this.isCompanyMenuOpen;
  }

  // ساختار داده‌های منو باید به این شکل به‌روزرسانی شود:
  menuItems: any[] = [
    {
      title: 'dashboard',
      label: 'داشبرد',
      route: '/',
      active: false,
      children: [],
    },
  ];

  constructor(private mainService: MainService) {
    effect(() => {
      this.adminInfo = mainService.adminInfo();
    });
  }

  ngOnInit(): void {
    this.getAdminInfo();
  }

  getAdminInfo() {
    this.mainService.get(ApiEndpoints.admin.info).subscribe({
      next: (response: any) => {
        if (response?.admin?.main == 'y') {
          this.menuItems.push({
            title: 'admins',
            label: 'کاربران',
            route: '/private/dashboard/admins',
            active: false,
            children: [],
          });
        }
        this.mainService.adminInfo.set(response);
      },
    });
  }

  toggle() {
    this.state = this.state === 'expanded' ? 'collapsed' : 'expanded';
    this.toggleEvent.emit(this.state === 'expanded');
  }

  logout() {
    this.logoutEvent.emit(); // emit to parent
  }
}
