import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MainService } from '../../core/services/main.service';

@Component({
  selector: 'app-text-viewer',
  standalone: true,
  imports: [],
  templateUrl: './text-viewer.component.html',
  styleUrl: './text-viewer.component.scss',
})
export class TextViewerComponent {
  constructor(
    public dialogRef: MatDialogRef<TextViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private mainService: MainService,
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
