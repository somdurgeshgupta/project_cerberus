import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StoreProduct, StoreService } from '../../services/store.service';

@Component({
  selector: 'app-products-page',
  standalone: false,
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.css'
})
export class ProductsPageComponent {
  heroProducts: StoreProduct[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private storeService: StoreService
  ) {
    this.storeService.getProducts().subscribe((products) => {
      this.heroProducts = products.slice(0, 3);
    });
  }

  openDetails(productId: string): void {
    this.router.navigate(['/products', productId]);
  }

  startPurchase(productId: string): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard/checkout'], {
        queryParams: { source: 'buy-now', productId }
      });
      return;
    }

    this.router.navigate(['/login'], {
      queryParams: { returnUrl: `/dashboard/checkout?source=buy-now&productId=${productId}` }
    });
  }

  addToCart(productId: string): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/products/${productId}` }
      });
      return;
    }

    this.storeService.addToCart(productId).subscribe(() => {
      this.router.navigate(['/dashboard/cart']);
    });
  }

  addToWishlist(productId: string): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/products/${productId}` }
      });
      return;
    }

    this.storeService.addToWishlist(productId).subscribe(() => {
      this.router.navigate(['/dashboard/wishlist']);
    });
  }
}
