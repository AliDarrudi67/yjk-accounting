import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiEndpoints } from '../../core/config/apiEndpoints';
import { AuthService } from '../../core/services/auth.service';
import { MainService } from '../../core/services/main.service';

@Component({
  selector: 'app-admin-permission',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-permission.component.html',
  styleUrl: './admin-permission.component.scss',
})
export class AdminPermissionComponent implements OnInit {
  adminId: number = 0;
  data: any[] = []; // لیست کل شرکت‌ها و حساب‌ها برای نمایش
  adminInfo: any;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    public mainService: MainService,
  ) {
    this.adminId = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit() {
    this.loadCompanies();
  }

  loadCompanies() {
    this.mainService.get(ApiEndpoints.company.list).subscribe({
      next: (response: any) => {
        if (response?.data) {
          // تبدیل داده‌های خام API به ساختار مورد نیاز کامپوننت
          this.data = response.data.map((company: any) => ({
            id: company.id,
            name: company.title,
            selected: false,
            accounts: (company.accounts || []).map((acc: any) => ({
              id: acc.id,
              name: `${acc.bank} - ${acc.information}`,
              selected: false,
            })),
          }));

          this.checkPermisions();
        }
      },
    });
  }

  checkPermisions() {
    console.log(this.data);
    this.mainService
      .get(ApiEndpoints.admin.permissions(this.adminId))
      .subscribe({
        next: (response: any) => {
          const info = response;
          this.adminInfo = info;
          if (!info?.permissions || this.data.length === 0) return;

          const companyPermissions = info.permissions.companies || [];
          const accountPermissions = info.permissions.accounts || [];
          console.log(companyPermissions);
          // آپدیت وضعیت selected بدون از دست دادن ساختار اصلی data
          this.data.forEach((company) => {
            company.selected = companyPermissions.includes(+company.id);
            company.accounts.forEach((acc: any) => {
              acc.selected = accountPermissions.includes(+acc.id);
            });
          });
        },
      });
  }

  toggleAll(status: boolean) {
    this.data.forEach((company) => {
      company.selected = status;
      company.accounts.forEach((acc: any) => (acc.selected = status));
    });
  }

  toggleCompany(company: any) {
    company.accounts.forEach((acc: any) => (acc.selected = company.selected));
  }

  toggleAccount(company: any) {
    // اگر حداقل یک حساب انتخاب شده باشد، تیک شرکت هم بخورد
    if (company.accounts.some((a: any) => a.selected)) {
      company.selected = true;
    }
  }

  save() {
    // شرکتی که انتخاب شده ولی هیچ حسابی از آن انتخاب نشده
    const invalidCompany = this.data.find(
      (company) =>
        company.selected && !company.accounts.some((acc: any) => acc.selected),
    );

    if (invalidCompany) {
      this.mainService.error(
        `برای شرکت «${invalidCompany.name}» حداقل یک حساب را انتخاب کنید.`,
      );
      return;
    }

    const companyIds = this.data.filter((c) => c.selected).map((c) => c.id);
    const accountIds = this.data
      .flatMap((c) => c.accounts)
      .filter((a) => a.selected)
      .map((a) => a.id);

    const formData = new FormData();
    formData.append('adminId', this.adminId.toString());

    companyIds.forEach((id) => {
      formData.append('companyIds[]', id.toString());
    });

    accountIds.forEach((id) => {
      formData.append('accountIds[]', id.toString());
    });

    this.mainService
      .post(ApiEndpoints.admin_permission.save, formData)
      .subscribe({
        next: (response: any) => {
          if (response?.error) {
            this.mainService.error(response?.error);
            return;
          }
          this.mainService.success('عملیات با موفقیت انجام شد');
        },
      });
  }
}
