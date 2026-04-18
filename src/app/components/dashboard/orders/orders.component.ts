import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '../../../services/store.service';

@Component({
  selector: 'app-orders',
  standalone: false,
  
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  private brokenImages = new Set<string>();

  constructor(
    private storeService: StoreService,
    private router: Router
  ) {}

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

  getPrimaryItem(order: any): any {
    return order?.items?.[0] || null;
  }

  getRemainingItemCount(order: any): number {
    return Math.max(0, Number(order?.items?.length || 0) - 1);
  }

  getVariantLabel(selection?: { design?: string; color?: string; size?: string } | null): string {
    return [selection?.design, selection?.color, selection?.size].filter((value): value is string => !!value).join(' / ');
  }

  hasValidImage(orderId: string, imageUrl?: string | null): boolean {
    return !!imageUrl && !this.brokenImages.has(orderId);
  }

  markImageBroken(orderId: string): void {
    this.brokenImages.add(orderId);
  }

  openOrder(orderId: string): void {
    this.router.navigate(['/dashboard/orders', orderId]);
  }
}
