import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiEndpoints } from '../../../core/config/apiEndpoints';
import { MainService } from '../../../core/services/main.service';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-latest-transactions',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './latest-transactions.component.html',
  styleUrl: './latest-transactions.component.scss',
})
export class LatestTransactionsComponent implements OnInit {
  transactions: any[] = [];

  constructor(private mainService: MainService) {}

  ngOnInit(): void {
    this.getLatestTransactions();
  }

  getLatestTransactions() {
    this.mainService
      .get(ApiEndpoints.transaction.latestTransactions)
      .subscribe({
        next: (response: any) => {
          this.transactions = response?.data;
        },
      });
  }
}
