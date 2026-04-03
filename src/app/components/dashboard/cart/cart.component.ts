import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreCollectionState, StoreService } from '../../../services/store.service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  storeState?: StoreCollectionState;
  loading = false;

  constructor(
    private storeService: StoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.storeService.getMyStore().subscribe({
      next: (state) => {
        this.storeState = state;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    const nextQuantity = Math.max(1, quantity);
    this.storeService.updateCartQuantity(productId, nextQuantity).subscribe((state) => {
      this.storeState = state;
    });
  }

  removeItem(productId: string): void {
    this.storeService.removeFromCart(productId).subscribe((state) => {
      this.storeState = state;
    });
  }

  goToCheckout(): void {
    this.router.navigate(['/dashboard/checkout']);
  }
}
