import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiEndpoints } from '../../core/config/apiEndpoints';
import { MainService } from '../../core/services/main.service';

@Component({
  selector: 'app-admin-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-form.component.html',
  styleUrl: './admin-form.component.scss',
})
export class AdminFormComponent {
  form!: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AdminFormComponent>,
    private mainService: MainService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    console.log(data);

    this.form = this.fb.group({
      id: [data?.id ?? -1, Validators.required],

      fullName: [data?.fullName ?? '', Validators.required],

      username: [data?.username ?? '', Validators.required],

      password: ['', data?.id > 0 ? [] : [Validators.required]],

      role: [data?.role ?? 'operator', Validators.required],
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.mainService
        .post(
          this.form.value.id > 0
            ? ApiEndpoints.admin.edit
            : ApiEndpoints.admin.add,

          this.mainService.getFormData(this.form),
        )
        .subscribe({
          next: (response: any) => {
            if (response?.error) {
              this.mainService.error(response?.error);
              return;
            }

            this.mainService.success('عملیات با موفقیت انجام شد.');

            this.onCancel();
          },
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close(true);
  }
}
