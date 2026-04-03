import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StoreProduct, StoreService } from '../../services/store.service';

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  product?: StoreProduct;
  relatedProducts: StoreProduct[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const productId = params.get('id');
      if (!productId) {
        this.router.navigate(['/listing']);
        return;
      }

      this.storeService.getProductById(productId).subscribe({
        next: (product) => {
          this.product = product;
        },
        error: () => this.router.navigate(['/listing'])
      });

      this.storeService.getProducts().subscribe((products) => {
        this.relatedProducts = products.filter((item) => item.id !== productId).slice(0, 3);
      });
    });
  }

  proceedToBuy(): void {
    if (!this.product) {
      return;
    }

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard/checkout'], {
        queryParams: { source: 'buy-now', productId: this.product.id }
      });
      return;
    }

    this.router.navigate(['/login'], {
      queryParams: { returnUrl: `/dashboard/checkout?source=buy-now&productId=${this.product.id}` }
    });
  }

  addToCart(): void {
    if (!this.product) {
      return;
    }

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/products/${this.product.id}` }
      });
      return;
    }

    this.storeService.addToCart(this.product.id).subscribe(() => {
      this.router.navigate(['/dashboard/cart']);
    });
  }

  addToWishlist(): void {
    if (!this.product) {
      return;
    }

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/products/${this.product.id}` }
      });
      return;
    }

    this.storeService.addToWishlist(this.product.id).subscribe(() => {
      this.router.navigate(['/dashboard/wishlist']);
    });
  }
}
