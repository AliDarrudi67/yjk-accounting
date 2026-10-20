import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { environment } from '../../../environments/environment';
import { ApiEndpoints } from '../../core/config/apiEndpoints';
import { MainService } from '../../core/services/main.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-view-transaction',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './view-transaction.component.html',
  styleUrl: './view-transaction.component.scss',
})
export class ViewTransactionComponent {
  transaction: any;
  mainUrl = environment.mainUrl;

  constructor(
    public dialogRef: MatDialogRef<ViewTransactionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private mainService: MainService,
    private dialog: MatDialog,
  ) {
    console.log(data);
    this.getTransaction();
  }

  getTransaction() {
    this.mainService
      .get(ApiEndpoints.transaction.select(this.data?.id))
      .subscribe({
        next: (response: any) => {
          this.transaction = response?.data;
        },
      });
  }

  applyTransaction() {
    console.log(this.data);
    const dialogRef = this.dialog.open(
      ConfirmDialogComponent,
      this.mainService.defaultDialogConfig,
    );

    dialogRef.afterClosed().subscribe((response: any) => {
      if (response?.result) {
        this.mainService
          .post(
            ApiEndpoints.transaction.applyToBalance,
            this.mainService.getFormDataObject({ id: this.data?.id }),
          )
          .subscribe({
            next: (response: any) => {
              if (response?.error) {
                this.mainService.error(response?.error);
                return;
              }
              this.mainService.success('عملیات با موفقیت انجام شد');
              setTimeout(() => {
                location.reload();
              }, 1000);
            },
          });
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
