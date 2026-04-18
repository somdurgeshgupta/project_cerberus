import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../../services/store.service';

@Component({
  selector: 'app-orders',
  standalone: false,
  
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];

  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    this.storeService.getOrders().subscribe((orders) => {
      this.orders = orders;
    });
  }

  getStatusLabel(order: any): string {
    const status = String(order?.status || '').replace(/-/g, ' ');
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
  }

  getStatusClass(order: any): string {
    const status = String(order?.status || '');
    if (status === 'payment-failed' || status === 'cancelled') {
      return 'status-failed';
    }
    if (status === 'pending-payment') {
      return 'status-pending';
    }
    return 'status-success';
  }

  getDisplayDate(order: any): string | null {
    return order?.updatedAt || order?.placedAt || null;
  }
}
