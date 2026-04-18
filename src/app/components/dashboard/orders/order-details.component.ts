import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from '../../../services/store.service';

@Component({
  selector: 'app-order-details',
  standalone: false,
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent implements OnInit {
  order: any = null;
  errorMessage = '';
  private brokenImages = new Set<string>();

  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const orderId = params.get('orderId');
      if (!orderId) {
        this.errorMessage = 'Order not found.';
        return;
      }

      this.storeService.getOrderById(orderId).subscribe({
        next: (order) => {
          this.order = order;
          this.errorMessage = '';
        },
        error: (error) => {
          this.order = null;
          this.errorMessage = error?.error?.message || 'We could not load this order right now.';
        }
      });
    });
  }

  getStatusLabel(status: string): string {
    const normalized = String(status || '').replace(/-/g, ' ');
    return normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : 'Unknown';
  }

  getStatusClass(status: string): string {
    if (status === 'payment-failed' || status === 'cancelled') {
      return 'status-failed';
    }
    if (status === 'pending-payment') {
      return 'status-pending';
    }
    return 'status-success';
  }

  getVariantLabel(selection?: { design?: string; color?: string; size?: string } | null): string {
    return [selection?.design, selection?.color, selection?.size].filter((value): value is string => !!value).join(' / ');
  }

  hasValidImage(key: string, imageUrl?: string | null): boolean {
    return !!imageUrl && !this.brokenImages.has(key);
  }

  markImageBroken(key: string): void {
    this.brokenImages.add(key);
  }
}
