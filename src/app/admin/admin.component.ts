import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { ApiEndpoints } from '../core/config/apiEndpoints';
import { MainService } from '../core/services/main.service';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { AdminFormComponent } from './admin-form/admin-form.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  admins: any[] = [];

  constructor(
    private dialog: MatDialog,
    private mainService: MainService,
  ) {}

  ngOnInit(): void {
    this.getAdmins();
  }

  getAdmins() {
    this.mainService.get(ApiEndpoints.admin.list).subscribe({
      next: (response: any) => {
        this.admins = response?.data;
      },
    });
  }

  showAdminForm(data: any = {}) {
    const dialogConfig = this.mainService.defaultDialogConfig;
    dialogConfig.data = data;
    const dialogRef = this.dialog.open(AdminFormComponent, dialogConfig);
    dialogRef.afterClosed().subscribe({
      next: (response: any) => {
        this.getAdmins();
      },
    });
  }

  deleteAdmin(admin: any) {
    const dialogRef = this.dialog.open(
      ConfirmDialogComponent,
      this.mainService.defaultDialogConfig,
    );

    dialogRef.afterClosed().subscribe((response: any) => {
      if (response?.result) {
        this.mainService.delete(ApiEndpoints.admin.delete, admin.id).subscribe({
          next: (response: any) => {
            if (response?.error) {
              this.mainService.error(response?.error);
              return;
            }
            this.mainService.success('عملیات با موفقیت انجام شد ');
            this.getAdmins();
          },
        });
      }
    });
  }
}
